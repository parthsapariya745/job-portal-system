const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Or use host/port from env
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(to, subject, html) {
        const mailOptions = {
            from: `Job Portal <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error('Email send error:', error);
            // Don't throw error to prevent blocking main flow (async queue simulation)
        }
    }

    async sendWelcomeEmail(user) {
        const subject = 'Welcome to Job Portal';
        const html = `<h1>Hi ${user.name},</h1><p>Welcome to the best Job Portal.</p>`;
        await this.sendEmail(user.email, subject, html);
    }

    async sendApplicationNotification(user, jobTitle, status) {
        const subject = `Application Update: ${jobTitle}`;
        const html = `<p>Your application for <b>${jobTitle}</b> has been <b>${status}</b>.</p>`;
        await this.sendEmail(user.email, subject, html);
    }
}

module.exports = new EmailService();
