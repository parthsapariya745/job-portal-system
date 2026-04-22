const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('./models/Notification');
const Job = require('./models/Job');

dotenv.config();

const fixNotifications = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        const notifications = await Notification.find({ title: 'New Job Posted!', actionUrl: null });
        console.log(`Found ${notifications.length} notifications to fix...`);
        
        let count = 0;
        for (const notif of notifications) {
            // Find the job title string inside the message. Format: "Company has posted a new job: {title}. Check it out!"
            const match = notif.message.match(/new job: (.*?)\. Check it out!/);
            if (match && match[1]) {
                const jobTitleMatch = match[1];
                const job = await Job.findOne({ title: jobTitleMatch }).sort('-createdAt');
                if (job) {
                    notif.actionUrl = `/jobs/${job._id}`;
                    await notif.save();
                    count++;
                }
            }
        }
        
        console.log(`Successfully fixed ${count} notifications.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixNotifications();
