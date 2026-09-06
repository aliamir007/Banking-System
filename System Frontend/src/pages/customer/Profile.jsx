import { usePageHeader } from '../../hooks/usePageHeader.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDateOnly } from '../../utils/formatDate.js';
import StatusBadge from '../../components/StatusBadge.jsx';

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
    <span style={{ color: 'var(--text-soft)', fontSize: 13.5 }}>{label}</span>
    <span style={{ fontWeight: 600, fontSize: 14 }}>{value}</span>
  </div>
);

const Profile = () => {
  usePageHeader({ title: 'Profile', subtitle: 'Your account details' });
  const { user } = useAuth();

  return (
    <div className="panel" style={{ maxWidth: 520 }}>
      <div className="panel-head">
        <div>
          <h2>Personal information</h2>
          <p>Read-only — contact support to update these details</p>
        </div>
      </div>
      <div className="panel-body">
        <Row label="Full name" value={user?.name} />
        <Row label="Email" value={user?.email} />
        <Row label="Phone" value={user?.phone || '—'} />
        <Row label="Role" value={user?.role === 'ADMIN' ? 'Administrator' : 'Customer'} />
        <Row label="Status" value={<StatusBadge status={user?.isActive === false ? 'CLOSED' : 'ACTIVE'} />} />
        <Row label="Member since" value={formatDateOnly(user?.createdAt)} />
      </div>
    </div>
  );
};

export default Profile;
