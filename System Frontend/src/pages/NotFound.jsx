import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found">
    <div className="code numeral">404</div>
    <p>This page doesn't exist, or you don't have access to it.</p>
    <Link to="/dashboard" className="btn btn-accent">
      Back to dashboard
    </Link>
  </div>
);

export default NotFound;
