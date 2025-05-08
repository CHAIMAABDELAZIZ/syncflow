import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Navbar';
import Card from '../components/Card';
import MapCard from '../components/MapCard';
import FlowChart from '../components/FlowChart';
import CostChart from '../components/CostChart';
import Info from '../components/info';

function Home() {
  return (

        <div className="flex-1 p-8 overflow-auto">
          <Info />
          <div className="grid grid-cols-6 gap-6 w-full">
            <Card />
            <MapCard />
            <FlowChart />
            <CostChart />
          </div>
        </div>

  );
}

export default Home;