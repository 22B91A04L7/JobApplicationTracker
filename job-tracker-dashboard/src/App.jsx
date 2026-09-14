import { useEffect, useState } from "react";
import Job from "./components/Job";

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs");

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
  }, []);

  function handleStatusChange(jobId, newStatus) {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job,
      ),
    );
  }

  if (loading) {
    return <h2>Loading applications...</h2>;
  }

  if (error) {
    return (
      <main>
        <h2>Could not load applications</h2>
        <p>{error}</p>
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
    <main>
      <header>
        <h1>Job Application Tracker</h1>
        <p>Keep track of your job applications in one place.</p>
      </header>

      <section>
        <h2>Overview</h2>

        <div>
          <p>Total Applications</p>
          <strong>{jobs.length}</strong>
        </div>

        <div>
          <p>Applied</p>
          <strong>{appliedCount}</strong>
        </div>
      </section>

      <section>
        <h2>My Applications</h2>

        <input
          type="text"
          placeholder="Search by title, company, or location..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {filteredJobs.length === 0 ? (
          <p>No matching applications found.</p>
        ) : (
          filteredJobs.map((job) => (
            <Job key={job._id} job={job} onStatusChange={handleStatusChange} />
          ))
        )}
      </section>
    </main>
  );
}

export default App;
