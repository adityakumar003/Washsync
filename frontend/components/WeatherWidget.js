'use client';

import { useState, useEffect } from 'react';
import { weatherAPI } from '@/lib/api';
import { Cloud, Droplets, Wind, Sparkles, Loader } from 'lucide-react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeatherAndRecommendation();
    }, []);

    const fetchWeatherAndRecommendation = async () => {
        setLoading(true);
        try {
            const [weatherRes, aiRes] = await Promise.all([
                weatherAPI.getWeather(),
                weatherAPI.getAIRecommendation()
            ]);

            setWeather(weatherRes.data);
            setRecommendation(aiRes.data.recommendation);
        } catch (error) {
            console.error('Failed to fetch weather/AI data:', error);
            setRecommendation('Weather data unavailable at the moment.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="flex items-center justify-center py-8">
                    <Loader className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Weather Card */}
            {weather && (
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-2xl font-bold">{Math.round(weather.temperature)}°C</h3>
                            <p className="text-blue-100 capitalize">{weather.description}</p>
                            <p className="text-sm text-blue-200 mt-1">{weather.city}</p>
                        </div>
                        <div className="text-6xl">
                            {weather.icon ? (
                                <img
                                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                    alt={weather.description}
                                    className="w-20 h-20"
                                />
                            ) : (
                                <Cloud className="w-16 h-16" />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-400">
                        <div className="flex items-center gap-2">
                            <Droplets className="w-5 h-5" />
                            <div>
                                <p className="text-xs text-blue-200">Humidity</p>
                                <p className="font-medium">{weather.humidity}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Wind className="w-5 h-5" />
                            <div>
                                <p className="text-xs text-blue-200">Wind</p>
                                <p className="font-medium">{weather.windSpeed} m/s</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Recommendation Card */}
            <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <div className="flex items-start gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            AI Wash Recommendation
                        </h4>
                        <p className="text-sm leading-relaxed text-white/90">
                            {recommendation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
