'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI, machinesAPI } from '@/lib/api';
import { ArrowLeft, Plus, Trash2, Wrench, Users, Shield, Loader } from 'lucide-react';

export default function AdminPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [machines, setMachines] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMachineName, setNewMachineName] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (!user.isAdmin) {
                router.push('/dashboard');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        try {
            const [machinesRes, usersRes] = await Promise.all([
                machinesAPI.getAll(),
                adminAPI.getUsers()
            ]);
            setMachines(machinesRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMachine = async (e) => {
        e.preventDefault();
        if (!newMachineName.trim()) return;

        try {
            await adminAPI.addMachine(newMachineName);
            setNewMachineName('');
            setShowAddForm(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to add machine');
        }
    };

    const handleDeleteMachine = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await adminAPI.deleteMachine(id);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to delete machine');
        }
    };

    const handleToggleMaintenance = async (machine) => {
        const newStatus = machine.status === 'Maintenance' ? 'Available' : 'Maintenance';

        try {
            await adminAPI.updateStatus(machine._id, newStatus);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update status');
        }
    };

    const handleOverride = async (id, name) => {
        if (!confirm(`Force release "${name}"? This will clear current user and timer.`)) return;

        try {
            await adminAPI.overrideMachine(id);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to override machine');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-12 h-12 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass-dark sticky top-0 z-30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Shield className="w-6 h-6" />
                                    Admin Panel
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Machines Management */}
                    <div className="lg:col-span-2">
                        <div className="card mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Machines</h2>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="btn btn-primary text-sm"
                                >
                                    <Plus className="w-4 h-4 inline mr-1" />
                                    Add Machine
                                </button>
                            </div>

                            {showAddForm && (
                                <form onSubmit={handleAddMachine} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMachineName}
                                            onChange={(e) => setNewMachineName(e.target.value)}
                                            placeholder="Machine name (e.g., Washer A)"
                                            className="input flex-1"
                                            required
                                        />
                                        <button type="submit" className="btn btn-success">
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setNewMachineName('');
                                            }}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3">
                                {machines.length === 0 ? (
                                    <p className="text-gray-600 text-center py-8">No machines yet. Add your first machine!</p>
                                ) : (
                                    machines.map((machine) => (
                                        <div
                                            key={machine._id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800">{machine.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`status-badge ${machine.status === 'Available' ? 'status-available' :
                                                            machine.status === 'InUse' ? 'status-inuse' :
                                                                'status-maintenance'
                                                        }`}>
                                                        {machine.status}
                                                    </span>
                                                    {machine.currentUser && (
                                                        <span className="text-sm text-gray-600">
                                                            User: {machine.currentUser.name}
                                                        </span>
                                                    )}
                                                    {machine.queue?.length > 0 && (
                                                        <span className="text-sm text-gray-600">
                                                            Queue: {machine.queue.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleMaintenance(machine)}
                                                    className={`btn text-sm ${machine.status === 'Maintenance' ? 'btn-success' : 'btn-warning'
                                                        }`}
                                                    title={machine.status === 'Maintenance' ? 'Mark Available' : 'Mark Maintenance'}
                                                >
                                                    <Wrench className="w-4 h-4" />
                                                </button>

                                                {machine.status === 'InUse' && (
                                                    <button
                                                        onClick={() => handleOverride(machine._id, machine.name)}
                                                        className="btn btn-secondary text-sm"
                                                        title="Force Release"
                                                    >
                                                        Override
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDeleteMachine(machine._id, machine.name)}
                                                    className="btn btn-danger text-sm"
                                                    title="Delete Machine"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Users className="w-6 h-6" />
                                Users ({users.length})
                            </h2>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {users.map((u) => (
                                    <div
                                        key={u._id}
                                        className="p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="font-medium text-gray-800 flex items-center gap-2">
                                            {u.name}
                                            {u.isAdmin && <span className="text-yellow-500">👑</span>}
                                        </div>
                                        <div className="text-sm text-gray-600">{u.email}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Joined: {new Date(u.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
