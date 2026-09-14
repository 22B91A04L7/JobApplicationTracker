chrome.action.onClicked.addListener((tab) => {
    if (!tab.id) {
        return;
    }

    chrome.tabs.sendMessage(tab.id, {
        type: "SHOW_TRACKER_PANEL"
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== "EXTRACT_JOB") {
        return;
    }

    fetch("http://localhost:5000/api/jobs/extract", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pageText: message.pageText
        })
    })
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Backend extraction failed"
                );
            }

            sendResponse({
                success: true,
                data: data
            });
        })
        .catch((error) => {
            console.error("Background extraction failed:", error);

            sendResponse({
                success: false,
                error: error.message
            });
        });

    return true;
});