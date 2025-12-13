'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Clock, Calendar, CloudSun, Star, ArrowRight, Github, Twitter } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    const features = [
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Live Tracking",
            description: "Check machine availability in real-time. No more guessing or waiting around."
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: "Easy Scheduling",
            description: "Reserve your slot in advance. Plan your laundry around your schedule."
        },
        {
            icon: <CloudSun className="w-6 h-6" />,
            title: "Weather Insights",
            description: "Get AI-powered recommendations based on weather conditions for optimal drying."
        }
    ];

    const testimonials = [
        {
            name: "Ankit Arora",
            role: "Student",
            avatar: "A",
            rating: 5,
            comment: "I used to spend hours waiting for a machine. Now I just check the app and go when it's free. Life-changing!"
        },
        {
            name: "Jay Kapoor",
            role: "Student",
            rating: 5,
            avatar: "J",
            comment: "The weather insights are genius! I never have to worry about my clothes not drying anymore."
        },
        {
            name: "Mehul Acharya",
            role: "Student",
            rating: 5,
            avatar: "M",
            comment: "Super easy to use. The notifications are perfect - I never miss my turn. Highly recommend!"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">WashSync</span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/auth')}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => router.push('/auth?tab=signup')}
                            className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create Account
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-block px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full">
                                <span className="text-sm text-blue-400 font-medium">Smart Laundry Management</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                                Laundry Day,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                    Done Smarter.
                                </span>
                            </h1>

                            <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                                The easiest way for students to track and schedule laundry in real-time. Manage your hostel laundry effortlessly with smart tracking and easy payments.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => router.push('/auth?tab=signup')}
                                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                                >
                                    Get Started for Free
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
                                <img
                                    src="/hero_machines.png"
                                    alt="Modern Washing Machines"
                                    className="w-full h-auto relative z-10"
                                />
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl -z-10" />
                            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Everything you need to<br />manage your laundry.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-600/50 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                                    <div className="text-blue-400">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Machine Status Preview Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Machine Cards */}
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                Don't Wait.
                            </h2>

                            <div className="space-y-4">
                                {/* Machine Card 1 - Available */}
                                <div className="p-5 bg-slate-800/50 border border-slate-700 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="text-white font-semibold">WM-W2-2</h4>
                                            <p className="text-sm text-gray-400">Washing Machine</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-600/20 border border-green-600/30 text-green-400 text-sm font-medium rounded-full">
                                            Available
                                        </span>
                                    </div>
                                    <button className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                        Book This Cycle
                                    </button>
                                </div>

                                {/* Machine Card 2 - In Use */}
                                <div className="p-5 bg-slate-800/50 border border-slate-700 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="text-white font-semibold">WM-W2-3</h4>
                                            <p className="text-sm text-gray-400">Washing Machine</p>
                                        </div>
                                        <span className="px-3 py-1 bg-red-600/20 border border-red-600/30 text-red-400 text-sm font-medium rounded-full">
                                            In Use
                                        </span>
                                    </div>
                                    <div className="py-2.5 text-center text-gray-500 font-medium">
                                        23 mins remaining
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Features List */}
                        <div className="space-y-8">
                            <h3 className="text-3xl md:text-4xl font-bold text-white">
                                Real-time status,<br />right in your pocket.
                            </h3>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Smart Notifications</h4>
                                        <p className="text-gray-400">Get notified when your cycle is done or when a machine becomes available.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Usage Analytics</h4>
                                        <p className="text-gray-400">Track your laundry patterns and get insights to optimize your schedule.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Weather Insights Section */}
            <section className="py-20 px-6 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold text-white">
                                Wash when the<br />sun shines.
                            </h2>

                            <p className="text-xl text-gray-400 leading-relaxed">
                                With AI-powered weather insights, you'll always know the best time to do your laundry. Get real-time drying estimates and smart recommendations based on current conditions.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-300">"I love how it tells me when it's the perfect time to dry my clothes outside!"</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-300">"The weather recommendations have saved me so much time and energy costs."</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Weather Card */}
                        <div className="relative">
                            <div className="p-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">Today</h3>
                                        <p className="text-cyan-100 text-sm">Your Location</p>
                                    </div>
                                    <CloudSun className="w-8 h-8 text-white" />
                                </div>

                                <div className="mb-6">
                                    <div className="text-6xl font-bold text-white mb-2">24°</div>
                                    <p className="text-cyan-100">Partly Cloudy</p>
                                </div>

                                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-white" />
                                        <span className="text-white font-medium text-sm">Drying Time</span>
                                    </div>
                                    <p className="text-cyan-100 text-sm">Estimated 2-3 hours for outdoor drying</p>
                                </div>

                                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                    <p className="text-white font-medium mb-1">💡 Recommendation</p>
                                    <p className="text-cyan-100 text-sm">Perfect conditions for air drying! Hang your clothes outside to save energy.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                        Students love WashSync
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    "{testimonial.comment}"
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold">{testimonial.name}</div>
                                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-slate-900 border-t border-slate-800">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        {/* WashSync */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-white">WashSync</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Smart laundry management for modern students.
                            </p>
                        </div>

                        {/* Features */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Features</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Live Tracking</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Easy Scheduling</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Weather Insights</a></li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Status</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-400 text-sm">
                            © 2024 WashSync. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
