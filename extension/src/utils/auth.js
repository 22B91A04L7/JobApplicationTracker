export function getAuthToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["token"], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            if (!result.token) {
                reject(new Error("Extension is not authenticated."));
                return;
            }

            resolve(result.token);
        });
    });
}