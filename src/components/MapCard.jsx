import React from 'react';
import { Calendar, MoreVertical, Plus, Minus, Maximize } from 'lucide-react';

const MapCard = () => {
    return (
        <div className="col-span-3 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-gray-800">Total drilling cost</h2>
                <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Calendar size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            <div className="flex items-center">
                {/* Controls */}
                <div className="flex flex-col space-y-4 mr-4">
                    <button className="p-2 bg-white border border-gray-200 rounded text-gray-600">
                        <Plus size={16} />
                    </button>
                    <button className="p-2 bg-white border border-gray-200 rounded text-gray-600">
                        <Minus size={16} />
                    </button>
                    <button className="p-2 bg-white border border-gray-200 rounded text-gray-600 mt-auto">
                        <Maximize size={16} />
                    </button>
                </div>

                {/* Map Visualization */}
                <div className="flex-1 relative">
                    <div className="h-64 bg-gray-100 rounded-lg relative overflow-hidden">
                        {/* Simplified Algeria Map Shape */}
                        <svg viewBox="0 0 400 300" className="w-full h-full">
                            <path
                                d="M50,50 L350,50 L350,250 L50,250 Z"
                                fill="#e5e7eb"
                                stroke="#d1d5db"
                                strokeWidth="2"
                            />

                            {/* Heat Map Gradient */}
                            <defs>
                                <radialGradient id="heatGradient" cx="0.5" cy="0.5" r="0.5">
                                    <stop offset="0%" stopColor="#000" stopOpacity="0.8" />
                                    <stop offset="50%" stopColor="#ff7e00" stopOpacity="0.6" />
                                    <stop offset="80%" stopColor="#ffdd00" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#00ff00" stopOpacity="0.2" />
                                </radialGradient>
                            </defs>

                            <circle cx="200" cy="180" r="100" fill="url(#heatGradient)" />
                        </svg>

                        {/* South Algeria Callout */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg">
                                <p className="text-2xl font-bold">$3.2M</p>
                                <p className="text-xs">South Algeria</p>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-end mt-4 space-x-6">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                            <span className="text-xs text-gray-600">&lt;60%</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
                            <span className="text-xs text-gray-600">&lt;40%</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                            <span className="text-xs text-gray-600">&lt;20%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapCard;