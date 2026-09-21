// Handles authentication and logout requests from the website
chrome.runtime.onMessageExternal.addListener(
    (message, sender, sendResponse) => {
        // Handle logout request
        if (message.type === "LOGOUT") {
            chrome.storage.local.remove(["token", "pendingJob"], () => {
                if (chrome.runtime.lastError) {
                    sendResponse({
                        success: false,
                        error: chrome.runtime.lastError.message,
                    });
                    return;
                }

                sendResponse({
                    success: true,
                });
            });

            return true;
        }

        // Ignore unknown message types
        if (message.type !== "AUTHENTICATE") {
            return;
        }

        // Handle authentication request
        if (!message.token) {
            sendResponse({
                success: false,
                error: "Authentication token is missing.",
            });
            return;
        }

        chrome.storage.local.set(
            { token: message.token },
            () => {
                if (chrome.runtime.lastError) {
                    sendResponse({
                        success: false,
                        error: chrome.runtime.lastError.message,
                    });
                    return;
                }

                sendResponse({
                    success: true,
                });
            },
        );

        return true;
    },
);