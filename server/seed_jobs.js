const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config({ path: './.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clean up previous test runs
        await Job.deleteMany({ title: /Test/ });
        await Company.deleteMany({ name: 'Test Corp' });
        await User.deleteMany({ email: 'recruiter@test.com' });
        
        console.log('Creating Recruiter...');
        // Create Recruiter
        const suffix = Date.now();
        const recruiter = await User.create({
            name: `Test Recruiter ${suffix}`,
            email: `recruiter${suffix}@test.com`,
            password: 'password123',
            role: 'Company'
        });
        console.log('Recruiter created:', recruiter._id);

        console.log('Creating Company...');
        // Create Company
        const company = await Company.create({
            name: `Test Corp ${suffix}`,
            owner: recruiter._id,
            description: 'A great company',
            industry: 'Technology',
            location: 'San Francisco, CA',
            size: '11-50',
            isActive: true
        });
        console.log('Company created:', company._id);

        // Create Jobs
        const jobs = [
            // ... (keep rest same)
        ];

        await Job.insertMany(jobs);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error('SEED ERROR:');
        console.error(error.message);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(` - ${key}: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seedData();
