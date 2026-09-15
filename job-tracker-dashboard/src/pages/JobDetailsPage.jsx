import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function JobDetailsPage() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${id}`);

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
  }, [id]);

  if (loading) {
    return <main>Loading job details...</main>;
  }

  if (error) {
    return (
      <main>
        <h2>Could not load job details</h2>
        <p>{error}</p>
        <Link to="/jobs">Back to Applications</Link>
      </main>
    );
  }

  if (!job) {
    return (
      <main>
        <h2>Job not found</h2>
        <Link to="/jobs">Back to Applications</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/jobs">← Back to Applications</Link>

      <h1>{job.title}</h1>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <p>
        <strong>Location:</strong> {job.location || "Not available"}
      </p>

      <p>
        <strong>Job ID:</strong> {job.jobId || "Not available"}
      </p>

      <p>
        <strong>Salary:</strong> {job.salary || "Not available"}
      </p>

      <p>
        <strong>Experience:</strong> {job.experience || "Not available"}
      </p>

      <p>
        <strong>Education:</strong> {job.education || "Not available"}
      </p>

      <p>
        <strong>Source:</strong> {job.source || "Not available"}
      </p>

      <h2>Application Timeline</h2>

      {job.timeline && job.timeline.length > 0 ? (
        <ul>
          {job.timeline.map((event, index) => (
            <li key={`${event.timestamp}-${index}`}>
              <strong>{event.status}</strong>
              {" — "}
              {new Date(event.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No timeline events available.</p>
      )}

      <h2>Job Description</h2>

      <p>
        {job.jobDescription || job.description || "Description not available"}
      </p>

      <h2>Responsibilities</h2>

      {job.responsibilities && job.responsibilities.length > 0 ? (
        <ul>
          {job.responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      ) : (
        <p>Responsibilities not available.</p>
      )}

      <h2>Required Skills</h2>

      {job.requiredSkills && job.requiredSkills.length > 0 ? (
        <ul>
          {job.requiredSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p>Required skills not available.</p>
      )}

      <h2>Preferred Skills</h2>

      {job.preferredSkills && job.preferredSkills.length > 0 ? (
        <ul>
          {job.preferredSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p>Preferred skills not available.</p>
      )}

      {job.url && (
        <p>
          <a href={job.url} target="_blank" rel="noreferrer">
            Open Original Job Posting
          </a>
        </p>
      )}
    </main>
  );
}

export default JobDetailsPage;
