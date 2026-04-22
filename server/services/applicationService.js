const Application = require("../models/Application");
const Job = require("../models/Job");
const AppError = require("../utils/AppError");

class ApplicationService {
  async applyForJob(userId, jobId, resume) {
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job || job.status !== "open") {
      throw new AppError("Job not found or closed", 404);
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      throw new AppError("You have already applied for this job", 400);
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      company: job.company,
      resume,
    });

    // Update applicants count
    job.applicantsCount = job.applicantsCount + 1;
    await job.save();

    // --- Notify Recruiter ---
    try {
      const Notification = require("../models/Notification");
      const User = require("../models/User");
      const applicantUser = await User.findById(userId);
      
      await Notification.create({
        user: job.user, // Recruiter
        title: "New Job Application!",
        message: `${applicantUser.name} has applied for your job post: ${job.title}`,
        type: "info",
        actionUrl: `/company/applications`
      });
    } catch (err) {
      console.error("Failed to notify recruiter:", err);
    }

    return application;
  }

  async getApplicationsByUser(userId) {
    return await Application.find({ applicant: userId })
      .populate("job", "title status location type salary")
      .populate("company", "name logo");
  }

  async getApplicationsByJob(jobId) {
    return await Application.find({ job: jobId }).populate(
      "applicant",
      "name email profile",
    );
  }

  async getApplicationsByCompany(companyId) {
    return await Application.find({ company: companyId })
      .populate("job", "title")
      .populate("applicant", "name email profile resume")
      .sort("-createdAt");
  }

  async updateStatus(id, status) {
    const application = await Application.findById(id);
    if (!application) {
      throw new AppError("Application not found", 404);
    }

    application.status = status;
    await application.save();

    // --- Notify Applicant ---
    try {
      const Notification = require("../models/Notification");
      const populatedApp = await Application.findById(id)
        .populate("job", "title")
        .populate("company", "name");
      
      await Notification.create({
        user: application.applicant,
        title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}!`,
        message: `Your application for ${populatedApp.job.title} at ${populatedApp.company.name} has been marked as ${status}.`,
        type: status === "rejected" ? "error" : status === "accepted" ? "success" : "info",
        actionUrl: `/applications`
      });
    } catch (err) {
      console.error("Failed to notify applicant:", err);
    }

    return application;
  }
}

module.exports = new ApplicationService();
