import { useState } from "react";
import { Search, MoreVertical, Filter } from "lucide-react";

// Mock data
const mockWells = [
  { id: "A-103", status: "Active", phase: "Nom du phase", progress: 85 },
  { id: "A-104", status: "Active", phase: "Nom du phase", progress: 90 },
  { id: "A-105", status: "InActive", phase: "Nom du phase", progress: 95 },
  { id: "A-107", status: "Active", phase: "Nom du phase", progress: 60 },
  { id: "A-108", status: "InActive", phase: "Nom du phase", progress: 80 },
  { id: "A-109", status: "Active", phase: "Nom du phase", progress: 98 },
  { id: "A-110", status: "Active", phase: "Nom du phase", progress: 75 },
  { id: "A-111", status: "InActive", phase: "Nom du phase", progress: 50 },
  { id: "A-112", status: "Active", phase: "Nom du phase", progress: 65 },
  { id: "A-113", status: "InActive", phase: "Nom du phase", progress: 70 },
];

export default function Wells() {
  const [selectedWells, setSelectedWells] = useState(["A-107", "A-108", "A-109"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProgress, setFilterProgress] = useState("");
  const [wells, setWells] = useState(mockWells); // State to manage wells data
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const itemsPerPage = 5;

  const toggleWellSelection = (wellId) => {
    if (selectedWells.includes(wellId)) {
      setSelectedWells(selectedWells.filter((id) => id !== wellId));
    } else {
      setSelectedWells([...selectedWells, wellId]);
    }
    console.log("Selected wells:", selectedWells);
  };

  const getStatusTextColor = (status) => {
    return status === "Active" ? "text-green-700" : "text-red-700";
  };

  const getStatusBgColor = (status) => {
    return status === "Active" ? "bg-green-100" : "bg-red-100";
  };

  // Filter logic
  const filteredWells = wells.filter((well) => {
    const matchesStatus = filterStatus ? well.status === filterStatus : true;
    const matchesProgress = filterProgress
      ? (filterProgress === "above50" ? well.progress > 50 : well.progress <= 50)
      : true;
    return matchesStatus && matchesProgress;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWells = filteredWells.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredWells.length / itemsPerPage);

  // Handle export
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Status,Phase,Progress\n"
      + filteredWells.map(row => `${row.id},${row.status},${row.phase},${row.progress}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wells_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Exporting wells data...");
  };

  // Handle add oil well
  const handleAddOilWell = () => {
    console.log("Opening add oil well form...");
  };

  // Handle action dropdown
  const toggleDropdown = (wellId) => {
    setOpenDropdownId(openDropdownId === wellId ? null : wellId);
  };

  const handleViewDetails = (wellId) => {
    console.log(`Viewing details for well ${wellId}`);
    setOpenDropdownId(null);
  };

  const handleEditWell = (wellId) => {
    console.log(`Editing well ${wellId}`);
    setOpenDropdownId(null);
  };

  const handleDeleteWell = (wellId) => {
    setWells(wells.filter((well) => well.id !== wellId));
    setOpenDropdownId(null);
    setSelectedWells(selectedWells.filter((id) => id !== wellId)); // Update selected wells
  };

  // Handle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page after applying filters
  };

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="dashboard-container bg-[#FEFCFA] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Oil wells</h1>
            <p className="text-gray-500">Jun 1 - Aug 31, 2025</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-4 md:mt-0">
            <div className="p-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-5xl text-black font-bold">1,520</span>
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-medium">
                  $10.9
                </span>
              </div>
              <p className="text-gray-500 mt-1">Wells done</p>
            </div>

            <div className="p-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-5xl text-black font-bold">78</span>
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-medium">
                  $5.9
                </span>
              </div>
              <p className="text-gray-500 mt-1">Wells to drill</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Wells lists
                </h2>
                <p className="text-gray-500">
                  A descriptive body text comes here
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 hover:border-orange-500 rounded border border-gray-300 bg-white text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200"
                >
                  <img src="/export.svg" alt="Export" className="h-5 w-5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={handleAddOilWell}
                  className="px-4 py-2 rounded bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600 transition-colors duration-200"
                >
                  <img src="/plus.svg" alt="Add" className="h-3 w-3" />
                  <span>Add oil well</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-end mb-4 gap-3">
              <div className="flex gap-2 items-center relative">
                <div className="relative w-60 md:w-72">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-shadow duration-200"
                    placeholder="Search"
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={toggleFilters}
                    className="flex items-center gap-2 px-4 py-2 text-black bg-white border border-gray-300 rounded-lg whitespace-nowrap hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Filter className="text-black h-5 w-5" />
                    <span>Filters</span>
                  </button>
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter Options</h3>
                      {/* Filter by Status */}
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">Status</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full border bg-white text-black border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                          <option value="">All</option>
                          <option value="Active">Active</option>
                          <option value="InActive">Inactive</option>
                        </select>
                      </div>
                      {/* Filter by Progress */}
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">Progress</label>
                        <select
                          value={filterProgress}
                          onChange={(e) => setFilterProgress(e.target.value)}
                          className="w-full border bg-white text-black border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        >
                          <option value="">All</option>
                          <option value="above50">Above 50%</option>
                          <option value="below50">Below 50%</option>
                        </select>
                      </div>
                      <button
                        onClick={applyFilters}
                        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-200"
                      >
                        Apply Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-thin border-divider">
                    <th className="px-4 py-3 text-center w-10 bg-header-bg">
                      <div
                        className="flex justify-center"
                        style={{ minHeight: "24px", minWidth: "24px" }}
                      >
                        {selectedWells.length > 0 ? (
                          <button
                            className="h-2 w-2 bg-white rounded border border-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors duration-150"
                            onClick={() => setSelectedWells([])}
                          >
                            <div className="h-0.5 w-1 bg-orange-500 rounded-sm"></div>
                          </button>
                        ) : (
                          <div className="h-6 w-6 border border-gray-300 rounded"></div>
                        )}
                      </div>
                    </th>

                    <th className="px-4 py-3 text-center font-medium text-gray-500 w-44 bg-header-bg">
                      <div className="flex items-center justify-center gap-1">
                        <span>Identifier</span>
                        <img
                          src="/arrow-down.svg"
                          alt="Sort"
                          className="h-4 w-4"
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 w-32 bg-header-bg">
                      <div className="flex items-center justify-center gap-1">
                        <span>Status</span>
                        <img
                          src="/status.svg"
                          alt="Status"
                          className="h-4 w-4"
                        />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 w-44 bg-header-bg">
                      <div className="flex items-center justify-center gap-1">
                        <span>current phase</span>
                        <img src="/phase.svg" alt="Phase" className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 w-1/3 bg-header-bg">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-500 w-16 bg-header-bg">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentWells.map((well) => (
                    <tr
                      key={well.id}
                      className="border-b border-thin border-divider hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="relative h-4 w-4">
                            <input
                              type="checkbox"
                              id={`checkbox-${well.id}`}
                              className="sr-only peer"
                              checked={selectedWells.includes(well.id)}
                              onChange={() => toggleWellSelection(well.id)}
                            />
                            <label
                              htmlFor={`checkbox-${well.id}`}
                              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded border border-gray-300 
                      bg-white peer-checked:bg-orange-500 peer-checked:border-orange-500 hover:border-orange-300 transition-colors duration-150"
                            >
                              {selectedWells.includes(well.id) && (
                                <svg
                                  className="h-3 w-3 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </label>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="font-medium text-gray-500">Well #{well.id}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <span
                            className={`px-3 py-1 rounded-md inline-block text-center min-w-[90px] ${getStatusBgColor(
                              well.status
                            )} ${getStatusTextColor(well.status)}`}
                          >
                            {well.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-500">
                        {well.phase}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-6">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 flex-1">
                            <div
                              className="bg-orange-500 h-2.5 rounded-full"
                              style={{ width: `${well.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-500 whitespace-nowrap">
                            {well.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="relative flex justify-center">
                          <button
                            onClick={() => toggleDropdown(well.id)}
                            className="rounded-full p-1 bg-white border-none hover:bg-gray-100 focus:outline-none transition-colors duration-150"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                          </button>
                          {openDropdownId === well.id && (
                            <div className="absolute right-0 mt-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => handleViewDetails(well.id)}
                                className="block bg-white w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleEditWell(well.id)}
                                className="block bg-white w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit Well
                              </button>
                              <button
                                onClick={() => handleDeleteWell(well.id)}
                                className="block bg-white w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                              >
                                Delete Well
                              </button>
                            </div>
                          )}
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
                {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredWells.length)} of {filteredWells.length} items
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevPage}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:border-orange-500 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  onClick={nextPage}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:border-orange-500 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}