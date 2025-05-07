import React from 'react';
import { MoreVertical, ChevronDown } from 'lucide-react';

// Mock data
const mockAlerts = [
  { id: 1, type: 'Dépassement des couts', well: 'Well #A-109', date: '29 Apr, 2025', severity: 'Critical', recommendation: 'Madirnich absent ya mahvoudi pls pls pls' },
  { id: 2, type: 'Dépassement des délais', well: 'Well #A-109', date: '29 Apr, 2025', severity: 'Medium', recommendation: 'Madirnich absent ya mahvoudi pls pls pls' },
  { id: 3, type: 'TBD', well: 'Well #A-109', date: '29 Apr, 2025', severity: 'Critical', recommendation: 'Madirnich absent ya mahvoudi pls pls pls' },
  { id: 4, type: 'TBD', well: 'Well #A-109', date: '29 Apr, 2025', severity: 'Low', recommendation: 'Madirnich absent ya mahvoudi pls pls pls' },
  { id: 5, type: 'TBD', well: 'Well #A-109', date: '29 Apr, 2025', severity: 'Medium', recommendation: 'Madirnich absent ya mahvoudi pls pls pls' },
  { id: 6, type: 'TBD', well: 'Well #A-109', date: '29 Apr, 2025', severity: 'Critical', recommendation: 'Madirnich absent ya mahvoudi pls pls pls' },
];

function getSeverityColor(severity) {
  switch(severity) {
    case 'Critical': return 'bg-red-100 text-red-700';
    case 'Medium': return 'bg-amber-100 text-amber-700';
    case 'Low': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function Alerts() {
  return (
    <div className="bg-[#FEFCFA] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-500">détail khrj tehna a écrire</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Demandes total */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-2 text-sm text-gray-500">Demandes total</div>
            <div className="flex justify-between items-start">
              <div className="text-3xl font-bold">40,689</div>
              <div className="rounded-full p-2 bg-green-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#008304" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <img src="/stats-up.svg" alt="Up" width="16px" height="16px" className="mr-2" />
              <span>8.5% Up from yesterday</span>
            </div>
          </div>
          {/* Composants total */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-2 text-sm text-gray-500">Composants total</div>
            <div className="flex justify-between items-start">
              <div className="text-3xl font-bold">10293</div>
              <div className="rounded-full p-2 bg-amber-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#FFC300" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <img src="/stats-up.svg" alt="Up" width="16px" height="16px" className="mr-2" />
              <span>1.3% Up from past week</span>
            </div>
          </div>
          {/* Équipements total */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-2 text-sm text-gray-500">Équipements total</div>
            <div className="flex justify-between items-start">
              <div className="text-3xl font-bold">8901</div>
              <div className="rounded-full p-2 bg-blue-100">
                <img src="/stats.svg" alt="Stats" width="24" height="24" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-red-600">
              <img src="/stat-down.svg" alt="Down" width="16px" height="16px" className="mr-2" />
              <span>4.3% Down from yesterday</span>
            </div>
          </div>
          {/* Interventions actives */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-2 text-sm text-gray-500">Interventions actives</div>
            <div className="flex justify-between items-start">
              <div className="text-3xl font-bold">24</div>
              <div className="rounded-full p-2 bg-red-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6L18 18" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <img src="/stats-up.svg" alt="Up" width="16px" height="16px" className="mr-2" />
              <span>1.8% Up from yesterday</span>
            </div>
          </div>
        </div>
        {/* Table of Alerts */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Table of alerts</h2>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-thin border-divider">
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-64 bg-header-bg">
                    <div className="flex items-center gap-1">
                      <span>Alert type</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-56 bg-header-bg">
                    <span>Concerned well</span>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-40 bg-header-bg">
                    <span>Alert date</span>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-40 bg-header-bg">
                    <span>Severity</span>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 w-auto bg-header-bg">
                    <span>AI Recommendations</span>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 w-20 bg-header-bg">
                    <span>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockAlerts.map((alert) => (
                  <tr 
                    key={alert.id} 
                    className="border-b border-thin border-divider hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium">{alert.type}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {alert.well}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {alert.date}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-md inline-block text-center min-w-[90px] ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 truncate max-w-xs">
                      {alert.recommendation}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <button className="rounded-full p-1 hover:bg-gray-100 transition-colors duration-150">
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 pt-4">
            <div className="text-sm text-gray-500">
              1 - 8 of 40 items
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Previous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}