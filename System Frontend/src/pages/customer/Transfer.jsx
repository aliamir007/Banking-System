import { useEffect, useState } from 'react';
import { TriangleAlert, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { listAccountsRequest } from '../../services/account.service.js';
import { transferRequest } from '../../services/transaction.service.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const Transfer = () => {
  usePageHeader({ title: 'Transfer', subtitle: 'Move money between accounts' });

  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [form, setForm] = useState({ senderAccount: '', receiverAccount: '', amount: '', description: '' });
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { kind: 'success' | 'flagged' | 'blocked', message, transaction }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listAccountsRequest()
      .then((accs) => {
        setAccounts(accs);
        const firstActive = accs.find((a) => a.status === 'ACTIVE');
        if (firstActive) setForm((f) => ({ ...f, senderAccount: firstActive.accountNumber }));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingAccounts(false));
  }, []);

  const selectedAccount = accounts.find((a) => a.accountNumber === form.senderAccount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setSubmitting(true);
    try {
      const body = await transferRequest({
        senderAccount: form.senderAccount,
        receiverAccount: form.receiverAccount.trim(),
        amount: Number(form.amount),
        description: form.description,
      });

      const transaction = body.data.transaction;
      const messageLower = body.message.toLowerCase();
      const kind = messageLower.includes('blocked')
        ? 'blocked'
        : transaction.status === 'FLAGGED'
        ? 'flagged'
        : 'success';

      setResult({ kind, message: body.message, transaction });
      setForm((f) => ({ ...f, receiverAccount: '', amount: '', description: '' }));

      // Refresh sender balance view
      listAccountsRequest().then(setAccounts).catch(() => {});
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
          <ShieldAlert size={28} />
          <h3>You need an account first</h3>
          <p>Open an account before you can send a transfer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-2">
      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>New transfer</h2>
            <p>Sent instantly, screened automatically</p>
          </div>
        </div>
        <div className="panel-body">
          {error && (
            <div className="form-alert error">
              <TriangleAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className={`form-alert ${result.kind === 'success' ? 'success' : result.kind === 'flagged' ? 'warning' : 'error'}`}>
              {result.kind === 'success' ? (
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              )}
              <span>{result.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="senderAccount">From account</label>
              <select
                id="senderAccount"
                value={form.senderAccount}
                onChange={(e) => setForm({ ...form, senderAccount: e.target.value })}
                required
              >
                {accounts.map((a) => (
                  <option key={a._id} value={a.accountNumber} disabled={a.status !== 'ACTIVE'}>
                    {a.accountType} •••• {a.accountNumber.slice(-4)} — {formatCurrency(a.balance, a.currency)}
                    {a.status !== 'ACTIVE' ? ` (${a.status})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="receiverAccount">To account number</label>
              <input
                id="receiverAccount"
                value={form.receiverAccount}
                onChange={(e) => setForm({ ...form, receiverAccount: e.target.value })}
                placeholder="10-digit account number"
                required
              />
            </div>

            <div className="field-row">
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
              <div className="field">
                <label htmlFor="description">Description (optional)</label>
                <input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Rent"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send transfer'}
            </button>
          </form>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div>
            <h2>From this account</h2>
          </div>
        </div>
        <div className="panel-body">
          {selectedAccount ? (
            <>
              <div className="stat-label">Available balance</div>
              <div className="stat-value numeral" style={{ fontSize: 32 }}>
                {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
              </div>
              <div className="divider" />
              <div style={{ fontSize: 13, color: 'var(--text-soft)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span>Large, unusually rapid, or unusual transfers may be automatically held for review by our fraud engine.</span>
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

export default Transfer;
