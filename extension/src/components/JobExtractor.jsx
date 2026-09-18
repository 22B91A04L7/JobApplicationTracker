function JobExtractor({ loading, error, onGetJobDetails }) {
  return (
    <section className="extractor-panel">
      <p className="section-kicker">New application</p>
      <h2>Track this job</h2>

      <p>Review and save this job application directly from this page.</p>

      {error && <p className="error-message">{error}</p>}

      <button className="primary-button" type="button" onClick={onGetJobDetails} disabled={loading}>
        {loading ? "Getting Job Details..." : "Get Job Details"}
      </button>
    </section>
  );
}

export default JobExtractor;
