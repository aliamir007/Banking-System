import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="auth-shell">
    <div className="auth-brand">
      <div className="auth-mark">
        <span style={{ color: '#3fa47a' }}>●</span> Ledger
      </div>
      <div>
        <h1 className="auth-headline">Every transaction, accounted for.</h1>
        <p className="auth-sub">
          Open accounts, move money between them, and let rule-based fraud detection watch every
          transfer in real time.
        </p>
      </div>
      <div className="auth-foot">Bank Account Management System</div>
    </div>

    <div className="auth-panel">
      <div className="auth-card">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
