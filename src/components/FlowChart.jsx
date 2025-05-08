import React from 'react';
import { MoreVertical } from 'lucide-react';

const FlowChart = () => {
    return (
        <div className="col-span-3 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-gray-800">Average operations compliance check</h2>
                <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            <div className="flex space-x-12 justify-between">
                <div className="text-center">
                    <h3 className="text-2xl font-bold">27.8 K</h3>
                    <p className="text-sm text-gray-500">Opened Request</p>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold">27.8 K</h3>
                    <p className="text-sm text-gray-500">Engaged</p>
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold">27.8 K</h3>
                    <p className="text-sm text-gray-500">EOI sent</p>
                </div>
            </div>

            <div className="mt-6 relative h-48">
                {/* Flow Chart Visualization */}
                <div className="h-full w-full">
                    {/* Base Green to Red Gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-lg opacity-20"></div>

                    {/* Flowing Areas */}
                    <div className="absolute bottom-0 left-0 w-full h-32">
                        <svg viewBox="0 0 800 100" className="w-full h-full">
                            <defs>
                                {/* Green Area (8%) */}
                                <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.7" />
                                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0.1" />
                                </linearGradient>

                                {/* Orange Area (32%) */}
                                <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#fb923c" stopOpacity="0.7" />
                                    <stop offset="100%" stopColor="#fb923c" stopOpacity="0.1" />
                                </linearGradient>

                                {/* Red Area (60%) */}
                                <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#f87171" stopOpacity="0.7" />
                                    <stop offset="100%" stopColor="#f87171" stopOpacity="0.1" />
                                </linearGradient>
                            </defs>

                            <path d="M0,80 C100,70 150,90 200,80 S300,70 400,50 S600,30 800,20 L800,100 L0,100 Z" fill="url(#greenGrad)" />
                            <path d="M200,70 C250,60 300,80 350,70 S450,40 550,30 S700,20 800,10 L800,100 L200,100 Z" fill="url(#orangeGrad)" />
                            <path d="M400,60 C500,50 550,70 600,60 S700,30 800,20 L800,100 L400,100 Z" fill="url(#redGrad)" />
                        </svg>
                    </div>

                    {/* Vertical Lines & Percentages */}
                    <div className="absolute bottom-0 left-20 h-full flex flex-col items-center">
                        <div className="h-2/3 border-l-2 border-dashed border-gray-400"></div>
                        <div className="mt-2 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-medium">8%</span>
                        </div>
                        <div className="mt-2 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-medium">4%</span>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full flex flex-col items-center">
                        <div className="h-2/3 border-l-2 border-dashed border-gray-400"></div>
                        <div className="absolute top-1/3 -translate-y-1/2">

                            <div className="mt-2 bg-black text-white px-3 py-1 rounded-full">
                                <span className="text-xs font-medium">32%</span>
                            </div>
                        </div>
                        <div className="mt-2 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-medium">21%</span>
                        </div>
                    </div>

                    <div className="absolute bottom-0 right-20 h-full flex flex-col items-center">
                        <div className="h-2/3 border-l-2 border-dashed border-gray-400"></div>
                        <div className="mt-2 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-medium">60%</span>
                        </div>
                        <div className="mt-2 bg-gray-100 px-3 py-1 rounded-full">
                            <span className="text-xs font-medium">12%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowChart;