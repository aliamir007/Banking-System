const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
};

export default LoadingSpinner;
