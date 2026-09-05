import { useAuth } from '../context/AuthContext.jsx';

// Topbar shown above every dashboard page. `title`/`subtitle` are set by
// each page via DashboardLayout so the header always matches the section.
const Navbar = ({ title, subtitle }) => {
  const { isAdmin } = useAuth();

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="topbar-sub">{subtitle}</div>}
      </div>
      <span className="role-badge">{isAdmin ? 'Admin access' : 'Customer access'}</span>
    </header>
  );
};

export default Navbar;
