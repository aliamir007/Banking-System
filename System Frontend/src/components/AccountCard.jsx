import { formatCurrency } from '../utils/formatCurrency.js';
import StatusBadge from './StatusBadge.jsx';

const AccountCard = ({ account }) => (
  <div className="account-card">
    <div className="account-card-top">
      <div>
        <div className="account-type">{account.accountType}</div>
        <div className="account-number">•••• {account.accountNumber.slice(-4)}</div>
      </div>
      <StatusBadge status={account.status} />
    </div>
    <div>
      <div className="account-balance numeral">{formatCurrency(account.balance, account.currency)}</div>
      <div className="account-currency">Full number: {account.accountNumber}</div>
    </div>
  </div>
);

export default AccountCard;
