export function getActiveTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true,
            },
            (tabs) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                const tab = tabs[0];

                if (!tab || !tab.id) {
                    reject(new Error("Could not find the active job tab."));
                    return;
                }

                resolve(tab);
            },
        );
    });
}