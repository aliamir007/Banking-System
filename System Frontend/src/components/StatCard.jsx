const StatCard = ({ label, value, sub, accent }) => (
  <div className={`stat-block${accent ? ` accent-${accent}` : ''}`}>
    <div className="stat-label">{label}</div>
    <div className="stat-value numeral">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

export default StatCard;
