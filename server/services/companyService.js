const Company = require('../models/Company');
const User = require('../models/User');
const AppError = require('../utils/AppError');

class CompanyService {
    async registerCompany(data, userId) {
        const existingCompany = await Company.findOne({ name: data.name });
        if (existingCompany) {
            throw new AppError('Company name already taken', 400);
        }

        const company = await Company.create({
            ...data,
            owner: userId, // Match Model
            status: 'pending' // Requires admin approval ideally
        });
        return company;
    }

    async getCompanies(query) {
        const companies = await Company.find({ status: 'approved', isDeleted: false });
        return companies;
    }

    async getCompanyByOwner(userId) {
        return await Company.findOne({ owner: userId });
    }

    async addRecruiter(companyOwnerId, recruiterEmail) {
        const company = await Company.findOne({ owner: companyOwnerId });
        if (!company) {
            throw new AppError('Company not found for this owner', 404);
        }

        const recruiterUser = await User.findOne({ email: recruiterEmail });
        if (!recruiterUser) {
            throw new AppError('User not found with this email', 404);
        }

        if (recruiterUser.role !== 'Company HR') {
            throw new AppError('User must have Company HR role to be added as a recruiter', 400);
        }

        // Check if already in recruiters
        if (company.recruiters && company.recruiters.includes(recruiterUser._id)) {
            throw new AppError('User is already a recruiter for this company', 400);
        }

        company.recruiters.push(recruiterUser._id);
        await company.save();

        return company;
    }
}

module.exports = new CompanyService();
