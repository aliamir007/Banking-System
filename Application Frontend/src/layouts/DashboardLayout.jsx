import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Navbar from '../components/Navbar.jsx';

// Pages call usePageHeader({ title, subtitle }) (see hooks/usePageHeader.js)
// which receives this setter through the router's outlet context, so each
// page can control the topbar without DashboardLayout knowing about routes.
const DashboardLayout = () => {
  const [header, setHeader] = useState({ title: '', subtitle: '' });

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Navbar title={header.title} subtitle={header.subtitle} />
        <div className="content">
          <Outlet context={{ setHeader }} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
