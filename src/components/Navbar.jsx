import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-orangePtrm text-white px-4 py-3 shadow flex justify-between items-center">
      <div className="text-xl font-bold">Petrium</div>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/alerts" className="hover:underline">Alerts</Link>
        <Link to="/submit-report" className="hover:underline">Submit Report</Link>
        <Link to="/submit-provisional" className="hover:underline">Submit Provisional</Link>
      </div>
    </nav>
  );
}

export default Navbar;
