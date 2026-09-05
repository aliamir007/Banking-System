import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ScrollText } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { listAccountsRequest } from '../../services/account.service.js';
import { listFraudAlertsRequest } from '../../services/fraud.service.js';
import { listAuditLogsRequest } from '../../services/audit.service.js';
import StatCard from '../../components/StatCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatDate } from '../../utils/formatDate.js';

const AdminDashboard = () => {
  usePageHeader({ title: 'Admin overview', subtitle: 'Bank-wide activity at a glance' });

  const [accounts, setAccounts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([listAccountsRequest(), listFraudAlertsRequest(), listAuditLogsRequest()])
      .then(([accs, fraudAlerts, auditLogs]) => {
        setAccounts(accs);
        setAlerts(fraudAlerts);
        setLogs(auditLogs);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const openAlerts = alerts.filter((a) => a.status === 'OPEN').length;
  const uniqueCustomers = new Set(accounts.map((a) => (typeof a.userId === 'object' ? a.userId?._id : a.userId))).size;

  return (
    <>
      {error && <div className="form-alert error">{error}</div>}

      <div className="stat-row">
        <StatCard label="Total accounts" value={accounts.length} sub={`${uniqueCustomers} customer${uniqueCustomers === 1 ? '' : 's'}`} accent="emerald" />
        <StatCard
          label="Open fraud alerts"
          value={openAlerts}
          sub={openAlerts > 0 ? 'Needs review' : 'All clear'}
          accent={openAlerts > 0 ? 'rose' : 'emerald'}
        />
        <StatCard label="Audit log entries" value={logs.length} sub="All recorded actions" accent="amber" />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Latest fraud alerts</h2>
              <p>Most recently triggered rules</p>
            </div>
            <Link to="/admin/fraud-alerts" className="link-btn">
              View all
            </Link>
          </div>
          {alerts.length === 0 ? (
            <div className="empty-state">
              <ShieldAlert size={28} />
              <h3>No alerts</h3>
              <p>The fraud engine hasn't flagged anything yet.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Rules triggered</th>
                    <th>Risk score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.slice(0, 5).map((a) => (
                    <tr key={a._id}>
                      <td>{a.severity}</td>
                      <td style={{ fontSize: 12.5, color: 'var(--text-soft)' }}>{a.rulesTriggered.join(', ') || '—'}</td>
                      <td className="numeral">{a.riskScore}</td>
                      <td>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent activity</h2>
              <p>Latest audit log entries</p>
            </div>
            <Link to="/admin/audit-logs" className="link-btn">
              View all
            </Link>
          </div>
          {logs.length === 0 ? (
            <div className="empty-state">
              <ScrollText size={28} />
              <h3>No activity yet</h3>
            </div>
          ) : (
            <div style={{ padding: '4px 22px 12px' }}>
              {logs.slice(0, 6).map((log) => (
                <div key={log._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{log.action.replaceAll('_', ' ')}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                    {log.userId?.name || 'System'} · {formatDate(log.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
