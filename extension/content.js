chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_JOB_DATA") {
        const jobData = document.body.innerText;

        sendResponse({
            jobData: jobData
        });
    }

    if (message.type === "SHOW_TRACKER_PANEL") {
        createTrackerPanel();
    }
});

function createTrackerPanel() {
    if (document.getElementById("job-tracker-panel")) {
        return;
    }

    const panel = document.createElement("div");
    panel.id = "job-tracker-panel";

    panel.innerHTML = `
        <div class="job-tracker-header">
            <div>
                <div class="job-tracker-title">Job Tracker</div>
                <div class="job-tracker-subtitle">
                    Your application assistant
                </div>
            </div>

            <button id="job-tracker-close" title="Close">
                ×
            </button>
        </div>

        <div class="job-tracker-body" id="job-tracker-body">
            <div class="job-tracker-icon">✓</div>

            <h3>Track this job</h3>

            <p>
                Review and save this job application directly from this page.
            </p>

            <button id="job-tracker-start">
                Get Job Details
            </button>
        </div>
    `;

    document.body.appendChild(panel);

    const body = panel.querySelector("#job-tracker-body");
    const closeButton = panel.querySelector("#job-tracker-close");
    const startButton = panel.querySelector("#job-tracker-start");

    closeButton.addEventListener("click", () => {
        panel.remove();
    });

    startButton.addEventListener("click", async () => {
        startButton.disabled = true;
        startButton.textContent = "Extracting...";

        body.innerHTML = `
            <p>Reading the job description and extracting details...</p>
        `;

        try {
            const pageText = document.body.innerText.slice(0, 30000);

            const result = await new Promise((resolve) => {
                chrome.runtime.sendMessage(
                    {
                        type: "EXTRACT_JOB",
                        pageText: pageText
                    },
                    resolve
                );
            });

            if (!result || !result.success) {
                throw new Error(
                    result?.error || "Failed to extract job details"
                );
            }

            const job = result.data.jobData;

            body.innerHTML = `
                <h3>Job Details</h3>

                <div class="job-tracker-details">
                    <p>
                        <strong>Title:</strong>
                        ${escapeHtml(job.title ?? "Not available")}
                    </p>

                    <p>
                        <strong>Company:</strong>
                        ${escapeHtml(job.company ?? "Not available")}
                    </p>

                    <p>
                        <strong>Job ID:</strong>
                        ${escapeHtml(job.jobId ?? "Not available")}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${escapeHtml(job.location ?? "Not available")}
                    </p>

                    <p>
                        <strong>Salary:</strong>
                        ${escapeHtml(job.salary ?? "Not available")}
                    </p>

                    <p>
                        <strong>Description:</strong>
                    </p>

                    <div class="job-tracker-description">
                        ${escapeHtml(
                job.description ?? "Description not available"
            )}
                    </div>
                </div>

                <button id="job-tracker-confirm">
                    Review Application
                </button>
            `;

            panel
                .querySelector("#job-tracker-confirm")
                .addEventListener("click", () => {
                    showReviewForm(panel, body, job);
                });
        } catch (error) {
            console.error("Job extraction failed:", error);

            body.innerHTML = `
                <h3>Extraction Failed</h3>

                <p>
                    Could not extract job details. Please try again.
                </p>

                <button id="job-tracker-retry">
                    Try Again
                </button>
            `;

            panel
                .querySelector("#job-tracker-retry")
                .addEventListener("click", () => {
                    panel.remove();
                    createTrackerPanel();
                });
        }
    });
}

function showReviewForm(panel, body, job) {
    body.innerHTML = `
        <h3>Review Application</h3>

        <label for="job-title">Job Title</label>
        <input
            id="job-title"
            type="text"
            value="${escapeHtml(job.title ?? "")}"
        >

        <label for="job-company">Company</label>
        <input
            id="job-company"
            type="text"
            value="${escapeHtml(job.company ?? "")}"
        >

        <label for="job-id">Job ID</label>
        <input
            id="job-id"
            type="text"
            value="${escapeHtml(job.jobId ?? "")}"
        >

        <label for="job-location">Location</label>
        <input
            id="job-location"
            type="text"
            value="${escapeHtml(job.location ?? "")}"
        >

        <label for="job-salary">Salary</label>
        <input
            id="job-salary"
            type="text"
            value="${escapeHtml(job.salary ?? "")}"
        >

        <label for="job-description">Job Description</label>
        <textarea id="job-description" rows="6">${escapeHtml(
        job.description ?? ""
    )}</textarea>

        <button id="job-tracker-save">
            Confirm Application
        </button>
    `;

    panel
        .querySelector("#job-tracker-save")
        .addEventListener("click", () => {
            const reviewedJob = {
                title: panel.querySelector("#job-title").value.trim(),
                company: panel.querySelector("#job-company").value.trim(),
                jobId: panel.querySelector("#job-id").value.trim() || null,
                location:
                    panel.querySelector("#job-location").value.trim() || null,
                salary:
                    panel.querySelector("#job-salary").value.trim() || null,
                description:
                    panel.querySelector("#job-description").value.trim() ||
                    null
            };

            console.log("Reviewed job:", reviewedJob);

            panel.classList.add("job-tracker-minimized");

            body.innerHTML = `
                <div class="job-tracker-success">
                    <div class="job-tracker-icon">✓</div>

                    <h3>Application Confirmed</h3>

                    <p>
                        Your application details have been reviewed.
                    </p>

                    <button id="job-tracker-expand">
                        View Details
                    </button>
                </div>
            `;

            panel
                .querySelector("#job-tracker-expand")
                .addEventListener("click", () => {
                    panel.classList.remove("job-tracker-minimized");
                    showReviewForm(panel, body, reviewedJob);
                });
        });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}