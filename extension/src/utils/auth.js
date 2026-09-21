//to get auth token
export function getAuthToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["token"], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            if (!result.token) {
                reject(new Error("Connect your Job Tracker account to continue."));
                return;
            }

            resolve(result.token);
        });
    });
}

//To clear auth token from chrome storage
export function clearAuthToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(["token"], () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            resolve();
        });
    });
}