import { useState } from 'react';

export default function BorrowersByState() {
    const [totalAmount] = useState(25500000);

    const stateData = [
        { state: 'QLD', amount: 18500000, color: 'bg-red-500', percentage: 72.5 },
        { state: 'SA', amount: 3900000, color: 'bg-orange-400', percentage: 15.3 },
        { state: 'WA', amount: 3200000, color: 'bg-green-400', percentage: 12.5 },
        { state: 'VIC', amount: 0, color: 'bg-gray-300', percentage: 0 },
    ];

    // Calculate the total degrees for the gauge (semi-circle = 180 degrees)
    const calculateGaugeRotation = (percentage) => {
        return Math.min(180, Math.max(0, percentage * 1.8));
    };

    // Calculate total percentage of all states
    const totalPercentage = stateData.reduce((sum, item) => sum + item.percentage, 0);
    const gaugeRotation = calculateGaugeRotation(totalPercentage);

    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        }
        return `$${amount.toLocaleString()}`;
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-4xl">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold text-gray-800">Borrowers by State</h1>
                <div className="flex items-center">
                    <button className="p-2 rounded-md hover:bg-gray-100 mr-2">
                        <div className="w-6 h-6 bg-black flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
                                <path d="M11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between">
                <div className="relative w-64 h-32 mx-auto md:mx-0 mb-8 md:mb-0">
                    {/* Semi-circular gauge */}
                    <div className="absolute w-full h-full">
                        <div className="relative w-full h-full">
                            {/* Background semi-circle */}
                            <div
                                className="absolute w-full h-full rounded-t-full bg-gray-200 origin-bottom"
                                style={{
                                    transform: 'rotate(180deg)',
                                    clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
                                }}
                            ></div>

                            {/* Gradient fill for the gauge */}
                            <div className="absolute w-full h-full">
                                <div
                                    className="absolute w-full h-full rounded-t-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-500 origin-bottom"
                                    style={{
                                        transform: `rotate(${180 - gaugeRotation}deg)`,
                                        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Central text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                        <div className="text-5xl font-bold text-black">
                            {formatCurrency(totalAmount)}
                        </div>
                        <div className="text-xl text-gray-400 mt-1">
                            Total Amount
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-4 w-full md:w-1/2">
                    {stateData.map((item) => (
                        <div key={item.state} className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                            <div className="text-2xl font-semibold w-16">{item.state}</div>
                            <div className="flex-grow">
                                <div className="border-b-2 border-dotted border-gray-300 h-0 mx-2"></div>
                            </div>
                            <div className="text-2xl font-bold">
                                {formatCurrency(item.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}