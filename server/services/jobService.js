const Job = require("../models/Job");
const Company = require("../models/Company");
const AppError = require("../utils/AppError");

class JobService {
  async getJobs(query) {
    const {
      keyword,
      location,
      type,
      category,
      sort,
      minSalary,
      maxSalary,
      salaryType,
      experience, // 'entry', 'mid', 'senior', 'executive'
      companyId, // Filter by company
      userId, // Filter by user (recuriter)
      page = 1,
      limit = 10,
    } = query;

    // Build query - when userId provided (company manage jobs), show all statuses
    let mongoQuery = { isDeleted: false };
    if (!userId) {
      mongoQuery.status = "open";
    }

    if (keyword) {
      mongoQuery.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { requirements: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      mongoQuery.location = { $regex: location, $options: "i" };
    }

    if (category) {
      const categories = Array.isArray(category) ? category : category.split(",").map((c) => c.trim()).filter(Boolean);
      if (categories.length > 0) {
        mongoQuery.category = { $in: categories.map((c) => new RegExp(`^${c}$`, "i")) };
      }
    }

    if (companyId) {
      mongoQuery.company = companyId;
    }

    if (userId) {
      mongoQuery.user = userId;
    }

    // Job Type: Allow single string or array
    if (type) {
      const types = Array.isArray(type) ? type : type.split(",");
      // If frontend sends 'full-time', map to 'Full-time' if specific formatting needed,
      // but assuming case-insensitive or exact match from frontend constants.
      // Current Enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
      // We'll use regex for case-insensitive matching if needed, or $in if exact.
      // Let's use $in with regex to be safe
      mongoQuery.type = {
        $in: types.map((t) => new RegExp(`^${t.trim()}$`, "i")),
      };
    }

    // Experience Level Mapping
    if (experience) {
      const levels = Array.isArray(experience)
        ? experience
        : experience.split(",");
      const levelMap = {
        entry: "Entry Level",
        mid: "Mid Level",
        senior: "Senior Level",
        internship: "Internship",
        executive: "Senior Level", // Map executive to Senior for now or add to Enum
      };

      const mappedLevels = levels
        .map((l) => levelMap[l.toLowerCase()] || l)
        .filter(Boolean);

      if (mappedLevels.length > 0) {
        mongoQuery.level = { $in: mappedLevels };
      }
    }

    // Salary Filtering
    // Jobs paying AT LEAST minSalary: salary.max >= minSalary
    if (minSalary) {
      // We match if the job's maximum salary is at least the requested minimum
      // e.g. User wants > 50k. Job is 40k-60k. Max (60) >= 50. Match.
      mongoQuery["salary.max"] = { $gte: Number(minSalary) };
    }

    // Jobs paying AT MOST maxSalary: salary.min <= maxSalary
    // e.g. User wants < 100k. Job is 110k-150k. Min (110) > 100. No match.
    if (maxSalary) {
      mongoQuery["salary.min"] = { $lte: Number(maxSalary) };
    }

    if (salaryType) {
      mongoQuery["salary.salaryType"] = salaryType;
    }

    // Pagination
    const skip = (page - 1) * limit;

    let jobsPromise = Job.find(mongoQuery)
      .populate("company", "name logo location")
      .skip(skip)
      .limit(parseInt(limit));

    // Sorting
    if (sort === "latest") {
      jobsPromise = jobsPromise.sort("-createdAt");
    } else if (sort === "oldest") {
      jobsPromise = jobsPromise.sort("createdAt");
    } else if (sort === "salary-high") {
      jobsPromise = jobsPromise.sort({ "salary.max": -1 });
    } else if (sort === "salary-low") {
      jobsPromise = jobsPromise.sort({ "salary.min": 1 });
    } else {
      jobsPromise = jobsPromise.sort("-createdAt");
    }

    const jobs = await jobsPromise;
    const total = await Job.countDocuments(mongoQuery);

    return {
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    };
  }

  async getJobById(id) {
    const job = await Job.findById(id).populate("company");
    if (!job || job.isDeleted) {
      throw new AppError("Job not found", 404);
    }
    return job;
  }

  async createJob(jobData, userId) {
    // Check if company exists for user
    // Simplified: We accept companyName in body to auto-create or find
    // But Strict requirement says: Company should ideally exist.
    // We will keep the logic from before for UX but move it here.

    let company;
    if (jobData.companyId) {
      // If explicit ID provided
      company = await Company.findById(jobData.companyId);
    } else {
      // Try to find if user is owner OR recruiter of a company
      company = await Company.findOne({ 
        $or: [{ owner: userId }, { recruiters: userId }] 
      });
    }

    // Fallback: Create company if missing (ONLY for 'Company' role, not HR)
    if (!company) {
      // We should check user role here ideally, but for now we'll create if not found
      company = await Company.create({
        name: jobData.companyName || "My Company",
        description: "Auto-generated company profile",
        industry: jobData.category || "General",
        location: jobData.location || "Not specified",
        owner: userId,
      });
    }

    // Parse salary: support string "50k-80k" or object { min, max }
    let salaryObj = { negotiable: false };
    if (typeof jobData.salary === "object" && jobData.salary) {
      salaryObj = { ...jobData.salary, negotiable: jobData.salary.negotiable ?? false };
    } else if (typeof jobData.salary === "string" && jobData.salary.trim()) {
      const match = jobData.salary.match(/(\d+)\s*-\s*(\d+)/i) || jobData.salary.match(/(\d+)\s*k?\s*-\s*(\d+)\s*k?/i);
      if (match) {
        let min = parseInt(match[1], 10);
        let max = parseInt(match[2], 10);
        if (jobData.salary.toLowerCase().includes("k")) {
          min = min < 1000 ? min * 1000 : min;
          max = max < 1000 ? max * 1000 : max;
        }
        salaryObj = { min, max, negotiable: false };
      }
    }
    if (jobData.salaryMin != null) salaryObj.min = Number(jobData.salaryMin);
    if (jobData.salaryMax != null) salaryObj.max = Number(jobData.salaryMax);
    if (jobData.salaryNegotiable) salaryObj.negotiable = true;

    const { salaryMin, salaryMax, salaryNegotiable, companyName: _, ...rest } = jobData;
    const job = await Job.create({
      ...rest,
      salary: salaryObj,
      company: company._id,
      user: userId,
    });

    // --- Create Notifications for Job Seekers ---
    try {
      const User = require("../models/User");
      const Notification = require("../models/Notification");
      
      // Send notification to all active Job Seekers
      const jobSeekers = await User.find({ role: "Job Seeker" }).select("_id");
      
      if (jobSeekers.length > 0) {
        const notifications = jobSeekers.map((seeker) => ({
          user: seeker._id,
          title: "New Job Posted!",
          message: `${company.name} has posted a new job: ${job.title}. Check it out!`,
          type: "info",
          actionUrl: `/jobs/${job._id}`
        }));
        
        // Bulk insert notifications to avoid N queries
        await Notification.insertMany(notifications);
      }
    } catch (err) {
      console.error("Failed to send job notifications:", err);
    }

    return job;
  }

  async updateJob(jobId, userId, updateData) {
    const job = await Job.findById(jobId).populate('company');
    if (!job || job.isDeleted) {
      throw new AppError("Job not found", 404);
    }
    
    // Check if user is the one who posted it OR the owner of the company
    const isPoster = job.user.toString() === userId.toString();
    const isCompanyOwner = job.company?.owner?.toString() === userId.toString();
    
    if (!isPoster && !isCompanyOwner) {
      throw new AppError("Not authorized to update this job", 403);
    }
    if (updateData.salary && typeof updateData.salary === "object") {
      // Keep existing salary fields, merge updates
      job.salary = { ...job.salary.toObject(), ...updateData.salary };
      delete updateData.salary;
    }
    const updated = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
    }).populate("company", "name logo location");
    return updated;
  }

  async deleteJob(jobId, userId) {
    const job = await Job.findById(jobId).populate('company');
    if (!job || job.isDeleted) {
      throw new AppError("Job not found", 404);
    }
    
    const isPoster = job.user.toString() === userId.toString();
    const isCompanyOwner = job.company?.owner?.toString() === userId.toString();

    if (!isPoster && !isCompanyOwner) {
      throw new AppError("Not authorized to delete this job", 403);
    }
    job.isDeleted = true;
    await job.save({ validateBeforeSave: false });
    return { message: "Job deleted successfully" };
  }
}

module.exports = new JobService();
