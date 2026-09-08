const pageTitle = document.getElementById("page-title");

chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs) => {

        const activeTab = tabs[0];

        chrome.tabs.sendMessage(
            activeTab.id,
            { type: "GET_PAGE_TITLE" },
            (response) => {

                if (chrome.runtime.lastError) {
                    pageTitle.textContent =
                        "Unable to access this page.";
                    return;
                }

                pageTitle.textContent = response.title;
            }
        );
    }
);