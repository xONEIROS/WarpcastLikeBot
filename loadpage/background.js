chrome.browserAction.onClicked.addListener(function(tab) 
{
	chrome.tabs.getSelected(null,function(tab) 
	{
		chrome.tabs.create({url: "app.html"}, function (tab) {});
	});
});

function onInstall() 
{
	chrome.tabs.create({url: "app.html"}, function (tab) {});
	chrome.storage.sync.set({ 'links': "" }, function(){ });
	chrome.storage.sync.set({ 'focus': true }, function(){ });
	chrome.storage.sync.set({ 'remdups': true }, function(){ });

}

function onUpdate() {	}

function getVersion() 
{
	var details = chrome.app.getDetails();
	return details.version;
}

// Check if the version has changed.
var currVersion = getVersion();
var prevVersion = localStorage['version'];

if (currVersion != prevVersion) 
{
	// Check if we just installed this extension.
	if (typeof prevVersion == 'undefined')
	{
		onInstall();
	} 
	else 
	{
		onUpdate();
	}
	localStorage['version'] = currVersion;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
    if (request.method == "open")
    {

		var worker = new Worker('worker.js');
		var link = request.link;
		var focus = request.focus;

		console.log(link);
		chrome.tabs.create({url: link, active: focus});
    }

    if (request.method == "get-all-tabs")
    {
	  var links = [];
	  chrome.tabs.query( {} ,function (tabs) { // The Query {} was missing here
	    for (var i = 0; i < tabs.length; i++) {
	      links.push(tabs[i].url);
	      console.log(tabs[i].url);
	    } 
	    sendResponse({link: links});
	  });
    }
    
    return true;
});
