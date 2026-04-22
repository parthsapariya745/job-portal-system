const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const AppError = require('../utils/AppError');

class AdminService {
    async getDashboardStats() {
        const users = await User.countDocuments();
        const companies = await Company.countDocuments();
        const jobs = await Job.countDocuments();
        const pendingCompanies = await Company.countDocuments({ status: 'pending' });

        return { users, companies, jobs, pendingCompanies };
    }

    async approveCompany(companyId) {
        const company = await Company.findByIdAndUpdate(companyId, { status: 'approved' }, { new: true });
        if (!company) throw new AppError('Company not found', 404);
        return company;
    }

    async rejectCompany(companyId) {
        const company = await Company.findByIdAndUpdate(companyId, { status: 'rejected' }, { new: true });
        if (!company) throw new AppError('Company not found', 404);
        return company;
    }

    async verifyUser(userId) { // Or block/unblock
         // Implementation
    }
}

module.exports = new AdminService();
