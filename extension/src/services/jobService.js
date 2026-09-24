import { getAuthToken, clearAuthToken } from "../utils/auth"

export async function extractJob(pageText) {
    const token = await getAuthToken();

    const response = await fetch(
        "https://atrackie-backend.onrender.com/api/jobs/extract",
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

    if (response.status === 401) {
        await clearAuthToken();
        throw new Error("Your session has expired. Please reconnect your account.");
    }

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

export async function checkJobDuplicate(url) {
    const token = await getAuthToken();

    const response = await fetch(
        "https://atrackie-backend.onrender.com/api/jobs/check-duplicate",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                url,
            }),
        },
    );

    const data = await response.json();

    if (response.status === 401) {
        await clearAuthToken();
        throw new Error(
            "Your session has expired. Please reconnect your account.",
        );
    }

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to check duplicate job.",
        );
    }

    return {
        exists: data.exists,
        jobId: data.jobId,
    };
}

export async function saveJob(job) {
    const token = await getAuthToken();

    const response = await fetch(
        "https://atrackie-backend.onrender.com/api/jobs",
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

    //handles session management
    if (response.status === 401) {
        await clearAuthToken();
        throw new Error("Your session has expired. Please reconnect your account.");
    }

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to save job.",
        );
    }

    return data;
}

