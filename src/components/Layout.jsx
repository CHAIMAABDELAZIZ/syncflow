import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './scrollbar-hide.css';

function Layout() {
  return (
    <div className="flex h-screen  overflow-hidden">
      {/* Sidebar à gauche */}
      <Sidebar />

      {/* Contenu principal à droite */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar en haut */}
        <Navbar />

        {/* Zone principale */}
        <main className="p-4 flex-1 overflow-y-auto scrollbar-hide"> 
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
