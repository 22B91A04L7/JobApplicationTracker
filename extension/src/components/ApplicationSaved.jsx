function ApplicationSaved({ job, onCaptureAnother }) {
  return (
    <section className="application-saved">
      <p className="section-kicker">Application recorded</p>
      <h2>Application Saved ✓</h2>

      <p className="saved-title">
        <strong>{job.title}</strong>
      </p>

      <p className="saved-company">{job.company}</p>

      <button className="primary-button" type="button" onClick={onCaptureAnother}>
        Capture Another Job
      </button>
    </section>
  );
}

export default ApplicationSaved;
