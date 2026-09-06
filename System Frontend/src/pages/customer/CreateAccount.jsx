import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import { usePageHeader } from '../../hooks/usePageHeader.js';
import { createAccountRequest } from '../../services/account.service.js';

const CreateAccount = () => {
  usePageHeader({ title: 'Open an account', subtitle: 'Checking or savings, in the currency you need' });
  const navigate = useNavigate();

  const [form, setForm] = useState({ accountType: 'CHECKING', currency: 'PKR' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createAccountRequest(form);
      navigate('/accounts', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 460 }}>
      <div className="panel-head">
        <div>
          <h2>Account details</h2>
          <p>New accounts start with a zero balance</p>
        </div>
      </div>
      <div className="panel-body">
        {error && (
          <div className="form-alert error">
            <TriangleAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="accountType">Account type</label>
            <select
              id="accountType"
              value={form.accountType}
              onChange={(e) => setForm({ ...form, accountType: e.target.value })}
            >
              <option value="CHECKING">Checking</option>
              <option value="SAVINGS">Savings</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="currency">Currency</label>
            <input
              id="currency"
              maxLength={3}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
              placeholder="PKR"
            />
            <span className="field-hint">3-letter currency code, e.g. PKR, USD, EUR.</span>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-accent" disabled={submitting}>
              {submitting ? 'Opening…' : 'Open account'}
            </button>
            <Link to="/accounts" className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
