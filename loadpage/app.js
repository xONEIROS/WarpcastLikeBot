function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var delay = getRandomInteger(14, 16);
var index = 0;
var total = 0;
let tab_id = 0;


$('#range-value').text($('#range').val());

$('#range').on("change mousemove", function() {
    delay = $(this).val();
    $('#range-value').text(delay);
});

var open_btn = document.getElementById('open');
var save_btn = document.getElementById('save');
var get_tabs = document.getElementById('get-all-tabs');
var focus_opt = document.getElementById('focus');
var remdups_opt = document.getElementById('remdups');

var lines;

var focus = true;
var remdups = true;

focus_opt.addEventListener('change', (event) => {
  if (event.target.checked) {
  	focus = true;
    console.log('checked')
  } else {
  	focus = false;
    console.log('not checked')
  }

  chrome.storage.sync.set({ 'focus': focus }, function(){ });
});

remdups_opt.addEventListener('change', (event) => {
  if (event.target.checked) {
  	remdups = true;
    console.log('checked')
  } else {
  	remdups = false;
    console.log('not checked')
  }

  chrome.storage.sync.set({ 'remdups': remdups }, function(){ });

});


window.onload = function(e){
	chrome.storage.sync.get("links", function(e)
	{
		var links = e.links;
		$('textarea').val(links)
	});

	chrome.storage.sync.get("focus", function(e)
	{
		focus = e.focus;focus_opt.checked = focus;
	});

	chrome.storage.sync.get("remdups", function(e)
	{
		remdups = e.remdups;remdups_opt.checked = remdups;
	});
}

get_tabs.addEventListener('click', function() 
{
	chrome.runtime.sendMessage({method: 'get-all-tabs' }, function(response) {
			var links = response.link;
			console.log(links);

			var txt = $("#textarea");

			for(var i=0; i<links.length; i++)
			{
				if(txt.val() != '')
				{
					if(links[i] != '')
					txt.val( txt.val() + "\n" + links[i]);
				}
				else
				{
					if(links[i] != '')
					txt.val(links[i]+ "\n");
				}
			}

			//Remove empty lines just in case
	       	var text = txt.val();
			text = text.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "");
			txt.val(text);
	});

});

save_btn.addEventListener('click', function() 
{
	var links = $('textarea').val();
	chrome.storage.sync.set({ 'links': links }, function(){ });

	alert('Saved');

});

open_btn.addEventListener('click', function() 
{
	index = 0;
	total = 0;
    lines = $('textarea').val().split('\n');


    if(remdups == true)
    {
    	var arrDistinct = new Array();
	    $(lines).each(function(index, item) {
	         if ($.inArray(item, arrDistinct) == -1)
	                    arrDistinct.push(item);
	    });

	    lines = arrDistinct;
    }

    total = lines.length;

	if(delay == 0 && lines.length > 0)
	{    

		var default_opt = document.getElementById('default');
		var http_opt = document.getElementById('http');
		var https_opt = document.getElementById('https');

		if(default_opt.checked==true)
		{
			for(var i = 0;i < lines.length;i++)
			{
				var url = lines[i];
				url = addhttp(url);
				if(url!="")
				openNewBackgroundTab(url,i);
			}		
		}

		else if(http_opt.checked==true)
		{
			for(var i = 0;i < lines.length;i++)
			{
				if(lines[i]!="")
				openNewBackgroundTab("http://"+lines[i],i);
			}		
		}

		else if(https_opt.checked==true)
		{
			for(var i = 0;i < lines.length;i++)
			{
				if(lines[i]!="")
				openNewBackgroundTab("https://"+lines[i],i);
			}		
		}		
	}
	else if(delay > 0 && lines.length > 0)
	{
		poll();
	}


}, false);

function addhttp(url) {

   if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
   }
   return url;
}



function poll() 
{
	if(delay > 0 && total > 0 && index < total)
	{
		//console.log("delay:"+ delay + " total:"+total+ "index:"+index);

		var default_opt = document.getElementById('default');
		var http_opt = document.getElementById('http');
		var https_opt = document.getElementById('https');

		if(default_opt.checked==true)
		{
			var url = lines[index];
			url = addhttp(url);
			if(url!="")
			openNewBackgroundTab(url,index);	
		}

		else if(http_opt.checked==true)
		{
			if(lines[index]!="")
			openNewBackgroundTab("http://"+lines[index],index);		
		}

		else if(https_opt.checked==true)
		{
			if(lines[index]!="")
			openNewBackgroundTab("https://"+lines[index],index);		
		}	

		index++;

		setTimeout(poll, delay * 1000);	
	}
};

function openNewBackgroundTab(url,id) {
	
	if(id == 0){
		chrome.tabs.create({ url: url, active: false }, function(tab) {
			// ذخیره کردن شناسه تب
			tab_id = tab.id;
			chrome.tabs.update(tab_id, { url: url });
		});
		
		//chrome.runtime.sendMessage({method: "open", link: url, "focus": focus }, function(response)});
	}else{
		chrome.tabs.update(tab_id, { url: url });
	}		
	
}
