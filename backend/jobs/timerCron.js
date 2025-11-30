const cron = require('node-cron');
const Machine = require('../models/Machine');
const Notification = require('../models/Notification');

// Function to check and release expired machines
async function checkExpiredTimers() {
    try {
        console.log('[CRON] Checking for expired timers...');

        // Find all machines that are in use with expired timers
        const machines = await Machine.find({
            status: 'InUse',
            timerEnd: { $lte: new Date() }
        }).populate('currentUser', 'name email');

        if (machines.length === 0) {
            console.log('[CRON] No expired timers found');
            return;
        }

        console.log(`[CRON] Found ${machines.length} expired timer(s)`);

        for (const machine of machines) {
            const userId = machine.currentUser?._id;
            const userName = machine.currentUser?.name;

            console.log(`[CRON] Releasing machine: ${machine.name} (User: ${userName})`);

            // Send wash complete notification to current user
            if (userId) {
                await Notification.create({
                    user: userId,
                    message: `Your wash on "${machine.name}" is complete!`,
                    type: 'wash_complete',
                    machineId: machine._id
                });
                console.log(`[CRON] Sent wash complete notification to ${userName}`);
            }

            // Release the machine
            machine.status = 'Available';
            machine.currentUser = null;
            machine.timerStart = null;
            machine.timerEnd = null;
            machine.duration = null;

            // Check if there's a queue
            if (machine.queue.length > 0) {
                const nextInQueue = machine.queue[0];
                const nextUserId = nextInQueue.user;

                // Notify next person in queue
                await Notification.create({
                    user: nextUserId,
                    message: `Great news! Machine "${machine.name}" is now available. It's your turn!`,
                    type: 'your_turn',
                    machineId: machine._id
                });

                console.log(`[CRON] Notified next user in queue for ${machine.name}`);

                // Remove them from queue since machine is available for them
                machine.queue.shift();
                console.log(`[CRON] Removed user from queue for ${machine.name}`);
            }

            await machine.save();
            console.log(`[CRON] Machine ${machine.name} released successfully`);
        }

        console.log('[CRON] Timer check completed');
    } catch (error) {
        console.error('[CRON] Error checking expired timers:', error);
    }
}

// Initialize cron job - runs every minute
function initTimerCron() {
    // Run every minute
    cron.schedule('* * * * *', () => {
        checkExpiredTimers();
    });

    console.log('[CRON] Timer check job initialized - running every minute');

    // Run once immediately on startup
    checkExpiredTimers();
}

module.exports = { initTimerCron, checkExpiredTimers };
