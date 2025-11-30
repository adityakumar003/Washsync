'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { machinesAPI } from '@/lib/api';
import { Clock, User, Users, Play, X, UserPlus, UserMinus } from 'lucide-react';

export default function MachineCard({ machine, machines, onUpdate }) {
    const { user } = useAuth();
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(false);
    const [duration, setDuration] = useState(30);
    const [showDurationInput, setShowDurationInput] = useState(false);

    useEffect(() => {
        if (machine.status === 'InUse' && machine.timerEnd) {
            const interval = setInterval(() => {
                const remaining = Math.max(0, Math.floor((new Date(machine.timerEnd) - new Date()) / 1000));
                setTimeRemaining(remaining);

                if (remaining === 0) {
                    onUpdate();
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [machine, onUpdate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOccupy = async () => {
        if (!showDurationInput) {
            setShowDurationInput(true);
            return;
        }

        if (duration < 1 || duration > 180) {
            alert('Duration must be between 1 and 180 minutes');
            return;
        }

        setLoading(true);
        try {
            await machinesAPI.occupy(machine._id, duration);
            onUpdate();
            setShowDurationInput(false);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to occupy machine');
        } finally {
            setLoading(false);
        }
    };

    const handleRelease = async () => {
        setLoading(true);
        try {
            await machinesAPI.release(machine._id);
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to release machine');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinQueue = async () => {
        setLoading(true);
        try {
            await machinesAPI.joinQueue(machine._id);
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to join queue');
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveQueue = async () => {
        setLoading(true);
        try {
            await machinesAPI.leaveQueue(machine._id);
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to leave queue');
        } finally {
            setLoading(false);
        }
    };

    const isCurrentUser = machine.currentUser?._id === user?.id;
    const isInQueue = machine.queue?.some(item => item.user._id === user?.id);
    const queuePosition = machine.queue?.findIndex(item => item.user._id === user?.id) + 1;

    // Check if user is currently using ANY machine
    const isUsingAnyMachine = machines?.some(m => m.currentUser?._id === user?.id && m.status === 'InUse') || false;

    const getStatusColor = () => {
        switch (machine.status) {
            case 'Available':
                return 'bg-green-500';
            case 'InUse':
                return 'bg-yellow-500';
            case 'Maintenance':
                return 'bg-gray-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getStatusBadge = () => {
        switch (machine.status) {
            case 'Available':
                return 'status-available';
            case 'InUse':
                return 'status-inuse';
            case 'Maintenance':
                return 'status-maintenance';
            default:
                return '';
        }
    };

    return (
        <div className="card hover:scale-105 transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{machine.name}</h3>
                <div className={`w-4 h-4 rounded-full ${getStatusColor()} pulse-glow`}></div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
                <span className={`status-badge ${getStatusBadge()}`}>
                    {machine.status}
                </span>
            </div>

            {/* Current User */}
            {machine.currentUser && (
                <div className="flex items-center gap-2 mb-3 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                        {isCurrentUser ? 'You' : machine.currentUser.name}
                    </span>
                </div>
            )}

            {/* Timer */}
            {machine.status === 'InUse' && machine.timerEnd && (
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary-600" />
                            <span className="text-sm font-medium text-primary-900">Time Remaining</span>
                        </div>
                        <span className="text-2xl font-bold text-primary-700">
                            {formatTime(timeRemaining)}
                        </span>
                    </div>
                </div>
            )}

            {/* Queue */}
            {machine.queue && machine.queue.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                            Queue ({machine.queue.length})
                        </span>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                        {machine.queue.map((item, index) => (
                            <div
                                key={item.user._id}
                                className={`text-sm px-3 py-2 rounded ${item.user._id === user?.id
                                    ? 'bg-primary-100 text-primary-800 font-medium'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {index + 1}. {item.user._id === user?.id ? 'You' : item.user.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
                {machine.status === 'Available' && !isCurrentUser && (
                    <>
                        {showDurationInput ? (
                            <div className="space-y-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="180"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="input text-sm"
                                    placeholder="Duration (minutes)"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleOccupy}
                                        disabled={loading}
                                        className="btn btn-success flex-1 text-sm"
                                    >
                                        <Play className="w-4 h-4 inline mr-1" />
                                        {loading ? 'Starting...' : 'Start'}
                                    </button>
                                    <button
                                        onClick={() => setShowDurationInput(false)}
                                        className="btn btn-secondary text-sm"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleOccupy}
                                disabled={loading}
                                className="btn btn-success w-full text-sm"
                            >
                                <Play className="w-4 h-4 inline mr-1" />
                                Start Wash
                            </button>
                        )}
                    </>
                )}

                {isCurrentUser && machine.status === 'InUse' && (
                    <button
                        onClick={handleRelease}
                        disabled={loading}
                        className="btn btn-danger w-full text-sm"
                    >
                        <X className="w-4 h-4 inline mr-1" />
                        {loading ? 'Releasing...' : 'Release Machine'}
                    </button>
                )}

                {machine.status !== 'Available' && machine.status !== 'Maintenance' && !isCurrentUser && !isUsingAnyMachine && (
                    <>
                        {isInQueue ? (
                            <button
                                onClick={handleLeaveQueue}
                                disabled={loading}
                                className="btn btn-secondary w-full text-sm"
                            >
                                <UserMinus className="w-4 h-4 inline mr-1" />
                                Leave Queue (Position: {queuePosition})
                            </button>
                        ) : (
                            <button
                                onClick={handleJoinQueue}
                                disabled={loading}
                                className="btn btn-primary w-full text-sm"
                            >
                                <UserPlus className="w-4 h-4 inline mr-1" />
                                Join Queue
                            </button>
                        )}
                    </>
                )}

                {machine.status === 'Maintenance' && (
                    <div className="text-center text-sm text-gray-600 py-2">
                        Under Maintenance
                    </div>
                )}
            </div>
        </div>
    );
}
