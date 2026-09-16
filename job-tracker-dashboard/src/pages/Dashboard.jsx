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
          <div className="loading-indicator" />
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
        <div>
          <p className="eyebrow">YOUR CAREER WORKSPACE</p>
          <h1>Job Application Tracker</h1>
          <p className="subtitle">
            Keep track of your applications, monitor progress, and stay
            organized.
          </p>
        </div>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="overview-section" aria-labelledby="overview-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Snapshot</p>
            <h2 id="overview-title">Overview</h2>
          </div>
        </div>

        <div className="overview-grid">
          <div className="summary-card">
            <p>Total Applications</p>
            <strong>{jobs.length}</strong>
            <span>Saved opportunities</span>
          </div>

          <div className="summary-card">
            <p>Applied</p>
            <strong>{appliedCount}</strong>
            <span>Currently marked applied</span>
          </div>
        </div>
      </section>

      <section
        className="applications-section"
        aria-labelledby="applications-title"
      >
        <div className="section-heading applications-heading">
          <div>
            <p className="eyebrow">Applications</p>
            <h2 id="applications-title">My Applications</h2>
          </div>
          <p className="section-description">
            Search by role, company, or location, then update progress from each
            card.
          </p>
        </div>

        <div className="search-panel">
          <label htmlFor="application-search">Search applications</label>
          <input
            id="application-search"
            type="text"
            placeholder="Search by title, company, or location..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="job-list">
          {filteredJobs.length === 0 ? (
            <div className="empty-state">
              <h3>No matching applications found.</h3>
              <p>
                Try a different job title, company name, or location to find an
                application.
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
