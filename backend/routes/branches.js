const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const Machine = require('../models/Machine');
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');

// Get all branches (Admin only)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const branches = await Branch.find().sort({ name: 1 });

        // Get machine and user counts for each branch
        const branchesWithStats = await Promise.all(
            branches.map(async (branch) => {
                const machineCount = await Machine.countDocuments({ branch: branch._id });
                const userCount = await User.countDocuments({ branch: branch._id });

                // Get machine status breakdown
                const availableCount = await Machine.countDocuments({ branch: branch._id, status: 'Available' });
                const inUseCount = await Machine.countDocuments({ branch: branch._id, status: 'InUse' });
                const maintenanceCount = await Machine.countDocuments({ branch: branch._id, status: 'Maintenance' });

                return {
                    ...branch.toObject(),
                    stats: {
                        totalMachines: machineCount,
                        availableMachines: availableCount,
                        inUseMachines: inUseCount,
                        maintenanceMachines: maintenanceCount,
                        totalUsers: userCount
                    }
                };
            })
        );

        res.json(branchesWithStats);
    } catch (error) {
        console.error('Get branches error:', error);
        res.status(500).json({ error: 'Failed to fetch branches' });
    }
});

// Get active branches (for user registration)
router.get('/active', async (req, res) => {
    try {
        const branches = await Branch.find({ isActive: true })
            .select('name location code')
            .sort({ name: 1 });

        res.json(branches);
    } catch (error) {
        console.error('Get active branches error:', error);
        res.status(500).json({ error: 'Failed to fetch active branches' });
    }
});

// Get single branch (Admin only)
router.get('/:id', auth, isAdmin, async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);

        if (!branch) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        // Get machines for this branch
        const machines = await Machine.find({ branch: branch._id })
            .populate('currentUser', 'name email')
            .populate('queue.user', 'name email')
            .sort({ name: 1 });

        res.json({
            ...branch.toObject(),
            machines
        });
    } catch (error) {
        console.error('Get branch error:', error);
        res.status(500).json({ error: 'Failed to fetch branch' });
    }
});

// Create new branch (Admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { name, location, code } = req.body;

        if (!name || !location || !code) {
            return res.status(400).json({ error: 'Name, location, and code are required' });
        }

        // Check if branch with same name or code exists
        const existing = await Branch.findOne({
            $or: [{ name }, { code: code.toUpperCase() }]
        });

        if (existing) {
            return res.status(400).json({
                error: existing.name === name
                    ? 'Branch with this name already exists'
                    : 'Branch with this code already exists'
            });
        }

        const branch = new Branch({
            name,
            location,
            code: code.toUpperCase()
        });

        await branch.save();

        res.status(201).json({
            message: 'Branch created successfully',
            branch
        });
    } catch (error) {
        console.error('Create branch error:', error);
        res.status(500).json({ error: 'Failed to create branch' });
    }
});

// Update branch (Admin only)
router.patch('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { name, location, code, isActive } = req.body;
        const branch = await Branch.findById(req.params.id);

        if (!branch) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        // Check for duplicate name or code if updating
        if (name || code) {
            const existing = await Branch.findOne({
                _id: { $ne: req.params.id },
                $or: [
                    ...(name ? [{ name }] : []),
                    ...(code ? [{ code: code.toUpperCase() }] : [])
                ]
            });

            if (existing) {
                return res.status(400).json({
                    error: existing.name === name
                        ? 'Branch with this name already exists'
                        : 'Branch with this code already exists'
                });
            }
        }

        if (name) branch.name = name;
        if (location) branch.location = location;
        if (code) branch.code = code.toUpperCase();
        if (typeof isActive === 'boolean') branch.isActive = isActive;

        await branch.save();

        res.json({
            message: 'Branch updated successfully',
            branch
        });
    } catch (error) {
        console.error('Update branch error:', error);
        res.status(500).json({ error: 'Failed to update branch' });
    }
});

// Delete branch (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);

        if (!branch) {
            return res.status(404).json({ error: 'Branch not found' });
        }

        // Check if branch has machines
        const machineCount = await Machine.countDocuments({ branch: branch._id });
        if (machineCount > 0) {
            return res.status(400).json({
                error: `Cannot delete branch with ${machineCount} machine(s). Please reassign or delete machines first.`
            });
        }

        // Check if branch has users
        const userCount = await User.countDocuments({ branch: branch._id });
        if (userCount > 0) {
            return res.status(400).json({
                error: `Cannot delete branch with ${userCount} user(s). Please reassign users first.`
            });
        }

        await Branch.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Branch deleted successfully'
        });
    } catch (error) {
        console.error('Delete branch error:', error);
        res.status(500).json({ error: 'Failed to delete branch' });
    }
});

module.exports = router;
