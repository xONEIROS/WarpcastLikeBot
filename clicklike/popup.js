
function injectTheScript() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        chrome.tabs.executeScript(tabs[0].id, {file: "content_script.js"});
    });
}

document.getElementById('clickactivity').addEventListener('click', injectTheScript);
/*
// فراخوانی تابع injectTheScript() هنگامی که تمامی محتویات صفحه بارگذاری شده باشند
document.addEventListener('DOMContentLoaded', function() {
    injectTheScript();
});



// تابع برای تزریق اسکریپت به تب فعال
function injectTheScript() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        chrome.tabs.executeScript(tabs[0].id, {file: "content_script.js"});
    });
}

// فراخوانی تابع injectTheScript() هنگام کلیک بر روی اکستنشن
document.getElementById('clickactivity').addEventListener('click', function() {
    injectTheScript();
    // غیر فعال کردن event listener بعد از اجرا یکبار
    document.getElementById('clickactivity').removeEventListener('click', this);
});
*/