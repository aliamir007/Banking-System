// Maps every status string used across accounts, transactions, and fraud
// alerts to a consistent color so "COMPLETED" always reads the same way
// wherever it appears in the app.
const STATUS_MAP = {
  // Account status
  ACTIVE: 'emerald',
  FROZEN: 'amber',
  CLOSED: 'slate',

  // Transaction status
  PENDING: 'amber',
  COMPLETED: 'emerald',
  FAILED: 'rose',
  FLAGGED: 'rose',
  REVERSED: 'slate',

  // Fraud alert status
  OPEN: 'rose',
  UNDER_REVIEW: 'amber',
  RESOLVED: 'emerald',
  FALSE_POSITIVE: 'slate',
};

const LABEL_OVERRIDES = {
  UNDER_REVIEW: 'Under review',
  FALSE_POSITIVE: 'False positive',
};

const StatusBadge = ({ status }) => {
  const color = STATUS_MAP[status] || 'slate';
  const label = LABEL_OVERRIDES[status] || (status ? status.charAt(0) + status.slice(1).toLowerCase() : 'Unknown');

  return (
    <span className={`badge badge-${color}`}>
      <span className="dot" />
      {label}
    </span>
  );
};

export default StatusBadge;
