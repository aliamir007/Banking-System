import { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { listFraudAlertsRequest, reviewFraudAlertRequest } from '../../services/fraud.service.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatDate } from '../../utils/formatDate.js';

const REVIEW_ACTIONS = [
  { status: 'UNDER_REVIEW', label: 'Mark under review' },
  { status: 'RESOLVED', label: 'Resolve' },
  { status: 'FALSE_POSITIVE', label: 'False positive' },
];

const SEVERITY_COLOR = { LOW: 'slate', MEDIUM: 'amber', HIGH: 'rose', CRITICAL: 'rose' };

const FraudAlerts = () => {
  usePageHeader({ title: 'Fraud alerts', subtitle: 'Transfers flagged by the rule engine' });

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null);

  const load = () => {
    setLoading(true);
    listFraudAlertsRequest()
      .then(setAlerts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleReview = async (id, status) => {
    setError('');
    setActioningId(id);
    try {
      const updated = await reviewFraudAlertRequest(id, status);
      setAlerts((prev) => prev.map((a) => (a._id === id ? updated : a)));
    } catch (err) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Fraud alerts</h1>
          <p>{alerts.length} alert{alerts.length === 1 ? '' : 's'} recorded</p>
        </div>
      </div>

      {error && <div className="form-alert error">{error}</div>}

      <div className="panel">
        {loading ? (
          <LoadingSpinner />
        ) : alerts.length === 0 ? (
          <div className="empty-state">
            <ShieldAlert size={28} />
            <h3>No fraud alerts</h3>
            <p>Nothing has triggered the rule engine yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="ledger">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Rules triggered</th>
                  <th className="numeral">Risk score</th>
                  <th>Status</th>
                  <th>Raised</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert._id}>
                    <td>
                      <span className={`badge badge-${SEVERITY_COLOR[alert.severity] || 'slate'}`}>
                        <span className="dot" />
                        {alert.severity}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-soft)', maxWidth: 260 }}>
                      {alert.rulesTriggered.join(', ') || '—'}
                    </td>
                    <td className="numeral">{alert.riskScore}</td>
                    <td>
                      <StatusBadge status={alert.status} />
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>{formatDate(alert.createdAt)}</td>
                    <td>
                      {alert.status === 'OPEN' || alert.status === 'UNDER_REVIEW' ? (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {REVIEW_ACTIONS.filter((a) => a.status !== alert.status).map((a) => (
                            <button
                              key={a.status}
                              className="btn btn-sm btn-ghost"
                              disabled={actioningId === alert._id}
                              onClick={() => handleReview(alert._id, a.status)}
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 12.5, color: 'var(--text-faint)' }}>
                          {alert.reviewedAt ? `Closed ${formatDate(alert.reviewedAt)}` : 'Closed'}
                        </span>
                      )}
                    </td>
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

export default FraudAlerts;
