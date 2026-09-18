function ApplicationSaved({ job, onCaptureAnother }) {
  return (
    <section className="application-saved">
      <h2>Application Saved ✓</h2>

      <p>
        <strong>{job.title}</strong>
      </p>

      <p>{job.company}</p>

      <button type="button" onClick={onCaptureAnother}>
        Capture Another Job
      </button>
    </section>
  );
}

export default ApplicationSaved;
