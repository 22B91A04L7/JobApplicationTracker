export function JobReviewForm({ editedJob, setEditedJob, onConfirm }) {
  return (
    <section className="job-preview">
      <h2>Review Job Details</h2>

      <label>
        Job Title
        <input
          type="text"
          value={editedJob.title || ""}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              title: event.target.value,
            })
          }
        />
      </label>

      <label>
        Company
        <input
          type="text"
          value={editedJob.company || ""}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              company: event.target.value,
            })
          }
        />
      </label>

      <label>
        Location
        <input
          type="text"
          value={editedJob.location || ""}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              location: event.target.value,
            })
          }
        />
      </label>

      <label>
        Job ID
        <input
          type="text"
          value={editedJob.jobId || ""}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              jobId: event.target.value,
            })
          }
        />
      </label>

      <label>
        Salary
        <input
          type="text"
          value={editedJob.salary || ""}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              salary: event.target.value,
            })
          }
        />
      </label>

      <label>
        Job Description
        <textarea
          value={editedJob.jobDescription || ""}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              jobDescription: event.target.value,
            })
          }
          rows={8}
        />
      </label>

      <label>
        Responsibilities
        <textarea
          value={(editedJob.responsibilities || []).join("\n")}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              responsibilities: event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          rows={6}
          placeholder="One responsibility per line"
        />
      </label>

      <label>
        Required Skills
        <textarea
          value={(editedJob.requiredSkills || []).join("\n")}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              requiredSkills: event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          rows={6}
          placeholder="One skill per line"
        />
      </label>

      <label>
        Preferred Skills
        <textarea
          value={(editedJob.preferredSkills || []).join("\n")}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              preferredSkills: event.target.value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          rows={6}
          placeholder="One skill per line"
        />
      </label>

      <label>
        Experience
        <input
          type="text"
          value={editedJob.experience || ""}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              experience: event.target.value,
            })
          }
        />
      </label>

      <label>
        Education
        <input
          type="text"
          value={editedJob.education || ""}
          onChange={(event) =>
            setEditedJob({
              ...editedJob,
              education: event.target.value,
            })
          }
        />
      </label>

      <button type="button" onClick={onConfirm}>
        Confirm Job
      </button>
    </section>
  );
}

export default JobReviewForm;
