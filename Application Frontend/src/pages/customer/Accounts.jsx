import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Wallet } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { listAccountsRequest } from '../../services/account.service.js';
import AccountCard from '../../components/AccountCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const Accounts = () => {
  usePageHeader({ title: 'Accounts', subtitle: 'Everything you hold with us' });

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listAccountsRequest()
      .then(setAccounts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Your accounts</h1>
          <p>Checking and savings accounts opened under your name</p>
        </div>
        <Link to="/accounts/new" className="btn btn-accent">
          <Plus size={16} /> Open account
        </Link>
      </div>

      {error && <div className="form-alert error">{error}</div>}

      {loading ? (
        <LoadingSpinner />
      ) : accounts.length === 0 ? (
        <div className="panel">
          <div className="empty-state">
            <Wallet size={28} />
            <h3>No accounts yet</h3>
            <p>Open your first account to start sending and receiving money.</p>
            <div style={{ marginTop: 18 }}>
              <Link to="/accounts/new" className="btn btn-primary">
                Open your first account
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="account-grid">
          {accounts.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      )}
    </>
  );
};

export default Accounts;
