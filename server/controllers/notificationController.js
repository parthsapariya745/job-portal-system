const NotificationService = require('../services/notificationService');
const catchAsync = require('../utils/catchAsync');

const getNotifications = catchAsync(async (req, res) => {
    const notifications = await NotificationService.getUserNotifications(req.user.id);
    res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: { notifications }
    });
});

const markAsRead = catchAsync(async (req, res) => {
    await NotificationService.markRead(req.params.id);
    res.status(200).json({
        status: 'success'
    });
});

const markAllAsRead = catchAsync(async (req, res) => {
    await NotificationService.markAllRead(req.user.id);
    res.status(200).json({
        status: 'success'
    });
});

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
