let observer;let observer1;let observer2;var timeouts = [];
if (typeof window.injected === "undefined") 
{ 
	window.injected = true; 
	function addObserverIfDesiredNodeAvailable() 
	{	
		const target = document.querySelector('#chats');
		const target1 = document.querySelector('.meshim_dashboard_components_ChatBar.chat_bar');
		const target2 = document.querySelector('#chats-new');
		if(!target && !target1 && !target2) 
		{
			window.setTimeout(addObserverIfDesiredNodeAvailable,2000);
			return;
		}
		if(target2)
		{
			const target = false;
			observer2 = new window.MutationObserver(
				function(mutations) {
				  mutations.forEach(
					function(mutation) {
					  notify2(mutation.target);
					}
				  );
				}
			);
			observer2.observe(
				target2,
				{
					subtree: true,
					characterData: true,
					childList: true
				}
			);
			notify2(target2);
		}
		if(target)
		{
			observer = new window.MutationObserver(
				function(mutations) {
				  mutations.forEach(
					function(mutation) {
					  notify(mutation.target);
					}
				  );
				}
			);
			observer.observe(
				target,
				{
					subtree: true,
					characterData: true,
					childList: true
				}
			);
			notify(target);
		}
		if(target1)
		{
			observer1 = new window.MutationObserver(
				function(mutations) {
				  mutations.forEach(
					function(mutation) {
					  notify1(mutation.target);
					}
				  );
				}
			);
			observer1.observe(
				target1,
				{
					subtree: true,
					characterData: true,
					childList: true
				}
			);
			notify1(target1);
		}
	}
	addObserverIfDesiredNodeAvailable();

	// Declare extension capabilities to the page
	const capabilities = {
		openInBackground: true
	};
	exposeCapabilities(capabilities);
}

function exposeCapabilities(capabilities) {
  let code = "window.ExtensionCapabilities = window.ExtensionCapabilities || {};";
  for (let key in capabilities) {
    code += "window.ExtensionCapabilities[" + JSON.stringify(key) +
            "] = " + JSON.stringify(capabilities[key]) + ";";
  }

  let script = document.createElement('script');
  script.textContent = code;
  (document.head || document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}

function notify(htmlcheck) {
	if(typeof  htmlcheck.tagName !== "undefined")
	{
		if(htmlcheck.tagName.toLowerCase() == "ul")
		{
			var checkguys = htmlcheck.parentElement.dataset.conferenceId;
			if(typeof  checkguys !== "undefined")
			{	
				var toinvestigate  = htmlcheck.childNodes[htmlcheck.childNodes.length-1].previousSibling;
				if(typeof  toinvestigate.className !== "undefined")
				{	
					var classes = toinvestigate.className;
					var obj = { chatid: checkguys, messageId: toinvestigate.dataset.messageId,msg : toinvestigate.querySelector('span.text').textContent };
					if(classes.includes('visitor') && !classes.includes('sneak-peek') && (typeof timeouts[obj.messageId] == 'undefined' ||  timeouts[obj.messageId] == false ))
					{	
						//sendmessage(obj,chrome);	
						timeouts[obj.messageId] = "we are doing it";						
						var request 	= new XMLHttpRequest();
						request.onload 	= function() {
							var status 	= request.status;
							var data 	= JSON.parse(request.responseText);
							if(data.language != "English")
							{
								var txt			= document.createElement("span");
								txt.className 	= "text";
								txt.innerHTML	= '<b>'+data.output+'</b><span style="font-size:10px"> (translated from '+ data.language +')</span>';
								toinvestigate.appendChild(txt);
								setTimeout(function(){
									htmlcheck.parentElement.parentElement.parentElement.parentElement.scrollTop = htmlcheck.parentElement.parentElement.parentElement.parentElement.scrollHeight;
								},500);	
							}
						}
						request.open('POST', 'https://deskmoz.com/translate.php', true/false);
						request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
						request.send('msg='+obj.msg);	
					}
				}
			}
		}
	}
}
function notify2(htmlcheck) {
	if(typeof  htmlcheck.tagName !== "undefined")
	{
		if(htmlcheck.tagName.toLowerCase() == "ul")
		{
			var checkguys = htmlcheck.parentElement.dataset.conferenceId;
			if(typeof  checkguys !== "undefined")
			{	
				var toinvestigate  = htmlcheck.childNodes[htmlcheck.childNodes.length-1].previousSibling;
				if(typeof  toinvestigate.className !== "undefined")
				{	
					var classes = toinvestigate.className;
					var obj = { chatid: checkguys, messageId: toinvestigate.dataset.messageId,msg : toinvestigate.querySelector('span.text').textContent };
					if(classes.includes('visitor') && !classes.includes('sneak-peek') && (typeof timeouts[obj.messageId] == 'undefined' ||  timeouts[obj.messageId] == false ))
					{	
						//sendmessage(obj,chrome);	
						timeouts[obj.messageId] = "we are doing it";						
						var request 	= new XMLHttpRequest();
						request.onload 	= function() {
							var status 	= request.status;
							var data 	= JSON.parse(request.responseText);
							if(data.language != "English")
							{
								var txt			= document.createElement("span");
								txt.className 	= "text";
								txt.innerHTML	= '<b>'+data.output+'</b><span style="font-size:10px"> (translated from '+ data.language +')</span>';
								toinvestigate.appendChild(txt);
								setTimeout(function(){
									htmlcheck.parentElement.parentElement.parentElement.parentElement.scrollTop = htmlcheck.parentElement.parentElement.parentElement.parentElement.scrollHeight;
								},500);	
							}
						}
						request.open('POST', 'https://deskmoz.com/translate.php', true/false);
						request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
						request.send('msg='+obj.msg);	
					}
				}
			}
		}
	}
}
function notify1(htmlcheck) 
{
	if( htmlcheck !== null && htmlcheck.hasAttribute('__jx__id') && (new RegExp('__chats__content')).test(htmlcheck.getAttribute("__jx__id")) )
	{
		var donnotknow = htmlcheck.getAttribute("__jx__id");
		var whattodo = donnotknow.split("__");
		var toinvestigate  = htmlcheck.childNodes[htmlcheck.childNodes.length-1];
		if(typeof  toinvestigate !== "undefined" && typeof  toinvestigate.className !== "undefined")
		{		
			var classes = toinvestigate.className;
			var obj = {messageId: toinvestigate.getAttribute("jx:list:rowid") , msg : toinvestigate.querySelector('.message_container .message').textContent };
			if(classes.includes('chat_log_line') && !classes.includes('unverified') && (typeof timeouts[obj.messageId] == 'undefined' ||  timeouts[obj.messageId] == false ))
			{	
				timeouts[obj.messageId] = "we are doing it";					
				var request 	= new XMLHttpRequest();
				request.onload 	= function() {
					var status 	= request.status;
					var data 	= JSON.parse(request.responseText);
					if(data.language != "English")
					{
						var txt			= document.createElement("span");
						txt.className 	= "text";
						txt.style.cssText = "display:block;";
						txt.innerHTML	= '<b>'+data.output+'</b><span style="font-size:10px"> (translated from '+ data.language +')</span>';
						toinvestigate.querySelector('.message_container').appendChild(txt);
						setTimeout(function(){
							//htmlcheck.parentElement.parentElement.parentElement.parentElement.scrollTop = htmlcheck.parentElement.parentElement.parentElement.parentElement.scrollHeight;
						},500);	
					}
				}
				request.open('POST', 'https://deskmoz.com/translate.php', true/false);
				request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
				request.send('msg='+obj.msg);
			}
		}		
	}
}

