import { useEffect, useMemo, useState } from 'react';
import { Receipt } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { listAccountsRequest } from '../../services/account.service.js';
import { listTransactionsRequest } from '../../services/transaction.service.js';
import TransactionRow from '../../components/TransactionRow.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'sent', label: 'Sent' },
  { key: 'received', label: 'Received' },
  { key: 'flagged', label: 'Flagged' },
];

const Transactions = () => {
  usePageHeader({ title: 'Transactions', subtitle: 'Every transfer in and out of your accounts' });

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([listAccountsRequest(), listTransactionsRequest()])
      .then(([accs, txs]) => {
        setAccounts(accs);
        setTransactions(txs);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const myAccountNumbers = useMemo(() => new Set(accounts.map((a) => a.accountNumber)), [accounts]);

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'flagged') return transactions.filter((t) => t.status === 'FLAGGED');
    return transactions.filter((t) => {
      const senderNumber = t.senderAccount?.accountNumber || t.senderAccount;
      const isOutgoing = myAccountNumbers.has(senderNumber);
      return filter === 'sent' ? isOutgoing : !isOutgoing;
    });
  }, [transactions, filter, myAccountNumbers]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Transaction history</h1>
          <p>{transactions.length} total transaction{transactions.length === 1 ? '' : 's'}</p>
        </div>
        <div className="tag-list">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="form-alert error">{error}</div>}

      <div className="panel">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Receipt size={28} />
            <h3>Nothing here</h3>
            <p>No transactions match this filter yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="ledger">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="numeral">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <TransactionRow key={t._id} transaction={t} myAccountNumbers={myAccountNumbers} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Transactions;
