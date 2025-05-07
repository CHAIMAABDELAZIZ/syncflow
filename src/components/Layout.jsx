import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <>
      <Navbar />
      <Sidebar/>
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;