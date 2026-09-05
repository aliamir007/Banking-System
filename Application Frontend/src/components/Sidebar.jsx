import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Receipt,
  UserRound,
  ShieldAlert,
  ScrollText,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const customerLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/fraud-alerts', label: 'Fraud alerts', icon: ShieldAlert },
  { to: '/admin/audit-logs', label: 'Audit logs', icon: ScrollText },
];

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="dot" />
        Ledger
      </div>

      <div className="sidebar-section-label">{isAdmin ? 'Administration' : 'Banking'}</div>
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-user">
        <div className="sidebar-avatar">{initialsOf(user?.name)}</div>
        <div className="sidebar-user-meta">
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-role">{isAdmin ? 'Administrator' : 'Customer'}</div>
        </div>
        <button className="sidebar-logout" onClick={logout} title="Log out" aria-label="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
