// تابع برای تزریق اسکریپت به تب فعال
function injectTheScript(tab) {
    if (tab && tab.url && !tab.url.startsWith("chrome://")) {
        chrome.tabs.executeScript(tab.id, {file: "content_script.js"});
    }
}

// فراخوانی تابع injectTheScript() هنگامی که تب فعال تغییر کند
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith("chrome://")) {
        setTimeout(function() {
            injectTheScript(tab);
        }, 4000);
    }
});
