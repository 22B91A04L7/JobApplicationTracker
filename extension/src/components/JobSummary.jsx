function JobSummary({ job, onTrackJob, onViewApplication, duplicate, error }) {
  const hasMetadata = job.location || job.experience || job.salary;

  return (
    <section className="job-summary state-panel">
      <p className="section-kicker">
        {duplicate ? "Already tracked" : "Job details"}
      </p>

      <h2>{job.title || "Title not available"}</h2>

      <p className="job-summary-company">
        {job.company || "Company not available"}
      </p>

      {hasMetadata && (
        <dl className="job-summary-meta">
          {job.location && (
            <div>
              <dt>Location</dt>
              <dd>{job.location}</dd>
            </div>
          )}

          {job.experience && (
            <div>
              <dt>Experience</dt>
              <dd>{job.experience}</dd>
            </div>
          )}

          {job.salary && (
            <div>
              <dt>Salary</dt>
              <dd>{job.salary}</dd>
            </div>
          )}
        </dl>
      )}

      {error && <p className="error-message">{error}</p>}

      {duplicate ? (
        <button
          className="primary-button"
          type="button"
          onClick={onViewApplication}
        >
          View Application
        </button>
      ) : (
        <button className="primary-button" type="button" onClick={onTrackJob}>
          Track This Job
        </button>
      )}
    </section>
  );
}

export default JobSummary;
