function PendingJob({ job, onApplied, onNotYet, onDiscard, saving }) {
  return (
    <section className="pending-job">
      <p className="section-kicker">Awaiting confirmation</p>
      <h2>Application Pending</h2>
      <p className="pending-intro">Did you apply for this job?</p>

      <div className="pending-job-details">
        <p>
          <span>Title</span>
          <strong>{job.title || "Title not available"}</strong>
        </p>

        <p>
          <span>Company</span>
          <strong>{job.company || "Company not available"}</strong>
        </p>

        <p>
          <span>Location</span>
          <strong>{job.location || "Location not available"}</strong>
        </p>

        <p>
          <span>Salary</span>
          <strong>{job.salary || "Salary not available"}</strong>
        </p>
      </div>

      <div className="pending-job-actions">
        <button
          className="primary-button"
          type="button"
          onClick={onApplied}
          disabled={saving}
        >
          {saving ? "Saving..." : "Yes, I Applied"}
        </button>

        <button
          className="secondary-button"
          type="button"
          onClick={onNotYet}
          disabled={saving}
        >
          Not Yet
        </button>

        <button
          className="secondary-button"
          type="button"
          onClick={onDiscard}
          disabled={saving}
        >
          Discard
        </button>
      </div>
    </section>
  );
}

export default PendingJob;
