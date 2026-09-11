const statusMessage = document.getElementById("status");
const jobForm = document.getElementById("job-form");

const titleInput = document.getElementById("title");
const companyInput = document.getElementById("company");
const jobIdInput = document.getElementById("jobId");
const locationInput = document.getElementById("location");
const salaryInput = document.getElementById("salary");
const descriptionInput = document.getElementById("description");
const confirmButton = document.getElementById("confirm-job");

const pendingJob = document.getElementById("pending-job");

const pendingTitle = document.getElementById("pending-title");
const pendingCompany = document.getElementById("pending-company");
const pendingLocation = document.getElementById("pending-location");
const pendingSalary = document.getElementById("pending-salary");

const appliedButton = document.getElementById("applied-button");
const discardButton = document.getElementById("discard-button");


function getSourceFromUrl(url) {
    return new URL(url).hostname;
}

chrome.storage.local.get("pendingJob", (result) => {

    if (result.pendingJob) {

        const job = result.pendingJob;

        pendingTitle.textContent = job.title;
        pendingCompany.textContent = job.company;
        pendingLocation.textContent = job.location ?? "Location not available";
        pendingSalary.textContent = job.salary ?? "Salary not available";

        statusMessage.hidden = true;
        pendingJob.hidden = false;

    } else {

        console.log("No pending job found.");

        chrome.tabs.query(
            { active: true, currentWindow: true },
            (tabs) => {

                const activeTab = tabs[0];

                chrome.scripting.executeScript(
                    {
                        target: { tabId: activeTab.id },
                        func: () => document.body.innerText
                    },

                    (results) => {

                        if (chrome.runtime.lastError) {
                            console.error(
                                chrome.runtime.lastError.message
                            );

                            statusMessage.textContent =
                                chrome.runtime.lastError.message;

                            return;
                        }

                        const pageText = results[0].result.slice(0, 30000);

                        console.log("Page text captured:", pageText);

                        fetch("http://localhost:5000/api/jobs/extract", {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                pageText: pageText
                            })
                        })

                            .then(response => response.json())

                            .then(data => {

                                const job = data.jobData;

                                titleInput.value = job.title ?? "";
                                companyInput.value = job.company ?? "";
                                jobIdInput.value = job.jobId ?? "";
                                locationInput.value = job.location ?? "";
                                salaryInput.value = job.salary ?? "";
                                descriptionInput.value = job.description ?? "";

                                statusMessage.hidden = true;
                                jobForm.hidden = false;
                            })

                            .catch(error => {

                                console.error(
                                    "Error extracting job data:",
                                    error
                                );

                                statusMessage.textContent =
                                    "Failed to extract job information.";
                            });
                    }
                );
            }
        );


    }

});



// Confirm button
confirmButton.addEventListener("click", () => {

    chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => {

            const activeTab = tabs[0];

            const currentUrl = activeTab.url;
            const source = getSourceFromUrl(currentUrl);

            const job = {
                title: titleInput.value,
                company: companyInput.value,
                jobId: jobIdInput.value || null,
                location: locationInput.value || null,
                salary: salaryInput.value || null,
                description: descriptionInput.value || null,
                url: currentUrl,
                source: source
            };

            chrome.storage.local.set(
                { pendingJob: job },
                () => {

                    if (chrome.runtime.lastError) {
                        console.error(
                            chrome.runtime.lastError.message
                        );
                        return;
                    }

                    console.log("Pending job saved:", job);

                    confirmButton.textContent =
                        "Job Confirmed ✓";

                    confirmButton.disabled = true;
                }
            );

        }
    );
});

// Discard Button
discardButton.addEventListener("click", () => {

    chrome.storage.local.remove("pendingJob", () => {

        if (chrome.runtime.lastError) {
            console.error(
                chrome.runtime.lastError.message
            );
            return;
        }

        console.log("Pending job discarded.");

        pendingJob.hidden = true;
        statusMessage.hidden = false;
        statusMessage.textContent = "Pending job discarded.";

    });

});

//save button after applied 
appliedButton.addEventListener("click", () => {

    chrome.storage.local.get("pendingJob", (result) => {

        if (!result.pendingJob) {
            console.error("No pending job found.");
            return;
        }

        const job = result.pendingJob;

        const appliedAt = new Date().toISOString();

        const application = {
            ...job,

            status: "Applied",
            appliedAt: appliedAt,

            timeline: [
                {
                    status: "Applied",
                    timestamp: appliedAt
                }
            ]
        };

        chrome.storage.local.set(
            { pendingJob: application },
            () => {

                if (chrome.runtime.lastError) {
                    console.error(
                        chrome.runtime.lastError.message
                    );
                    return;
                }

                console.log(
                    "Application marked as applied:",
                    application
                );

                appliedButton.textContent =
                    "Application Saved ✓";

                appliedButton.disabled = true;
                discardButton.disabled = true;
            }
        );

    });

});