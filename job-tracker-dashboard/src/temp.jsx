import { useEffect, useState } from "react";
import Job from "./components/Job";
import JobDetails from "./components/JobDetails";

function App() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

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

  //to handle status of job application
  function handleStatusChange(jobId, newStatus) {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job._id === jobId ? { ...job, status: newStatus } : job,
      ),
    );
  }
  //function to view job details
  function handleViewDetails(job) {
    setSelectedJob(job);
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

  return <main></main>;
}

export default App;
