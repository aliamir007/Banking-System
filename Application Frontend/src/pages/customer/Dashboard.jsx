import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowLeftRight, ShieldCheck } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { listAccountsRequest } from '../../services/account.service.js';
import { listTransactionsRequest } from '../../services/transaction.service.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import StatCard from '../../components/StatCard.jsx';
import TransactionRow from '../../components/TransactionRow.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

const Dashboard = () => {
  const { user } = useAuth();
  usePageHeader({ title: 'Overview', subtitle: `Welcome back, ${user?.name?.split(' ')[0] || ''}` });

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [accs, txs] = await Promise.all([listAccountsRequest(), listTransactionsRequest()]);
        setAccounts(accs);
        setTransactions(txs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const myAccountNumbers = useMemo(() => new Set(accounts.map((a) => a.accountNumber)), [accounts]);

  // Group balances by currency since accounts can be opened in different currencies.
  const balancesByCurrency = useMemo(() => {
    const map = {};
    accounts.forEach((a) => {
      map[a.currency] = (map[a.currency] || 0) + a.balance;
    });
    return map;
  }, [accounts]);

  const currencies = Object.keys(balancesByCurrency);
  const flaggedCount = transactions.filter((t) => t.status === 'FLAGGED').length;

  if (loading) return <LoadingSpinner fullPage={false} />;

  return (
    <>
      {error && <div className="form-alert error">{error}</div>}

      <div className="hero-balance">
        <div className="hero-balance-label">Total balance</div>
        {currencies.length <= 1 ? (
          <div className="hero-balance-value numeral">
            {formatCurrency(balancesByCurrency[currencies[0]] || 0, currencies[0] || 'PKR')}
          </div>
        ) : (
          <>
            <div className="hero-balance-value numeral">{formatCurrency(balancesByCurrency[currencies[0]], currencies[0])}</div>
            <div className="hero-balance-note">
              + {currencies.slice(1).map((c) => formatCurrency(balancesByCurrency[c], c)).join(', ')}
            </div>
          </>
        )}
        <div className="hero-balance-note">Across {accounts.length} account{accounts.length === 1 ? '' : 's'}</div>
      </div>

      <div className="stat-row">
        <StatCard label="Open accounts" value={accounts.length} sub="Checking & savings" accent="emerald" />
        <StatCard label="Total transactions" value={transactions.length} sub="Sent & received" />
        <StatCard
          label="Flagged for review"
          value={flaggedCount}
          sub={flaggedCount > 0 ? 'Awaiting fraud review' : 'Nothing flagged'}
          accent={flaggedCount > 0 ? 'rose' : 'emerald'}
        />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent transactions</h2>
              <p>Your last few transfers, in and out</p>
            </div>
            <Link to="/transactions" className="link-btn">
              View all
            </Link>
          </div>
          {transactions.length === 0 ? (
            <div className="empty-state">
              <Wallet size={28} />
              <h3>No transactions yet</h3>
              <p>Once you send or receive a transfer, it will show up here.</p>
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
                  {transactions.slice(0, 5).map((t) => (
                    <TransactionRow key={t._id} transaction={t} myAccountNumbers={myAccountNumbers} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Quick actions</h2>
              <p>Common things you might do next</p>
            </div>
          </div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/transfer" className="btn btn-accent btn-block">
              <ArrowLeftRight size={16} /> Send a transfer
            </Link>
            <Link to="/accounts" className="btn btn-ghost btn-block">
              <Wallet size={16} /> Open a new account
            </Link>
            <div className="divider" />
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-soft)' }}>
              <ShieldCheck size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--emerald)' }} />
              <span>
                Every transfer runs through our rule-based fraud engine automatically. Unusually large or
                rapid transfers may be held for review.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
