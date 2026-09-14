const statusMessage = document.getElementById("status");
const jobForm = document.getElementById("job-form");

const titleInput = document.getElementById("title");
const companyInput = document.getElementById("company");
const jobIdInput = document.getElementById("jobId");
const locationInput = document.getElementById("location");
const salaryInput = document.getElementById("salary");
const descriptionInput = document.getElementById("description");
const confirmButton = document.getElementById("confirm-job");

const pendingJobSection = document.getElementById("pending-job");
const pendingTitle = document.getElementById("pending-title");
const pendingCompany = document.getElementById("pending-company");
const pendingLocation = document.getElementById("pending-location");
const pendingSalary = document.getElementById("pending-salary");

const appliedButton = document.getElementById("applied-button");
const discardButton = document.getElementById("discard-button");

const successMessage = document.getElementById("success-message");
const successTitle = document.getElementById("success-title");
const successCompany = document.getElementById("success-company");
const captureAgainButton = document.getElementById("capture-again-button");

function getActiveTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true
            },
            (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(
                        new Error(chrome.runtime.lastError.message)
                    );
                    return;
                }

                const tab = tabs[0];

                if (!tab || !tab.id) {
                    reject(
                        new Error("Could not find the active job tab.")
                    );
                    return;
                }

                resolve(tab);
            }
        );
    });
}

function getSourceFromUrl(url) {
    try {
        return new URL(url).hostname;
    } catch (error) {
        return "Unknown";
    }
}

function resizeExtensionWindow(width, height) {
    chrome.windows.getCurrent((currentWindow) => {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }

        chrome.windows.update(currentWindow.id, {
            width,
            height
        });
    });
}

function showError(message) {
    statusMessage.hidden = false;
    statusMessage.textContent = message;
}

function showPendingJob(job) {
    pendingTitle.textContent = job.title || "Title not available";
    pendingCompany.textContent =
        job.company || "Company not available";
    pendingLocation.textContent =
        job.location || "Location not available";
    pendingSalary.textContent =
        job.salary || "Salary not available";

    statusMessage.hidden = true;
    jobForm.hidden = true;
    successMessage.hidden = true;
    pendingJobSection.hidden = false;

    resizeExtensionWindow(360, 230);
}

function showJobForm(job) {
    titleInput.value = job.title || "";
    companyInput.value = job.company || "";
    jobIdInput.value = job.jobId || "";
    locationInput.value = job.location || "";
    salaryInput.value = job.salary || "";
    descriptionInput.value = job.description || "";

    statusMessage.hidden = true;
    pendingJobSection.hidden = true;
    successMessage.hidden = true;
    jobForm.hidden = false;

    resizeExtensionWindow(400, 600);
}

async function extractJobFromActiveTab() {
    try {
        const activeTab = await getActiveTab();

        const results = await chrome.scripting.executeScript({
            target: {
                tabId: activeTab.id
            },
            func: () => document.body.innerText
        });

        if (!results || !results[0] || !results[0].result) {
            throw new Error("Could not read the job page.");
        }

        const pageText = results[0].result.slice(0, 30000);

        console.log("Page text captured:", pageText);

        const response = await fetch(
            "http://localhost:5000/api/jobs/extract",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pageText
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Failed to extract job information."
            );
        }

        if (!data.jobData) {
            throw new Error("Backend returned no job data.");
        }

        showJobForm(data.jobData);
    } catch (error) {
        console.error("Error extracting job data:", error);
        showError(error.message || "Failed to extract job information.");
    }
}

async function initializePopup() {
    chrome.storage.local.get("pendingJob", async (result) => {
        if (chrome.runtime.lastError) {
            showError(chrome.runtime.lastError.message);
            return;
        }

        if (result.pendingJob) {
            showPendingJob(result.pendingJob);
            return;
        }

        console.log("No pending job found.");
        await extractJobFromActiveTab();
    });
}

confirmButton.addEventListener("click", async () => {
    try {
        const activeTab = await getActiveTab();

        const currentUrl = activeTab.url || "";
        const source = getSourceFromUrl(currentUrl);

        const job = {
            title: titleInput.value.trim(),
            company: companyInput.value.trim(),
            jobId: jobIdInput.value.trim() || null,
            location: locationInput.value.trim() || null,
            salary: salaryInput.value.trim() || null,
            description: descriptionInput.value.trim() || null,
            url: currentUrl,
            source
        };

        if (!job.title || !job.company) {
            showError("Job title and company are required.");
            return;
        }

        chrome.storage.local.set(
            {
                pendingJob: job
            },
            () => {
                if (chrome.runtime.lastError) {
                    showError(chrome.runtime.lastError.message);
                    return;
                }

                console.log("Pending job saved:", job);
                showPendingJob(job);
            }
        );
    } catch (error) {
        console.error("Could not confirm job:", error);
        showError(error.message);
    }
});

discardButton.addEventListener("click", () => {
    chrome.storage.local.remove("pendingJob", () => {
        if (chrome.runtime.lastError) {
            showError(chrome.runtime.lastError.message);
            return;
        }

        console.log("Pending job discarded.");
        window.close();
    });
});

appliedButton.addEventListener("click", () => {
    chrome.storage.local.get("pendingJob", async (result) => {
        if (chrome.runtime.lastError) {
            showError(chrome.runtime.lastError.message);
            return;
        }

        if (!result.pendingJob) {
            showError("No pending job found.");
            return;
        }

        const job = result.pendingJob;

        appliedButton.disabled = true;
        discardButton.disabled = true;
        appliedButton.textContent = "Saving...";

        try {
            const response = await fetch(
                "http://localhost:5000/api/jobs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(job)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Failed to save application."
                );
            }

            console.log(
                "Application saved to MongoDB:",
                data.job
            );

            chrome.storage.local.remove("pendingJob", () => {
                if (chrome.runtime.lastError) {
                    showError(chrome.runtime.lastError.message);
                    return;
                }

                pendingJobSection.hidden = true;
                jobForm.hidden = true;
                statusMessage.hidden = true;

                successTitle.textContent = `Title: ${job.title}`;
                successCompany.textContent = `Company: ${job.company}`;

                successMessage.hidden = false;

                appliedButton.textContent = "Yes, I Applied";
                appliedButton.disabled = false;
                discardButton.disabled = false;

                resizeExtensionWindow(360, 260);
            });
        } catch (error) {
            console.error("Error saving application:", error);

            showError(
                error.message ||
                "Failed to save application. Please try again."
            );

            appliedButton.textContent = "Yes, I Applied";
            appliedButton.disabled = false;
            discardButton.disabled = false;
        }
    });
});

captureAgainButton.addEventListener("click", () => {
    successMessage.hidden = true;
    statusMessage.hidden = false;
    statusMessage.textContent = "Getting job details...";

    window.location.reload();
});

initializePopup();