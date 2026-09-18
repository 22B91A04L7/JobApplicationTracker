function JobExtractor({ loading, error, onGetJobDetails }) {
  return (
    <>
      <h2>Track this job</h2>

      <p>Review and save this job application directly from this page.</p>

      {error && <p className="error-message">{error}</p>}

      <button type="button" onClick={onGetJobDetails} disabled={loading}>
        {loading ? "Getting Job Details..." : "Get Job Details"}
      </button>
    </>
  );
}

export default JobExtractor;
