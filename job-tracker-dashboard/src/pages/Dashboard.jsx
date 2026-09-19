import { useEffect, useState } from "react";
import Job from "../components/Job";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    async function fetchJobs() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/jobs", {
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
          throw new Error("Failed to fetch applications.");
        }

        const data = await response.json();
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [navigate]);

  function handleStatusChange(jobId, newStatus) {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job,
      ),
    );
  }

  if (loading) {
    return (
      <main className="app-shell dashboard-page">
        <section className="state-card" aria-live="polite">
          <div className="loading-indicator" aria-hidden="true" />
          <h2>Loading applications...</h2>
          <p>Preparing your job application workspace.</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell dashboard-page">
        <section className="state-card state-card-error" role="alert">
          <p className="eyebrow">Unable to refresh</p>
          <h2>Could not load applications</h2>
          <p>{error}</p>
        </section>
      </main>
    );
  }

  const appliedCount = jobs.filter((job) => job.status === "Applied").length;
  const interviewCount = jobs.filter(
    (job) => job.status === "Interview",
  ).length;
  const offerCount = jobs.filter(
    (job) => job.status === "Offer Received",
  ).length;

  const filteredJobs = jobs.filter((job) => {
    const searchText = searchTerm.toLowerCase();

    return (
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="app-shell dashboard-page">
      <header className="dashboard-header">
        <a className="product-name" href="/jobs" aria-label="Job Tracker home">
          <span className="product-mark" aria-hidden="true">
            JT
          </span>
          <span>Job Tracker</span>
        </a>
        <button className="logout-button" type="button" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className="career-section" aria-labelledby="career-title">
        <p className="eyebrow">Your career</p>
        <h1 id="career-title">Applications</h1>
        <div className="career-summary" aria-label="Application summary">
          <span>
            <strong>{jobs.length}</strong> applications
          </span>
          <span>
            <strong>{appliedCount}</strong> applied
          </span>
          <span>
            <strong>{interviewCount}</strong> interviews
          </span>
          <span>
            <strong>{offerCount}</strong> offers
          </span>
        </div>
      </section>

      <section
        className="applications-section"
        aria-labelledby="applications-title"
      >
        <div className="applications-toolbar">
          <div className="search-panel">
            <label className="visually-hidden" htmlFor="application-search">
              Search applications
            </label>
            <span className="search-icon" aria-hidden="true" />
            <input
              id="application-search"
              type="search"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <p className="result-count">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "application" : "applications"}
          </p>
        </div>

        <h2 className="visually-hidden" id="applications-title">
          Application list
        </h2>

        <div className="job-list">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <h3>
                {jobs.length === 0
                  ? "No applications yet"
                  : "No matching applications"}
              </h3>
              <p>
                {jobs.length === 0
                  ? "Track your first job using the Job Tracker extension."
                  : "Try a different title, company, or location."}
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <Job
                key={job._id}
                job={job}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
