import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';
import StatusBadge from './StatusBadge.jsx';

// `myAccountNumbers` (a Set of the current user's own account numbers) lets
// us show each row from the user's point of view — money out vs money in —
// even though the backend just stores a sender and a receiver.
const TransactionRow = ({ transaction, myAccountNumbers }) => {
  const senderNumber = transaction.senderAccount?.accountNumber || transaction.senderAccount;
  const receiverNumber = transaction.receiverAccount?.accountNumber || transaction.receiverAccount;

  const isOutgoing = myAccountNumbers ? myAccountNumbers.has(senderNumber) : true;
  const sign = isOutgoing ? '−' : '+';
  const amountColor = isOutgoing ? 'var(--rose)' : 'var(--emerald)';

  return (
    <tr>
      <td>
        <div className="mono">{transaction.reference}</div>
        {transaction.description && <div className="tx-desc">{transaction.description}</div>}
      </td>
      <td className="mono">•••• {String(senderNumber).slice(-4)}</td>
      <td className="mono">•••• {String(receiverNumber).slice(-4)}</td>
      <td>
        <StatusBadge status={transaction.status} />
      </td>
      <td style={{ color: 'var(--text-faint)', fontSize: 13 }}>{formatDate(transaction.createdAt)}</td>
      <td className="numeral" style={{ color: amountColor, fontWeight: 600 }}>
        {sign} {formatCurrency(transaction.amount)}
      </td>
    </tr>
  );
};

export default TransactionRow;
