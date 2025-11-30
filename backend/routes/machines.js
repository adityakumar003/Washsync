const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

// Get all machines
router.get('/', auth, async (req, res) => {
    try {
        let query = {};

        // Regular users can only see machines from their branch
        if (!req.user.isAdmin) {
            if (!req.user.branch) {
                return res.status(400).json({ error: 'You are not assigned to any branch. Please contact admin.' });
            }
            query.branch = req.user.branch;
        } else {
            // Admin can filter by branch or see all
            if (req.query.branchId) {
                query.branch = req.query.branchId;
            }
        }

        const machines = await Machine.find(query)
            .populate('currentUser', 'name email')
            .populate('queue.user', 'name email')
            .populate('branch', 'name code')
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
            .populate('queue.user', 'name email')
            .populate('branch', 'name code');

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Regular users can only access machines from their branch
        if (!req.user.isAdmin && machine.branch._id.toString() !== req.user.branch?.toString()) {
            return res.status(403).json({ error: 'Access denied. This machine belongs to a different branch.' });
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

        const machine = await Machine.findById(req.params.id).populate('branch', 'name');

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Verify user is in the same branch as the machine
        if (!req.user.isAdmin && machine.branch._id.toString() !== req.user.branch?.toString()) {
            return res.status(403).json({ error: 'You can only use machines in your assigned branch.' });
        }

        if (machine.status === 'Maintenance') {
            return res.status(400).json({ error: 'Machine is under maintenance' });
        }

        if (machine.status === 'InUse') {
            return res.status(400).json({ error: 'Machine is currently in use' });
        }

        // Check if user is currently using ANY other machine
        const userCurrentlyUsing = await Machine.findOne({
            currentUser: req.userId,
            status: 'InUse',
            branch: req.user.branch
        });

        if (userCurrentlyUsing) {
            return res.status(400).json({
                error: `You are currently using "${userCurrentlyUsing.name}". Please finish or release it first.`
            });
        }

        // Check if user is in queue for ANY other machine
        const userInOtherQueue = await Machine.findOne({
            _id: { $ne: req.params.id }, // Not this machine
            'queue.user': req.userId,
            branch: req.user.branch
        });

        if (userInOtherQueue) {
            return res.status(400).json({
                error: `You are in the queue for "${userInOtherQueue.name}". Please leave that queue first.`
            });
        }

        // Remove user from queue if they were in it for THIS machine
        const wasInQueue = machine.queue.some(item => item.user.toString() === req.userId.toString());
        if (wasInQueue) {
            machine.queue = machine.queue.filter(item => item.user.toString() !== req.userId.toString());
            console.log(`User ${req.userId} removed from queue for machine ${machine.name}`);
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
        await machine.populate('queue.user', 'name email');

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

            // Remove them from queue since machine is available
            machine.queue.shift();
            await machine.save();
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
        const machine = await Machine.findById(req.params.id).populate('branch', 'name');

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Verify user is in the same branch as the machine
        if (!req.user.isAdmin && machine.branch._id.toString() !== req.user.branch?.toString()) {
            return res.status(403).json({ error: 'You can only join queues for machines in your assigned branch.' });
        }

        if (machine.status === 'Maintenance') {
            return res.status(400).json({ error: 'Machine is under maintenance' });
        }

        if (machine.currentUser?.toString() === req.userId.toString()) {
            return res.status(400).json({ error: 'You are currently using this machine' });
        }

        // Check if user is currently using ANY machine in their branch
        const userCurrentlyUsing = await Machine.findOne({
            currentUser: req.userId,
            status: 'InUse',
            branch: req.user.branch
        });

        if (userCurrentlyUsing) {
            return res.status(400).json({
                error: `You are currently using "${userCurrentlyUsing.name}". Please finish or release it before joining another queue.`
            });
        }

        // Check if user is already in queue for ANY machine (including this one)
        const userInAnyQueue = await Machine.findOne({
            'queue.user': req.userId,
            branch: req.user.branch
        });

        if (userInAnyQueue) {
            if (userInAnyQueue._id.toString() === req.params.id) {
                return res.status(400).json({ error: 'You are already in the queue for this machine' });
            } else {
                return res.status(400).json({
                    error: `You are already in the queue for "${userInAnyQueue.name}". Please leave that queue first.`
                });
            }
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
