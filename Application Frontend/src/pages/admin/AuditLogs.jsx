import { useEffect, useState } from 'react';
import { ScrollText } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { listAuditLogsRequest } from '../../services/audit.service.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatDate } from '../../utils/formatDate.js';

const AuditLogs = () => {
  usePageHeader({ title: 'Audit logs', subtitle: 'Every recorded action across the system' });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listAuditLogsRequest()
      .then(setLogs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Audit logs</h1>
          <p>{logs.length} entr{logs.length === 1 ? 'y' : 'ies'} recorded</p>
        </div>
      </div>

      {error && <div className="form-alert error">{error}</div>}

      <div className="panel">
        {loading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <ScrollText size={28} />
            <h3>No activity recorded</h3>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="ledger">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>By</th>
                  <th>IP address</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td style={{ fontWeight: 600, fontSize: 13.5 }}>{log.action.replaceAll('_', ' ')}</td>
                    <td className="mono">{log.resource}</td>
                    <td>{log.userId?.name || 'System'}</td>
                    <td className="mono" style={{ fontSize: 12.5 }}>{log.ipAddress || '—'}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AuditLogs;
