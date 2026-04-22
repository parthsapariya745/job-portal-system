const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./server/models/User');
const Company = require('./server/models/Company');
const Job = require('./server/models/Job');

dotenv.config({ path: './server/.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clean up previous test runs
        await Job.deleteMany({ title: /Test/ });
        
        // Create Recruiter if not exists
        let recruiter = await User.findOne({ email: 'recruiter@test.com' });
        if (!recruiter) {
             recruiter = await User.create({
                name: 'Test Recruiter',
                email: 'recruiter@test.com',
                password: 'password123',
                role: 'Company'
            });
        }

        // Create Company if not exists
        let company = await Company.findOne({ userId: recruiter._id });
        if (!company) {
             company = await Company.create({
                name: 'Test Corp',
                userId: recruiter._id,
                description: 'A great company',
                industry: 'Technology',
                location: 'San Francisco, CA',
                status: 'approved'
            });
        }

        // Create Jobs
        const jobs = [
            {
                title: 'Junior React Developer - Test',
                description: 'We are looking for a junior react dev.',
                requirements: 'React, JS',
                type: 'Full-time',
                category: 'Development',
                level: 'Entry Level',
                location: 'Remote',
                salary: { min: 50000, max: 70000 },
                company: company._id,
                user: recruiter._id,
                status: 'open'
            },
            {
                title: 'Mid-Level Backend Node.js - Test',
                description: 'We need a node js developer.',
                requirements: 'Node, Express, Mongo',
                type: 'Contract',
                category: 'Development',
                level: 'Mid Level',
                location: 'New York, NY',
                salary: { min: 90000, max: 120000 },
                company: company._id,
                user: recruiter._id,
                status: 'open'
            },
            {
                title: 'Senior Full Stack Engineer - Test',
                description: 'Leading the team.',
                requirements: 'React, Node, AWS',
                type: 'Full-time',
                category: 'Engineering',
                level: 'Senior Level',
                location: 'San Francisco, CA',
                salary: { min: 130000, max: 180000 },
                company: company._id,
                user: recruiter._id,
                status: 'open'
            },
            {
                title: 'Marketing Intern - Test',
                description: 'Help us with social media.',
                requirements: 'Social Media, Writing',
                type: 'Internship',
                category: 'Marketing',
                level: 'Internship',
                location: 'Remote',
                salary: { min: 30000, max: 40000 },
                company: company._id,
                user: recruiter._id,
                status: 'open'
            }
        ];

        await Job.insertMany(jobs);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
