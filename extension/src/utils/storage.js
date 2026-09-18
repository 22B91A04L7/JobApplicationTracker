export function getPendingJob() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["pendingJob"], (result) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            resolve(result.pendingJob || null);
        });
    });
}

export function setPendingJob(job) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ pendingJob: job }, () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            resolve();
        });
    });
}

export function removePendingJob() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.remove(["pendingJob"], () => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }

            resolve();
        });
    });
}