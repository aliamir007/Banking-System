import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      if (err.fieldErrors) {
        const map = {};
        err.fieldErrors.forEach((fe) => (map[fe.field] = fe.message));
        setFieldErrors(map);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1>Create your account</h1>
      <p className="lede">New customer accounts start out unverified for demo purposes.</p>

      {error && (
        <div className="form-alert error">
          <TriangleAlert size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} required />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input id="phone" name="phone" placeholder="+92 300 1234567" value={form.phone} onChange={handleChange} required />
          {fieldErrors.phone && <span className="field-error">{fieldErrors.phone}</span>}
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
          {fieldErrors.password ? (
            <span className="field-error">{fieldErrors.password}</span>
          ) : (
            <span className="field-hint">Minimum 8 characters.</span>
          )}
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </>
  );
};

export default Register;
