import { useState, useEffect } from "react";
import { getActiveTab } from "./utils/chrome";
import "./App.css";
import { extractJob, saveJob, checkJobDuplicate } from "./services/jobService";
import { getAuthToken } from "./utils/auth";
import PendingJob from "./components/PendingJob";
import ExtensionHeader from "./components/ExtensionHeader";
import ApplicationSaved from "./components/ApplicationSaved";
import JobExtractor from "./components/JobExtractor";
import JobSummary from "./components/JobSummary";
import {
  getPendingJob,
  setPendingJob as savePendingJob,
  removePendingJob,
} from "./utils/storage";
import { DASHBOARD_URL } from "./config";

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
  const [pendingJob, setPendingJob] = useState(null);
  const [savedJob, setSavedJob] = useState(null);
  const [step, setStep] = useState("initial");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [duplicateJobId, setDuplicateJobId] = useState(null);

  useEffect(() => {
    async function initializeExtension() {
      try {
        await getAuthToken();
        setIsAuthenticated(true);

        const job = await getPendingJob();

        if (job) {
          setPendingJob(job);
          setStep("pending");
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    }

    initializeExtension();
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
      setStep("extracted");
    } catch (error) {
      console.error("Could not get job details:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // AI-extracted data is tracked as-is, no edit step.
  async function handleTrackJob() {
    if (!jobData.title || !jobData.company || !jobData.url || !jobData.source) {
      await chrome.storage.local.set({
        manualEntryJob: jobData,
      });

      setError(
        "Could not identify enough information to track this opportunity.",
      );
      return;
    }
    try {
      const duplicateResult = await checkJobDuplicate(jobData.url);

      if (duplicateResult.exists) {
        setDuplicateJobId(duplicateResult.jobId);
        setError("This job application is already in your tracker.");
        return;
      }
      setDuplicateJobId(null);
      await savePendingJob(jobData);

      setPendingJob(jobData);
      setStep("pending");
      setJobData(null);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  //handkles manual entry of job details when AI extraction fails
  function handleCompleteDetailsManually() {
    chrome.tabs.create({
      url: `${DASHBOARD_URL}/jobs/manual-entry`,
    });
  }
  //to view duplicate job and stops tracking again
  function handleViewDuplicateJob() {
    if (!duplicateJobId) {
      return;
    }

    chrome.tabs.create({
      url: `${DASHBOARD_URL}/jobs/${duplicateJobId}`,
    });
  }

  function handleNotYet() {
    // pendingJob stays in chrome.storage.local untouched.
    // Closing the popup is enough; reopening reads it back via getPendingJob().
    try {
      window.close();
    } catch (error) {
      console.error("Could not close popup:", error);
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

  async function handleDiscard() {
    try {
      await removePendingJob();
      setPendingJob(null);
      setStep("initial");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="extension-app">
        <ExtensionHeader />

        <section className="extension-body" aria-live="polite">
          <section className="state-panel">
            <p className="section-kicker">Account connection</p>
            <h2>Connect your account</h2>
            <p>
              Sign in to your Job Tracker dashboard to connect this extension
              and start tracking applications.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={() => {
                chrome.tabs.create({
                  url: DASHBOARD_URL,
                });
              }}
            >
              Connect Account
            </button>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="extension-app">
      {/* header component */}
      <ExtensionHeader />

      <section
        className={`extension-body extension-step-${step}`}
        aria-live="polite"
      >
        {step === "initial" && (
          <JobExtractor
            loading={loading}
            error={error}
            onGetJobDetails={handleGetJobDetails}
          />
        )}

        {step === "extracted" && jobData && (
          <JobSummary
            job={jobData}
            error={error}
            duplicate={Boolean(duplicateJobId)}
            onTrackJob={handleTrackJob}
            onViewApplication={handleViewDuplicateJob}
            onCompleteDetailsManually={handleCompleteDetailsManually}
          />
        )}

        {step === "pending" && pendingJob && (
          <PendingJob
            job={pendingJob}
            onApplied={handleApplied}
            onNotYet={handleNotYet}
            onDiscard={handleDiscard}
            saving={false}
          />
        )}

        {step === "saved" && savedJob && (
          <ApplicationSaved
            job={savedJob}
            onCaptureAnother={() => {
              setSavedJob(null);
              setDuplicateJobId(null);
              setStep("initial");
            }}
          />
        )}
      </section>
    </main>
  );
}

export default App;
