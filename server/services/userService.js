const User = require("../models/User");
const AppError = require("../utils/AppError");

class UserService {
  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    // Check for nested profile updates
    if (updateData.profile) {
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Merge existing profile with new data
      user.profile = {
        ...user.profile,
        ...updateData.profile,
      };

      // Allow top-level updates as well
      if (updateData.name) user.name = updateData.name;
      if (updateData.phoneNumber) user.phoneNumber = updateData.phoneNumber;
      if (updateData.avatar) user.avatar = updateData.avatar;

      await user.save();
      return user;
    }

    // Default update for non-nested fields
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async uploadResume(id, resumeUrl) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.profile) user.profile = {};
    user.profile.resume = resumeUrl;
    await user.save();
    return user;
  }

  async saveJob(userId, jobId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (!user.profile) user.profile = {};
    if (!user.profile.savedJobs) user.profile.savedJobs = [];

    if (!user.profile.savedJobs.some((id) => id.toString() === jobId.toString())) {
      user.profile.savedJobs.push(jobId);
      await user.save();
    }
    return user;
  }

  async unsaveJob(userId, jobId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    if (!user.profile || !user.profile.savedJobs) return user;

    user.profile.savedJobs = user.profile.savedJobs.filter(
      (id) => id.toString() !== jobId.toString(),
    );
    await user.save();
    return user;
  }

  async getSavedJobs(userId) {
    const user = await User.findById(userId).populate({
      path: "profile.savedJobs",
      populate: { path: "company", select: "name logo location" },
    });
    if (!user) throw new AppError("User not found", 404);
    return user.profile?.savedJobs || [];
  }

  // Job Alerts
  async addJobAlert(userId, alertData) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.jobAlerts.push(alertData);
    await user.save();
    return user.jobAlerts;
  }

  async deleteJobAlert(userId, alertId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.jobAlerts = user.jobAlerts.filter(
      (alert) => alert._id.toString() !== alertId.toString(),
    );
    await user.save();
    return user.jobAlerts;
  }

  async getJobAlerts(userId) {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user.jobAlerts;
  }
}

module.exports = new UserService();
