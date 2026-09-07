import { useEffect, useState } from 'react';
import { TriangleAlert, CheckCircle2, PiggyBank } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { listAccountsRequest, depositRequest } from '../../services/account.service.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const Deposit = () => {
  usePageHeader({ title: 'Deposit', subtitle: 'Add funds to one of your accounts' });

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [form, setForm] = useState({ accountId: '', amount: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listAccountsRequest()
      .then((accs) => {
        setAccounts(accs);
        const firstActive = accs.find((a) => a.status === 'ACTIVE');
        if (firstActive) setForm((f) => ({ ...f, accountId: firstActive._id }));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingAccounts(false));
  }, []);

  const selectedAccount = accounts.find((a) => a._id === form.accountId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const depositedAmount = Number(form.amount);
      const updated = await depositRequest(form.accountId, depositedAmount);
      setAccounts((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
      setSuccess(
        `Deposited ${formatCurrency(depositedAmount, updated.currency)} — new balance ${formatCurrency(
          updated.balance,
          updated.currency
        )}`
      );
      setForm((f) => ({ ...f, amount: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingAccounts) return <LoadingSpinner />;

  if (accounts.length === 0) {
    return (
      <div className="panel">
        <div className="empty-state">
          <PiggyBank size={28} />
          <h3>You need an account first</h3>
          <p>Open an account before you can deposit funds.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-2">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Add funds</h2>
            <p>Deposit money directly into one of your accounts</p>
          </div>
        </div>
        <div className="panel-body">
          {error && (
            <div className="form-alert error">
              <TriangleAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="form-alert success">
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="accountId">Deposit into</label>
              <select
                id="accountId"
                value={form.accountId}
                onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                required
              >
                {accounts.map((a) => (
                  <option key={a._id} value={a._id} disabled={a.status !== 'ACTIVE'}>
                    {a.accountType} •••• {a.accountNumber.slice(-4)} — {formatCurrency(a.balance, a.currency)}
                    {a.status !== 'ACTIVE' ? ` (${a.status})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
              {submitting ? 'Depositing…' : 'Deposit funds'}
            </button>
          </form>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>Selected account</h2>
          </div>
        </div>
        <div className="panel-body">
          {selectedAccount ? (
            <>
              <div className="stat-label">Current balance</div>
              <div className="stat-value numeral" style={{ fontSize: 32 }}>
                {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-faint)', fontSize: 13.5 }}>Select an account to see its balance.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deposit;