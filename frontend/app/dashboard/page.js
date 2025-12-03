'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { machinesAPI } from '@/lib/api';
import MachineCard from '@/components/MachineCard';
import NotificationCenter from '@/components/NotificationCenter';
import WeatherWidget from '@/components/WeatherWidget';
import { LogOut, Settings, Loader, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout, loading: authLoading } = useAuth();
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchMachines();
        }
    }, [user, authLoading, router]);

    const fetchMachines = async () => {
        try {
            const response = await machinesAPI.getAll();
            setMachines(response.data);
        } catch (error) {
            console.error('Failed to fetch machines:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchMachines();
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
            {/* Header - Dark Slate */}
            <header className="bg-slate-dark sticky top-0 z-30 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-white">WashSync</h1>
                            <p className="text-sm text-gray-300">
                                Welcome, {user?.name}
                                {user?.isAdmin && <span className="ml-2 text-warning">👑 Admin</span>}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
                            </button>

                            <NotificationCenter />

                            {user?.isAdmin && (
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    title="Admin Panel"
                                >
                                    <Settings className="w-5 h-5 text-white" />
                                </button>
                            )}

                            <button
                                onClick={logout}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Machines */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-slate-dark mb-2">Washing Machines</h2>
                            <p className="text-slate-text">
                                {machines.filter(m => m.status === 'Available').length} available out of {machines.length} machines
                            </p>
                        </div>

                        {machines.length === 0 ? (
                            <div className="card text-center py-12">
                                <p className="text-slate-text text-lg">No machines available yet.</p>
                                {user?.isAdmin && (
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="btn btn-primary mt-4"
                                    >
                                        Add Your First Machine
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {machines.map((machine) => (
                                    <MachineCard
                                        key={machine._id}
                                        machine={machine}
                                        machines={machines}
                                        onUpdate={fetchMachines}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Weather & AI */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <WeatherWidget />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
