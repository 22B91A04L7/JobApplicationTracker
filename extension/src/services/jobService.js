import { getAuthToken } from "../utils/auth"

export async function extractJob(pageText) {
    const token = await getAuthToken();

    const response = await fetch(
        "http://localhost:5000/api/jobs/extract",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                pageText,
            }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to extract job information.",
        );
    }

    if (!data.jobData) {
        throw new Error("Backend returned no job data.");
    }

    return data.jobData;
}

export async function saveJob(job) {
    const token = await getAuthToken();

    const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(job),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to save job.",
        );
    }

    return data;
}

