import './App.css';
import AuthIngnr from './pages/AuthIngnr';
import Dashboard from './components/Wells';
import Alerts from './components/alerts';
import SubmitReport from './components/SubmitReport';
import Layout from './components/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SubmitProvisional from './components/SubmitProvisional';
import Home from './pages/Home';
import Engineers from './components/Engineers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthIngnr />} />
        
        {/* Protected layout with navbar */}
        <Route element={<Layout />}>
          <Route path="/Wells" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/engineers" element={<Engineers />} />
          <Route path="/submit-report" element={<SubmitReport />} />
          <Route path="/submit-provisional" element={<SubmitProvisional />} />
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;