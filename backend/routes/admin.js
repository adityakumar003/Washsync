const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Add new machine (Admin only)
router.post('/machines', auth, isAdmin, async (req, res) => {
    try {
        const { name, branchId } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Machine name is required' });
        }

        if (!branchId) {
            return res.status(400).json({ error: 'Branch is required' });
        }

        // Check if branch exists
        const Branch = require('../models/Branch');
        const branch = await Branch.findById(branchId);
        if (!branch) {
            return res.status(400).json({ error: 'Invalid branch' });
        }

        // Check if machine already exists in this branch
        const existing = await Machine.findOne({ name, branch: branchId });
        if (existing) {
            return res.status(400).json({ error: 'Machine with this name already exists in this branch' });
        }

        const machine = new Machine({ name, branch: branchId });
        await machine.save();

        await machine.populate('branch', 'name code');

        res.status(201).json({
            message: 'Machine added successfully',
            machine
        });
    } catch (error) {
        console.error('Add machine error:', error);
        res.status(500).json({ error: 'Failed to add machine' });
    }
});

// Delete machine (Admin only)
router.delete('/machines/:id', auth, isAdmin, async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        await Machine.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Machine deleted successfully'
        });
    } catch (error) {
        console.error('Delete machine error:', error);
        res.status(500).json({ error: 'Failed to delete machine' });
    }
});

// Update machine status (Admin only)
router.patch('/machines/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['Available', 'InUse', 'Maintenance'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // If setting to maintenance, clear current user and timer
        if (status === 'Maintenance') {
            machine.currentUser = null;
            machine.timerStart = null;
            machine.timerEnd = null;
            machine.duration = null;
        }

        machine.status = status;
        await machine.save();

        res.json({
            message: 'Machine status updated successfully',
            machine
        });
    } catch (error) {
        console.error('Update machine status error:', error);
        res.status(500).json({ error: 'Failed to update machine status' });
    }
});

// Get all users (Admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('branch', 'name code')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Assign user to branch (Admin only)
router.patch('/users/:id/branch', auth, isAdmin, async (req, res) => {
    try {
        const { branchId } = req.body;

        if (!branchId) {
            return res.status(400).json({ error: 'Branch ID is required' });
        }

        // Check if branch exists
        const Branch = require('../models/Branch');
        const branch = await Branch.findById(branchId);
        if (!branch) {
            return res.status(400).json({ error: 'Invalid branch' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isAdmin) {
            return res.status(400).json({ error: 'Cannot assign branch to admin users' });
        }

        user.branch = branchId;
        await user.save();

        await user.populate('branch', 'name code');

        res.json({
            message: 'User branch updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user branch error:', error);
        res.status(500).json({ error: 'Failed to update user branch' });
    }
});

// Override machine state (Admin only) - Force release
router.post('/machines/:id/override', auth, isAdmin, async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({ error: 'Machine not found' });
        }

        // Force release
        machine.status = 'Available';
        machine.currentUser = null;
        machine.timerStart = null;
        machine.timerEnd = null;
        machine.duration = null;

        await machine.save();

        res.json({
            message: 'Machine state overridden successfully',
            machine
        });
    } catch (error) {
        console.error('Override machine error:', error);
        res.status(500).json({ error: 'Failed to override machine state' });
    }
});

module.exports = router;
