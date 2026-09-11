chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "GET_JOB_DATA") {

        const jobData = document.body.innerText;

        sendResponse({
            jobData: jobData
        });
    }
});