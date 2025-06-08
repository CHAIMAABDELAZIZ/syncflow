import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '../components/ui/dropdown-menu';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 8;

const mockData = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    identifier: `Report_x${i + 2323}.xlsx`,
    well: 'Well #A-105',
}));

export default function ReportsTable() {
    const [activeTab, setActiveTab] = useState('Tab 1');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReports, setSelectedReports] = useState([]);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const filteredReports = mockData.filter((report) =>
        report.identifier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredReports);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
        XLSX.writeFile(workbook, 'Reports.xlsx');
    };

    const toggleSelect = (id) => {
        setSelectedReports((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const isSelected = (id) => selectedReports.includes(id);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-xl font-semibold">Reports lists</h1>
                <div className="flex gap-2">
                    <Button
                        className="bg-white border border-orange-500 text-gray-700 hover:bg-orange-50"
                        onClick={exportToExcel}
                    >
                        Export
                    </Button>
                    <Button onClick={() => handleNavigation('/home')}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        + Add a report
                    </Button>
                </div>
            </div>

            <p className="text-gray-500 text-sm mb-4">
                A descriptive  of the <span className="text-orange-600 font-medium cursor-pointer">list of reports</span>
            </p>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 bg-white p-2 rounded">
                {['Journaliers', 'Prévisionnels'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded px-4 py-2 text-sm border transition-all ${activeTab === tab
                                ? 'bg-white text-black border-orange-500'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-500 hover:text-orange-500'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>


            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 items-center bg-white px-4 py-3 text-sm font-medium">
                    <div className="col-span-1">
                        <input
                            type="checkbox"
                            disabled
                            className="form-checkbox text-orange-500 border-gray-300"
                        />
                    </div>
                    <div className="col-span-5">Identifier</div>
                    <div className="col-span-4">Well Associated</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>

                {paginatedReports.map((report) => (
                    <div
                        key={report.id}
                        className="grid grid-cols-12 items-center px-4 py-3 border-t hover:bg-gray-50 text-sm bg-white"
                    >
                        <div className="col-span-1">
                            <input
                                type="checkbox"
                                checked={isSelected(report.id)}
                                onChange={() => toggleSelect(report.id)}
                                className="form-checkbox text-orange-500 border-gray-300"
                            />
                        </div>
                        <div className="col-span-5">{report.identifier}</div>
                        <div className="col-span-4">{report.well}</div>
                        <div className="col-span-2 text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="bg-white hover:bg-orange-50 text-gray-700 p-2 rounded">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => alert(`Viewing ${report.identifier}`)}>View</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => alert(`Editing ${report.identifier}`)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => alert(`Deleting ${report.identifier}`)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>
                    {`${(currentPage - 1) * ITEMS_PER_PAGE + 1} – ${Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredReports.length
                    )} of ${filteredReports.length} items`}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}