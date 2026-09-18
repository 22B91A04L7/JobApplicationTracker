function JobSummary({ job, onTrackJob }) {
  return (
    <section className="job-summary">
      <p className="section-kicker">Job Details</p>
      <h2>{job.title || "Title not available"}</h2>
      <p className="job-summary-company">
        {job.company || "Company not available"}
      </p>

      <div className="job-summary-meta">
        {job.location && <span>{job.location}</span>}
        {job.experience && <span>{job.experience}</span>}
        {job.salary && <span>{job.salary}</span>}
      </div>

      <button className="primary-button" type="button" onClick={onTrackJob}>
        Track This Job
      </button>
    </section>
  );
}

export default JobSummary;
