const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Get all machines
router.get('/', auth, async (req, res) => {
    try {
        const machines = await Machine.find()
            .populate('currentUser', 'name email')
            .populate('queue.user', 'name email')
            .sort({ name: 1 });

        res.json(machines);
    } catch (error) {
        console.error('Get machines error:', error);
        res.status(500).json({ error: 'Failed to fetch machines' });
    }
});

// Get single machine
router.get('/:id', auth, async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id)
            .populate('currentUser', 'name email')
            .populate('queue.user', 'name email');

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        res.json(machine);
    } catch (error) {
        console.error('Get machine error:', error);
        res.status(500).json({ error: 'Failed to fetch machine' });
    }
});

// Occupy a machine (start wash)
router.post('/:id/occupy', auth, async (req, res) => {
    try {
        const { duration } = req.body; // Duration in minutes

        if (!duration || duration < 1 || duration > 180) {
            return res.status(400).json({ error: 'Invalid duration. Must be between 1 and 180 minutes.' });
        }

        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        if (machine.status === 'Maintenance') {
            return res.status(400).json({ error: 'Machine is under maintenance' });
        }

        if (machine.status === 'InUse') {
            return res.status(400).json({ error: 'Machine is currently in use' });
        }

        // Set machine to in use
        machine.status = 'InUse';
        machine.currentUser = req.userId;
        machine.duration = duration;
        machine.timerStart = new Date();
        machine.timerEnd = new Date(Date.now() + duration * 60 * 1000);

        await machine.save();

        // Populate and return
        await machine.populate('currentUser', 'name email');

        res.json({
            message: 'Machine occupied successfully',
            machine
        });
    } catch (error) {
        console.error('Occupy machine error:', error);
        res.status(500).json({ error: 'Failed to occupy machine' });
    }
});

// Release a machine (manual release)
router.post('/:id/release', auth, async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Check if user is the current user or admin
        if (machine.currentUser?.toString() !== req.userId.toString() && !req.user.isAdmin) {
            return res.status(403).json({ error: 'You can only release your own machine' });
        }

        if (machine.status !== 'InUse') {
            return res.status(400).json({ error: 'Machine is not in use' });
        }

        // Release machine
        machine.status = 'Available';
        machine.currentUser = null;
        machine.timerStart = null;
        machine.timerEnd = null;
        machine.duration = null;

        await machine.save();

        // Notify next person in queue if exists
        if (machine.queue.length > 0) {
            const nextUser = machine.queue[0].user;
            await Notification.create({
                user: nextUser,
                message: `Machine "${machine.name}" is now available! It's your turn.`,
                type: 'your_turn',
                machineId: machine._id
            });
        }

        res.json({
            message: 'Machine released successfully',
            machine
        });
    } catch (error) {
        console.error('Release machine error:', error);
        res.status(500).json({ error: 'Failed to release machine' });
    }
});

// Join queue
router.post('/:id/queue/join', auth, async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        if (machine.status === 'Maintenance') {
            return res.status(400).json({ error: 'Machine is under maintenance' });
        }

        if (machine.currentUser?.toString() === req.userId.toString()) {
            return res.status(400).json({ error: 'You are currently using this machine' });
        }

        // Check if user is currently using ANY machine
        const userCurrentlyUsing = await Machine.findOne({
            currentUser: req.userId,
            status: 'InUse'
        });

        if (userCurrentlyUsing) {
            return res.status(400).json({
                error: `You are currently using "${userCurrentlyUsing.name}". Please finish or release it before joining another queue.`
            });
        }

        // Check if already in queue
        const alreadyInQueue = machine.queue.some(
            item => item.user.toString() === req.userId.toString()
        );

        if (alreadyInQueue) {
            return res.status(400).json({ error: 'You are already in the queue' });
        }

        // Add to queue
        machine.queue.push({ user: req.userId });
        await machine.save();

        await machine.populate('queue.user', 'name email');

        const position = machine.queue.length;

        res.json({
            message: `Joined queue successfully. Position: ${position}`,
            position,
            machine
        });
    } catch (error) {
        console.error('Join queue error:', error);
        res.status(500).json({ error: 'Failed to join queue' });
    }
});

// Leave queue
router.post('/:id/queue/leave', auth, async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Check if in queue
        const inQueue = machine.queue.some(
            item => item.user.toString() === req.userId.toString()
        );

        if (!inQueue) {
            return res.status(400).json({ error: 'You are not in the queue' });
        }

        // Remove from queue
        machine.queue = machine.queue.filter(
            item => item.user.toString() !== req.userId.toString()
        );

        await machine.save();
        await machine.populate('queue.user', 'name email');

        res.json({
            message: 'Left queue successfully',
            machine
        });
    } catch (error) {
        console.error('Leave queue error:', error);
        res.status(500).json({ error: 'Failed to leave queue' });
    }
});

module.exports = router;
