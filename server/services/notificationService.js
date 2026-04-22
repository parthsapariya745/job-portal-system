const Notification = require('../models/Notification');

class NotificationService {
    async createNotification(userId, title, message, type = 'info') {
        return await Notification.create({
            user: userId,
            title,
            message,
            type
        });
    }

    async getUserNotifications(userId) {
        return await Notification.find({ user: userId }).sort('-createdAt');
    }

    async markRead(notificationId) {
        return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    }

    async markAllRead(userId) {
        return await Notification.updateMany({ user: userId, read: false }, { read: true });
    }
}

module.exports = new NotificationService();
