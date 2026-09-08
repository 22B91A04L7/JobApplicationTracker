chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_PAGE_TITLE") {
        sendResponse({
            title: document.title
        });
    }
});