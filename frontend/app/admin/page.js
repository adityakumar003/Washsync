'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminAPI, machinesAPI, branchesAPI } from '@/lib/api';
import { ArrowLeft, Plus, Trash2, Wrench, Users, Shield, Loader, MapPin, Building2 } from 'lucide-react';

export default function AdminPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [machines, setMachines] = useState([]);
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMachineName, setNewMachineName] = useState('');
    const [selectedBranchForMachine, setSelectedBranchForMachine] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showBranchForm, setShowBranchForm] = useState(false);
    const [newBranch, setNewBranch] = useState({ name: '', location: '', code: '' });
    const [activeTab, setActiveTab] = useState('machines'); // 'machines' or 'branches'

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/auth');
            } else if (!user.isAdmin) {
                router.push('/dashboard');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        try {
            const [machinesRes, usersRes, branchesRes] = await Promise.all([
                machinesAPI.getAll(),
                adminAPI.getUsers(),
                branchesAPI.getAll()
            ]);
            setMachines(machinesRes.data);
            setUsers(usersRes.data);
            setBranches(branchesRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMachine = async (e) => {
        e.preventDefault();
        if (!newMachineName.trim()) return;
        if (!selectedBranchForMachine) {
            alert('Please select a branch');
            return;
        }

        try {
            await adminAPI.addMachine(newMachineName, selectedBranchForMachine);
            setNewMachineName('');
            setSelectedBranchForMachine('');
            setShowAddForm(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to add machine');
        }
    };

    const handleAddBranch = async (e) => {
        e.preventDefault();
        if (!newBranch.name.trim() || !newBranch.location.trim() || !newBranch.code.trim()) {
            alert('All fields are required');
            return;
        }

        try {
            await branchesAPI.create(newBranch);
            setNewBranch({ name: '', location: '', code: '' });
            setShowBranchForm(false);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to add branch');
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

    const handleDeleteBranch = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will fail if there are machines or users assigned to this branch.`)) return;

        try {
            await branchesAPI.delete(id);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to delete branch');
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

    const handleUserBranchChange = async (userId, branchId, userName) => {
        if (!branchId) {
            alert('Please select a branch');
            return;
        }

        try {
            await adminAPI.assignUserBranch(userId, branchId);
            alert(`Successfully reassigned ${userName} to new branch`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to reassign user');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-light">
                <Loader className="w-12 h-12 text-blue-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-light">
            {/* Header */}
            <header className="bg-slate-dark sticky top-0 z-30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
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
                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('machines')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'machines'
                            ? 'bg-blue-primary text-white shadow-md'
                            : 'bg-white text-slate-medium hover:bg-gray-100 border border-gray-border'
                            }`}
                    >
                        <Wrench className="w-5 h-5 inline mr-2" />
                        Machines
                    </button>
                    <button
                        onClick={() => setActiveTab('branches')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'branches'
                            ? 'bg-blue-primary text-white shadow-md'
                            : 'bg-white text-slate-medium hover:bg-gray-100 border border-gray-border'
                            }`}
                    >
                        <Building2 className="w-5 h-5 inline mr-2" />
                        Branches ({branches.length})
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {activeTab === 'machines' ? (
                            <div className="card mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-dark">Machines</h2>
                                    <button
                                        onClick={() => setShowAddForm(!showAddForm)}
                                        className="btn btn-primary text-sm"
                                        disabled={branches.length === 0}
                                    >
                                        <Plus className="w-4 h-4 inline mr-1" />
                                        Add Machine
                                    </button>
                                </div>

                                {branches.length === 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                        <p className="text-yellow-800 text-sm">
                                            ⚠️ Please create a branch first before adding machines.
                                        </p>
                                    </div>
                                )}

                                {showAddForm && (
                                    <form onSubmit={handleAddMachine} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Branch
                                                </label>
                                                <select
                                                    value={selectedBranchForMachine}
                                                    onChange={(e) => setSelectedBranchForMachine(e.target.value)}
                                                    className="input w-full"
                                                    required
                                                >
                                                    <option value="">Select a branch</option>
                                                    {branches.map((branch) => (
                                                        <option key={branch._id} value={branch._id}>
                                                            {branch.name} ({branch.code})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Machine Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newMachineName}
                                                    onChange={(e) => setNewMachineName(e.target.value)}
                                                    placeholder="e.g., Washer A"
                                                    className="input w-full"
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" className="btn btn-success flex-1">
                                                    Add Machine
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowAddForm(false);
                                                        setNewMachineName('');
                                                        setSelectedBranchForMachine('');
                                                    }}
                                                    className="btn btn-secondary"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
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
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-gray-800">{machine.name}</h3>
                                                        {machine.branch && (
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                                {machine.branch.name}
                                                            </span>
                                                        )}
                                                    </div>
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
                        ) : (
                            <div className="card mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-dark">Branches</h2>
                                    <button
                                        onClick={() => setShowBranchForm(!showBranchForm)}
                                        className="btn btn-primary text-sm"
                                    >
                                        <Plus className="w-4 h-4 inline mr-1" />
                                        Add Branch
                                    </button>
                                </div>

                                {showBranchForm && (
                                    <form onSubmit={handleAddBranch} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Branch Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newBranch.name}
                                                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                                                    placeholder="e.g., Downtown Branch"
                                                    className="input w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Location
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newBranch.location}
                                                    onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
                                                    placeholder="e.g., 123 Main St, City"
                                                    className="input w-full"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Branch Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newBranch.code}
                                                    onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value.toUpperCase() })}
                                                    placeholder="e.g., DT"
                                                    className="input w-full"
                                                    maxLength={10}
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" className="btn btn-success flex-1">
                                                    Add Branch
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowBranchForm(false);
                                                        setNewBranch({ name: '', location: '', code: '' });
                                                    }}
                                                    className="btn btn-secondary"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-3">
                                    {branches.length === 0 ? (
                                        <p className="text-gray-600 text-center py-8">No branches yet. Add your first branch!</p>
                                    ) : (
                                        branches.map((branch) => (
                                            <div
                                                key={branch._id}
                                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Building2 className="w-5 h-5 text-primary-600" />
                                                            <h3 className="font-bold text-gray-800">{branch.name}</h3>
                                                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-mono">
                                                                {branch.code}
                                                            </span>
                                                            {!branch.isActive && (
                                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                                                            <MapPin className="w-4 h-4" />
                                                            {branch.location}
                                                        </div>
                                                        {branch.stats && (
                                                            <div className="flex gap-4 text-sm">
                                                                <span className="text-gray-600">
                                                                    🟢 {branch.stats.availableMachines} Available
                                                                </span>
                                                                <span className="text-gray-600">
                                                                    🟡 {branch.stats.inUseMachines} In Use
                                                                </span>
                                                                <span className="text-gray-600">
                                                                    👥 {branch.stats.totalUsers} Users
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteBranch(branch._id, branch.name)}
                                                        className="btn btn-danger text-sm"
                                                        title="Delete Branch"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Users List */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h2 className="text-2xl font-bold text-slate-dark mb-4 flex items-center gap-2">
                                <Users className="w-6 h-6" />
                                Users ({users.length})
                            </h2>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {users.map((u) => (
                                    <div
                                        key={u._id}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="font-medium text-gray-800 flex items-center gap-2">
                                            {u.name}
                                            {u.isAdmin && <span className="text-yellow-500">👑</span>}
                                        </div>
                                        <div className="text-sm text-gray-600">{u.email}</div>

                                        {/* Branch Assignment */}
                                        {!u.isAdmin && (
                                            <div className="mt-2">
                                                <label className="text-xs text-gray-500 block mb-1">
                                                    Branch Assignment
                                                </label>
                                                <select
                                                    value={u.branch?._id || ''}
                                                    onChange={(e) => handleUserBranchChange(u._id, e.target.value, u.name)}
                                                    className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    disabled={branches.length === 0}
                                                >
                                                    <option value="">No Branch</option>
                                                    {branches.map((branch) => (
                                                        <option key={branch._id} value={branch._id}>
                                                            {branch.name} ({branch.code})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {u.isAdmin && (
                                            <div className="text-xs text-gray-500 mt-2 italic">
                                                Admin users are not assigned to branches
                                            </div>
                                        )}

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
