'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from './landing/page';

export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    // Show landing page for unauthenticated users
    if (!loading && !user) {
        return <LandingPage />;
    }

    // Show loading state while checking authentication
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="text-white text-2xl">Loading...</div>
        </div>
    );
}
