const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Get user's notifications
router.get('/', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.userId })
            .populate('machineId', 'name')
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications

        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            user: req.userId,
            read: false
        });

        res.json({ count });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        res.json({
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// Mark all notifications as read
router.post('/read-all', auth, async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.userId, read: false },
            { read: true }
        );

        res.json({
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
});

module.exports = router;
