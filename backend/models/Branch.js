const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Branch name is required'],
        trim: true,
        unique: true
    },
    location: {
        type: String,
        required: [true, 'Branch location is required'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Branch code is required'],
        trim: true,
        unique: true,
        uppercase: true,
        minlength: [2, 'Branch code must be at least 2 characters'],
        maxlength: [10, 'Branch code must be at most 10 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
branchSchema.index({ code: 1 });
branchSchema.index({ isActive: 1 });

// Method to get machine count for this branch
branchSchema.methods.getMachineCount = async function () {
    const Machine = mongoose.model('Machine');
    return await Machine.countDocuments({ branch: this._id });
};

// Method to get user count for this branch
branchSchema.methods.getUserCount = async function () {
    const User = mongoose.model('User');
    return await User.countDocuments({ branch: this._id });
};

module.exports = mongoose.model('Branch', branchSchema);
