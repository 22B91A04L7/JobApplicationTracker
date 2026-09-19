import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Job({
  job,
  onStatusChange,
  selectionMode,
  selected,
  onToggleSelection,
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(job.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusChange(event) {
    const newStatus = event.target.value;

    setStatus(newStatus);
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/jobs/${job._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      onStatusChange(job._id, newStatus);
    } catch (error) {
      console.error("Status update error:", error);
      setStatus(job.status);
      setError("Could not update status");
    } finally {
      setSaving(false);
    }
  }

  function openDetails() {
    navigate(`/jobs/${job._id}`);
  }

  function handleRowKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetails();
    }
  }

  const appliedDate = new Date(job.appliedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article
      className={`job-row${selectionMode ? " job-row-selection-mode" : ""}`}
      role="link"
      tabIndex="0"
      aria-label={`View ${job.title} at ${job.company}`}
      onClick={selectionMode ? undefined : openDetails}
      onKeyDown={selectionMode ? undefined : handleRowKeyDown}
    >
      {/* checkbox logic to select jobs */}
      {selectionMode && (
        <div
          className="job-selection"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelection(job._id)}
            aria-label={`Select ${job.title} at ${job.company}`}
          />
        </div>
      )}

      <div className="job-identity">
        <h3>{job.title}</h3>
        <p>{job.company}</p>
      </div>

      <div className="job-meta">
        <span>{job.location || "Location not available"}</span>
        <span className="applied-date">{appliedDate}</span>
      </div>

      <div
        className="job-row-actions"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {job.url && (
          <a
            className="posting-link"
            href={job.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open original posting for ${job.title}`}
          >
            Job Post URL
          </a>
        )}

        <div className="status-control">
          <label className="visually-hidden" htmlFor={`status-${job._id}`}>
            Status for {job.title}
          </label>
          <select
            id={`status-${job._id}`}
            className={`status-select status-${status.toLowerCase().replaceAll(" ", "-")}`}
            value={status}
            onChange={handleStatusChange}
            disabled={saving}
            aria-busy={saving}
          >
            <option value="Applied">Applied</option>
            <option value="Assessment">Assessment</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer Received">Offer Received</option>
          </select>
        </div>

        <span className="row-chevron" aria-hidden="true">
          ›
        </span>
      </div>

      {error && (
        <p className="row-error" role="alert">
          {error}
        </p>
      )}
    </article>
  );
}

export default Job;
