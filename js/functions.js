const BADGE_BACKGROUND_COLOR 	= '#d73f31';
const OPTIONS_VERSION 			= 3;
var time 						= "";
let last_unread_count 			= 0;
let retryCount 					= 0;
let lastError 					= "";
let notificationTimeout;

/* exported onMessage */
function onMessage(request, sender, callback) 
{
	if (typeof request.chatid !== 'undefined' && request.msg != "") 
	{	
	}
}


function showNotification(title, body,chatid,type) 
{
	let options = {
		iconUrl: 'img/icon-48.png',
		type: 'basic',
		title: title,
		message: body
	};
	if (getBrowserName() == "Chrome") 
	{
		options.requireInteraction = true;
		options.isClickable = true;
	}
	chrome.notifications.clear("deskmozbuzz_"+chatid+"_"+type, function() {
		chrome.notifications.create("deskmozbuzz_"+chatid+"_"+type, options);
	});
	window.clearTimeout(notificationTimeout);		
	notificationTimeout = window.setTimeout( function() { chrome.notifications.clear("deskmozbuzz_"+chatid+"_"+type); }, 60000 );
	
}

function getBrowserName() 
{
	if (typeof browser !== 'undefined') 
	{
		return 'Mozilla';
	} 
	else 
	{
		return 'Chrome';
	}
}
/* exported onNotificationClick */
function onNotificationClick(id) 
{
  chrome.notifications.clear(id);
  var chtid = id.split("_");
  openOurTab(chtid[1],chtid[2]);
}

function findOurTab(callback) {
  chrome.tabs.query(
    {
      url: "*://my.livechatinc.com/*"
    },
    function(tabs) {
      callback(tabs[0]);
    }
  );
}
function findOurTab1(callback) {
  chrome.tabs.query(
    {
      url: "*://dashboard.zopim.com/*"
    },
    function(tabs) {
      callback(tabs[0]);
    }
  );
}

function openOurTab(windowId,type) {
	if(type == "livechat")
	{
		findOurTab(function(tab) {
			if (tab) {
			  chrome.tabs.update(tab.id, {active: true});
			  chrome.windows.update(tab.windowId, {focused: true});
			  chrome.tabs.sendMessage(tab.id, {chatid: windowId,type:type});
			} else {
			  let url = 'https://my.livechatinc.com/chats/'+windowId;
			  if (localStorage.click_page == 'all_items') { url += 'chats'; }
			  chrome.tabs.create({url: url, pinned: false});
			}
		});
	}
	if(type == "zopim")
	{
		findOurTab1(function(tab) {
			if (tab) {
			  chrome.tabs.update(tab.id, {active: true});
			  chrome.windows.update(tab.windowId, {focused: true});
			  chrome.tabs.sendMessage(tab.id, {chatid: windowId,type:type});
			} else {
			  let url = 'https://dashboard.zopim.com/';
			  chrome.tabs.create({url: url, pinned: false});
			}
		});
	}
}