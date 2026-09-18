function PendingJob({ job, onApplied, onDiscard, saving }) {
  return (
    <section className="pending-job">
      <h2>Application Pending</h2>

      <div className="pending-job-details">
        <p>
          <strong>Title:</strong> {job.title || "Title not available"}
        </p>

        <p>
          <strong>Company:</strong> {job.company || "Company not available"}
        </p>

        <p>
          <strong>Location:</strong> {job.location || "Location not available"}
        </p>

        <p>
          <strong>Salary:</strong> {job.salary || "Salary not available"}
        </p>
      </div>

      <div className="pending-job-actions">
        <button type="button" onClick={onApplied} disabled={saving}>
          {saving ? "Saving..." : "Yes, I Applied"}
        </button>

        <button type="button" onClick={onDiscard} disabled={saving}>
          Discard
        </button>
      </div>
    </section>
  );
}

export default PendingJob;
