'use client';

import { useState, useEffect } from 'react';
import { weatherAPI } from '@/lib/api';
import { Cloud, Droplets, Wind, Sparkles, Loader } from 'lucide-react';

export default function WeatherWidget() {
    const [weather, setWeather] = useState(null);
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchWeatherAndRecommendation();
    }, []);

    const fetchWeatherAndRecommendation = async () => {
        setLoading(true);
        setError(false);
        try {
            const [weatherRes, aiRes] = await Promise.all([
                weatherAPI.getWeather(),
                weatherAPI.getAIRecommendation()
            ]);

            setWeather(weatherRes.data);
            setRecommendation(aiRes.data.recommendation);
        } catch (error) {
            console.error('Failed to fetch weather/AI data:', error);
            setError(true);
            setRecommendation('Weather data unavailable at the moment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Weather Card - White background with black text */}
            <div className="card bg-white border border-gray-300">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : error || !weather ? (
                    <div className="text-center py-8">
                        <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-900 font-bold">Weather data unavailable</p>
                        <button
                            onClick={fetchWeatherAndRecommendation}
                            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900">{Math.round(weather.temperature)}°C</h3>
                                <p className="text-gray-700 capitalize font-semibold text-lg mt-1">{weather.description}</p>
                                <p className="text-blue-600 font-bold mt-1">{weather.city}</p>
                            </div>
                            <div className="text-6xl">
                                {weather.icon ? (
                                    <img
                                        src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                                        alt={weather.description}
                                        className="w-24 h-24"
                                    />
                                ) : (
                                    <Cloud className="w-20 h-20 text-blue-600" />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-blue-600">
                            <div className="flex items-center gap-2">
                                <Droplets className="w-6 h-6 text-blue-600" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-600">Humidity</p>
                                    <p className="font-bold text-gray-900 text-lg">{weather.humidity}%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wind className="w-6 h-6 text-blue-600" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-600">Wind</p>
                                    <p className="font-bold text-gray-900 text-lg">{weather.windSpeed} m/s</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* AI Recommendation Card */}
            <div className="card border-l-4 border-blue-600">
                <div className="flex items-start gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            AI Wash Recommendation
                        </h4>
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                                <p className="text-sm text-gray-500">Loading recommendation...</p>
                            </div>
                        ) : (
                            <p className="text-sm leading-relaxed text-gray-700">
                                {recommendation || 'No recommendation available at the moment.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
