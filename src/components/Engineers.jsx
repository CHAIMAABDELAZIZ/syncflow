import { useState } from "react";
import { Search, MoreVertical, Filter, Download } from "lucide-react";

// Mock data
const mockEngineers = [
  { id: 1, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Today" },
  { id: 2, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Yesterday" },
  { id: 3, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Week ago" },
  { id: 4, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Week ago" },
  { id: 5, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Week ago" },
  { id: 6, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Week ago" },
  { id: 7, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Week ago" },
  { id: 8, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Week ago" },
  { id: 9, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Week ago" },
  { id: 10, fullName: "Chaïm Abdelaziz", contact: "lc.abdelaziz@esi.dz", role: "Drilling responsible", well: "Well #A-103", createdAt: "30 Apr, 2025", lastConnection: "Week ago" },
];

export default function Engineers() {
  const [selectedEngineers, setSelectedEngineers] = useState([4, 5]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filterRole, setFilterRole] = useState("");
  const [filterLastConnection, setFilterLastConnection] = useState("");
  const [engineers, setEngineers] = useState(mockEngineers);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const itemsPerPage = 5;

  const toggleEngineerSelection = (engineerId) => {
    if (selectedEngineers.includes(engineerId)) {
      setSelectedEngineers(selectedEngineers.filter((id) => id !== engineerId));
    } else {
      setSelectedEngineers([...selectedEngineers, engineerId]);
    }
    console.log("Selected engineers:", selectedEngineers);
  };

  // Filter logic
  const filteredEngineers = engineers.filter((engineer) => {
    const matchesRole = filterRole ? engineer.role === filterRole : true;
    const matchesLastConnection = filterLastConnection
      ? engineer.lastConnection === filterLastConnection
      : true;
    return matchesRole && matchesLastConnection;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEngineers = filteredEngineers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEngineers.length / itemsPerPage);

  // Handle export
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "ID,Full Name,Contact,Role,Associated Well,Created At,Last Connection\n"
      + filteredEngineers.map(row => `${row.id},${row.fullName},${row.contact},${row.role},${row.well},${row.createdAt},${row.lastConnection}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "engineers_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Exporting engineers data...");
  };

  // Handle add engineer
  const handleAddEngineer = () => {
    console.log("Opening add engineer form...");
  };

  // Handle action dropdown
  const toggleDropdown = (engineerId) => {
    setOpenDropdownId(openDropdownId === engineerId ? null : engineerId);
  };

  const handleViewDetails = (engineerId) => {
    console.log(`Viewing details for engineer ${engineerId}`);
    setOpenDropdownId(null);
  };

  const handleEditEngineer = (engineerId) => {
    console.log(`Editing engineer ${engineerId}`);
    setOpenDropdownId(null);
  };

  const handleDeleteEngineer = (engineerId) => {
    setEngineers(engineers.filter((engineer) => engineer.id !== engineerId));
    setSelectedEngineers(selectedEngineers.filter((id) => id !== engineerId));
    setOpenDropdownId(null);
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
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="dashboard-container bg-[#FEFCFA] min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Engineers</h1>
            <p className="text-gray-500">A descriptive body text comes here</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddEngineer}
              className="px-4 py-2 rounded bg-orange-500 text-white flex items-center gap-2 hover:bg-orange-600 transition-colors duration-200"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 1V11M1 6H11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Add Engineer</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow p-6 relative">
          {/* Search, Filter, and Export inside the table */}
          <div className="flex flex-wrap md:flex-row justify-end items-center mb-4 gap-2">
            <div className="flex gap-2 items-center relative">
              <button
                  onClick={handleExport}
                  className="px-4 py-2 hover:border-orange-500 rounded border border-gray-300 bg-white text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200"
                >
                  <img src="/export.svg" alt="Export" className="h-5 w-5" />
                  <span>Export</span>
                </button>
              <div className="relative w-60">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full text-black pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-shadow duration-200"
                  placeholder="Search"
                />
              </div>
              <button
                onClick={toggleFilters}
                className="flex items-center gap-2 px-4 py-2 text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="text-black h-5 w-5" />
                <span>Filters</span>
              </button>
              {showFilters && (
                <div className="absolute right-6 top-12 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Filter Options</h3>
                  {/* Filter by Role */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Role</label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="w-full border bg-white text-black border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="">All</option>
                      <option value="Drilling responsible">Drilling responsible</option>
                    </select>
                  </div>
                  {/* Filter by Last Connection */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1">Last Connection</label>
                    <select
                      value={filterLastConnection}
                      onChange={(e) => setFilterLastConnection(e.target.value)}
                      className="w-full border bg-white text-black border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="">All</option>
                      <option value="Today">Today</option>
                      <option value="Yesterday">Yesterday</option>
                      <option value="Week ago">Week ago</option>
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

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-center w-10">
                    <div className="flex justify-center">
                      {selectedEngineers.length > 0 ? (
                        <button
                          className="h-2 w-2 bg-white rounded border border-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors duration-150"
                          onClick={() => setSelectedEngineers([])}
                        >
                          <div className="h-0.5 w-1 bg-orange-500 rounded-sm"></div>
                        </button>
                      ) : (
                        <div className="h-6 w-6 border border-gray-300 rounded"></div>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">
                    <div className="flex items-center justify-center gap-1">
                      <span>Full name</span>
                      <img src="/arrow-down.svg" alt="Sort" className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">
                    <div className="flex items-center justify-center gap-1">
                      <span>Contact</span>
                      <img src="/phone.svg" alt="Contact" className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">
                    <div className="flex items-center justify-center gap-1">
                      <span>Role</span>
                      <img src="/role.svg" alt="Role" className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">
                    <div className="flex items-center justify-center gap-1">
                      <span>Associated well</span>
                      <img src="/phase.svg" alt="Well" className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">
                    <div className="flex items-center justify-center gap-1">
                      <span>Created at</span>
                      <img src="/calendar.svg" alt="Created" className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">
                    <div className="flex items-center justify-center gap-1">
                      <span>Last connection</span>
                      <img src="/calendar.svg" alt="Last Connection" className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500 w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEngineers.map((engineer) => (
                  <tr key={engineer.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="relative h-4 w-4">
                          <input
                            type="checkbox"
                            id={`checkbox-${engineer.id}`}
                            className="sr-only peer"
                            checked={selectedEngineers.includes(engineer.id)}
                            onChange={() => toggleEngineerSelection(engineer.id)}
                          />
                          <label
                            htmlFor={`checkbox-${engineer.id}`}
                            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded border border-gray-300 bg-white peer-checked:bg-orange-500 peer-checked:border-orange-500 hover:border-orange-300 transition-colors duration-150"
                          >
                            {selectedEngineers.includes(engineer.id) && (
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
                      <div className="flex items-center justify-center gap-2">
                        <img src="/engineer-placeholder.png" alt="Engineer" className="h-8 w-8 rounded-full" />
                        <span className="font-medium text-gray-500">{engineer.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-500">{engineer.contact}</td>
                    <td className="px-4 py-4 text-center text-gray-500">{engineer.role}</td>
                    <td className="px-4 py-4 text-center text-gray-500">{engineer.well}</td>
                    <td className="px-4 py-4 text-center text-gray-500">{engineer.createdAt}</td>
                    <td className="px-4 py-4 text-center text-gray-500">{engineer.lastConnection}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="relative flex justify-center">
                        <button
                          onClick={() => toggleDropdown(engineer.id)}
                          className="rounded-full p-1 bg-white border-none hover:bg-gray-100 focus:outline-none transition-colors duration-150"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>
                        {openDropdownId === engineer.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => handleViewDetails(engineer.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleEditEngineer(engineer.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit Engineer
                            </button>
                            <button
                              onClick={() => handleDeleteEngineer(engineer.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            >
                              Delete Engineer
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
              {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredEngineers.length)} of {filteredEngineers.length} items
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}