const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Machine name is required'],
        trim: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Available', 'InUse', 'Maintenance'],
        default: 'Available'
    },
    currentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    timerStart: {
        type: Date,
        default: null
    },
    timerEnd: {
        type: Date,
        default: null
    },
    duration: {
        type: Number, // Duration in minutes
        default: null
    },
    queue: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Method to check if timer has expired
machineSchema.methods.isTimerExpired = function () {
    if (!this.timerEnd) return false;
    return new Date() >= this.timerEnd;
};

// Method to get remaining time in seconds
machineSchema.methods.getRemainingTime = function () {
    if (!this.timerEnd) return 0;
    const remaining = Math.max(0, Math.floor((this.timerEnd - new Date()) / 1000));
    return remaining;
};

// Method to add user to queue
machineSchema.methods.addToQueue = function (userId) {
    const alreadyInQueue = this.queue.some(item => item.user.toString() === userId.toString());
    if (alreadyInQueue) {
        throw new Error('User already in queue');
    }
    this.queue.push({ user: userId });
    return this.save();
};

// Method to remove user from queue
machineSchema.methods.removeFromQueue = function (userId) {
    this.queue = this.queue.filter(item => item.user.toString() !== userId.toString());
    return this.save();
};

// Method to get queue position for a user
machineSchema.methods.getQueuePosition = function (userId) {
    const index = this.queue.findIndex(item => item.user.toString() === userId.toString());
    return index === -1 ? null : index + 1;
};

module.exports = mongoose.model('Machine', machineSchema);
