import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

function JobDetailsPage() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchJob() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Failed to fetch job details.");
        }

        const data = await response.json();
        setJob(data.job || data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id, navigate]);

  if (loading) {
    return (
      <main className="app-shell details-page">
        <section className="state-card" aria-live="polite">
          <div className="loading-indicator" />
          <h2>Loading job details...</h2>
          <p>Fetching the full application record.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell details-page">
        <section className="state-card state-card-error" role="alert">
          <p className="eyebrow">Details unavailable</p>
          <h2>Could not load job details</h2>
          <p>{error}</p>
          <Link className="back-link" to="/jobs">
            Back to Applications
          </Link>
        </section>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="app-shell details-page">
        <section className="state-card">
          <p className="eyebrow">Not found</p>
          <h2>Job not found</h2>
          <Link className="back-link" to="/jobs">
            Back to Applications
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell details-page">
      <Link className="back-link" to="/jobs">
        ← Back to Applications
      </Link>

      <header className="details-hero">
        <div>
          <p className="eyebrow">Application details</p>
          <h1>{job.title}</h1>
          <p className="subtitle">{job.company}</p>
        </div>

        {job.url && (
          <a
            className="primary-link"
            href={job.url}
            target="_blank"
            rel="noreferrer"
          >
            Open Original Job Posting
          </a>
        )}
      </header>

      <section className="details-card" aria-labelledby="summary-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Summary</p>
            <h2 id="summary-title">Job Information</h2>
          </div>
        </div>

        <div className="details-grid">
          <p>
            <span>Company</span>
            <strong>{job.company}</strong>
          </p>

          <p>
            <span>Location</span>
            <strong>{job.location || "Not available"}</strong>
          </p>

          <p>
            <span>Job ID</span>
            <strong>{job.jobId || "Not available"}</strong>
          </p>

          <p>
            <span>Salary</span>
            <strong>{job.salary || "Not available"}</strong>
          </p>

          <p>
            <span>Experience</span>
            <strong>{job.experience || "Not available"}</strong>
          </p>

          <p>
            <span>Education</span>
            <strong>{job.education || "Not available"}</strong>
          </p>

          <p>
            <span>Source</span>
            <strong>{job.source || "Not available"}</strong>
          </p>
        </div>
      </section>

      <section className="details-card" aria-labelledby="timeline-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Progress</p>
            <h2 id="timeline-title">Application Timeline</h2>
          </div>
        </div>

        {job.timeline && job.timeline.length > 0 ? (
          <ul className="timeline-list">
            {job.timeline.map((event, index) => (
              <li key={`${event.timestamp}-${index}`}>
                <strong>{event.status}</strong>
                <span>{new Date(event.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-text">No timeline events available.</p>
        )}
      </section>

      <section
        className="details-card content-card"
        aria-labelledby="description-title"
      >
        <h2 id="description-title">Job Description</h2>

        <p>
          {job.jobDescription || job.description || "Description not available"}
        </p>
      </section>

      <section
        className="details-card content-card"
        aria-labelledby="responsibilities-title"
      >
        <h2 id="responsibilities-title">Responsibilities</h2>

        {job.responsibilities && job.responsibilities.length > 0 ? (
          <ul>
            {job.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        ) : (
          <p className="muted-text">Responsibilities not available.</p>
        )}
      </section>

      <section
        className="details-card content-card"
        aria-labelledby="required-skills-title"
      >
        <h2 id="required-skills-title">Required Skills</h2>

        {job.requiredSkills && job.requiredSkills.length > 0 ? (
          <ul className="skill-list">
            {job.requiredSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="muted-text">Required skills not available.</p>
        )}
      </section>

      <section
        className="details-card content-card"
        aria-labelledby="preferred-skills-title"
      >
        <h2 id="preferred-skills-title">Preferred Skills</h2>

        {job.preferredSkills && job.preferredSkills.length > 0 ? (
          <ul className="skill-list">
            {job.preferredSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        ) : (
          <p className="muted-text">Preferred skills not available.</p>
        )}
      </section>
    </main>
  );
}

export default JobDetailsPage;
