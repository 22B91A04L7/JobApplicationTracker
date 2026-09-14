import { useState } from "react";

function Job({ job, onStatusChange }) {
  const [status, setStatus] = useState(job.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusChange(event) {
    const newStatus = event.target.value;

    setStatus(newStatus);
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/jobs/${job._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Notify App.jsx only after MongoDB is updated successfully
      onStatusChange(job._id, newStatus);
    } catch (error) {
      console.error("Status update error:", error);

      // Restore the previous status if the request fails
      setStatus(job.status);
      setError("Could not update status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{job.title}</h3>
          <p className="company">{job.company}</p>
        </div>

        <select value={status} onChange={handleStatusChange} disabled={saving}>
          <option value="Applied">Applied</option>
          <option value="Assessment">Assessment</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer Received">Offer Received</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <p>
        <strong>Location:</strong> {job.location || "Not available"}
      </p>

      <p>
        <strong>Applied on:</strong>{" "}
        {new Date(job.appliedAt).toLocaleDateString()}
      </p>

      <details>
        <summary>View job description</summary>
        <p>{job.description || "Description not available"}</p>
      </details>

      {job.url && (
        <a href={job.url} target="_blank" rel="noreferrer">
          Open original job posting
        </a>
      )}
    </article>
  );
}

export default Job;
