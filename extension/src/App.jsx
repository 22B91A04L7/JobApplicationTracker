import { useState, useEffect } from "react";
import { getActiveTab } from "./utils/chrome";
import "./App.css";
import { extractJob, saveJob } from "./services/jobService";
import { JobReviewForm } from "./components/JobReviewForm";
import PendingJob from "./components/PendingJob";
import ExtensionHeader from "./components/ExtensionHeader";
import ApplicationSaved from "./components/ApplicationSaved";
import JobExtractor from "./components/JobExtractor";
import {
  getPendingJob,
  setPendingJob as savePendingJob,
  removePendingJob,
} from "./utils/storage";

function getSourceFromUrl(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "Unknown";
  }
}

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobData, setJobData] = useState(null);
  const [editedJob, setEditedJob] = useState(null);
  const [pendingJob, setPendingJob] = useState(null);
  const [savedJob, setSavedJob] = useState(null);
  const [step, setStep] = useState("initial");

  useEffect(() => {
    async function loadPendingJob() {
      try {
        const job = await getPendingJob();

        if (job) {
          setPendingJob(job);
          setStep("pending");
        }
      } catch (error) {
        setError(error.message);
      }
    }

    loadPendingJob();
  }, []);

  //handles raw text extraction from web page
  async function handleGetJobDetails() {
    setLoading(true);
    setError("");

    try {
      const activeTab = await getActiveTab();

      const results = await chrome.scripting.executeScript({
        target: {
          tabId: activeTab.id,
        },
        func: () => document.body.innerText,
      });

      if (!results || !results[0] || !results[0].result) {
        throw new Error("Could not read the job page.");
      }

      const pageText = results[0].result.slice(0, 30000);

      const extractedJob = await extractJob(pageText);
      const jobWithSource = {
        ...extractedJob,
        url: activeTab.url || "",
        source: getSourceFromUrl(activeTab.url || ""),
      };

      setJobData(jobWithSource);
      setEditedJob(jobWithSource);
      setStep("review");
    } catch (error) {
      console.error("Could not get job details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmJob() {
    try {
      await savePendingJob(editedJob);

      setPendingJob(editedJob);
      setStep("pending");
      setJobData(null);
      setEditedJob(null);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleApplied() {
    try {
      const savedJobResponse = await saveJob(pendingJob);

      await removePendingJob();

      setPendingJob(null);
      setSavedJob(savedJobResponse.job);
      setStep("saved");
    } catch (error) {
      console.error("Could not save job:", error);
      setError(error.message);
    }
  }
  return (
    <main className="extension-app">
      {/* header component */}
      <ExtensionHeader />

      <section className="extension-body">
        {step === "initial" && (
          <JobExtractor
            loading={loading}
            error={error}
            onGetJobDetails={handleGetJobDetails}
          />
        )}

        {jobData && editedJob && (
          <JobReviewForm
            editedJob={editedJob}
            setEditedJob={setEditedJob}
            onConfirm={handleConfirmJob}
          />
        )}

        {step === "pending" && pendingJob && (
          <PendingJob
            job={pendingJob}
            onApplied={handleApplied}
            onDiscard={async () => {
              try {
                await removePendingJob();
                setPendingJob(null);
                setStep("initial");
              } catch (error) {
                setError(error.message);
              }
            }}
            saving={false}
          />
        )}

        {step === "saved" && savedJob && (
          <ApplicationSaved
            job={savedJob}
            onCaptureAnother={() => {
              setSavedJob(null);
              setStep("initial");
            }}
          />
        )}
      </section>
    </main>
  );
}

export default App;
