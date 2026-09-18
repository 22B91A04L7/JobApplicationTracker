chrome.runtime.onMessageExternal.addListener(
    (message, sender, sendResponse) => {
        if (message.type !== "AUTHENTICATE") {
            return;
        }

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