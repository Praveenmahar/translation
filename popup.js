const apiKey = "AIzaSyAckjXFduY1wSXPd3OeQXGbyLtfG_KNBnM";
var textifany = "";
// Set endpoints
const endpoints = {
  translate: "",
  detect: "detect",
  languages: "languages"
};

// Abstract API request function
function makeApiRequest(endpoint, data, type, authNeeded) {
  url = "https://www.googleapis.com/language/translate/v2/" + endpoint;
  url += "?key=" + apiKey;

  // If not listing languages, send text to translate
  if (endpoint !== endpoints.languages) {
	url += "&q=" + encodeURI(data.textToTranslate);
  }

  // If translating, send target and source languages
  if (endpoint === endpoints.translate) {
	url += "&target=" + data.targetLang;
	url += "&source=" + data.sourceLang;
  }

  // Return response from API
  return $.ajax({
	url: url,
	type: type || "GET",
	data: data ? JSON.stringify(data) : "",
	dataType: "json",
	headers: {
	  "Content-Type": "application/json",
	  Accept: "application/json"
	}
  });
}
// Translate
function translate(data) {
	$(".changeme").css({'width':'165px'});
	$(".spinner").show();
  makeApiRequest(endpoints.translate, data, "GET", false).success(function(
	resp
  ) {
	$(".target").text(resp.data.translations[0].translatedText);
	$(".detection-heading").hide();
	$(".copybuttondiv").show();
	$(".translation-heading, p").show();
	 copyToClipboard(document.getElementById("outputdiv"));
	$(".spinner").hide();
	$(".changeme").css({'width':'130px'});
	var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
  });
}

// Detect language
function detect(data) {
  makeApiRequest(endpoints.detect, data, "GET", false).success(function(resp) {
	source = resp.data.detections[0][0].language;
	conf = resp.data.detections[0][0].confidence.toFixed(2) * 100;

	$(".source-lang option")
	  .filter(function() {
		return $(this).val() === source; //To select Blue
	  })
	  .prop("selected", true);
	$.when(getLanguageNames()).then(function(data) {
	  $("p.target").text(data[source] + " with " + conf + "% confidence");
	});
	$(".translation-heading").hide();
	$(".copybuttondiv").hide();
	$(".detection-heading, p").show();
  });
}

// Get languages
function getLanguages() {
  makeApiRequest(endpoints.languages, null, "GET", false).success(function(
	resp
  ) {
	$.when(getLanguageNames()).then(function(data) {
	  $.each(resp.data.languages, function(i, obj) {
		$(".source-lang, .target-lang").append(
		  '<option value="' +
			obj.language +
			'">' +
			data[obj.language] +
			"</option>"
		);
	  });
	});
  });
}

// Convert country code to country name
function getLanguageNames() {
  return {"af":"Afrikaans","sq":"Albanian","am":"Amharic","ar":"Arabic","hy":"Armenian","az":"Azeerbaijani","eu":"Basque","be":"Belarusian","bn":"Bengali","bs":"Bosnian","bg":"Bulgarian","ca":"Catalan","ceb":"Cebuano","ny":"Chichewa","zh":"Chinese (Simplified)","zh-TW":"Chinese (Traditional)","co":"Corsican","hr":"Croatian","cs":"Czech","da":"Danish","nl":"Dutch","en":"English","eo":"Esperanto","et":"Estonian","tl":"Filipino","fi":"Finnish","fr":"French","fy":"Frisian","gl":"Galician","ka":"Georgian","de":"German","el":"Greek","gu":"Gujarati","ht":"Haitian Creole","ha":"Hausa","haw":"Hawaiian","iw":"Hebrew","hi":"Hindi","hmn":"Hmong","hu":"Hungarian","is":"Icelandic","ig":"Igbo","id":"Indonesian","ga":"Irish","it":"Italian","ja":"Japanese","jw":"Javanese","kn":"Kannada","kk":"Kazakh","km":"Khmer","ko":"Korean","ku":"Kurdish","ky":"Kyrgyz","lo":"Lao","la":"Latin","lv":"Latvian","lt":"Lithuanian","lb":"Luxembourgish","mk":"Macedonian","mg":"Malagasy","ms":"Malay","ml":"Malayalam","mt":"Maltese","mi":"Maori","mr":"Marathi","mn":"Mongolian","my":"Burmese","ne":"Nepali","no":"Norwegian","ps":"Pashto","fa":"Persian","pl":"Polish","pt":"Portuguese","ma":"Punjabi","ro":"Romanian","ru":"Russian","sm":"Samoan","gd":"Scots Gaelic","sr":"Serbian","st":"Sesotho","sn":"Shona","sd":"Sindhi","si":"Sinhala","sk":"Slovak","sl":"Slovenian","so":"Somali","es":"Spanish","su":"Sundanese","sw":"Swahili","sv":"Swedish","tg":"Tajik","ta":"Tamil","te":"Telugu","th":"Thai","tr":"Turkish","uk":"Ukrainian","ur":"Urdu","uz":"Uzbek","vi":"Vietnamese","cy":"Welsh","xh":"Xhosa","yi":"Yiddish","yo":"Yoruba","zu":"Zulu"};
}
function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

// On document ready
$(function() {
  window.makeApiRequest = makeApiRequest;
  var translationObj = {};

  // Popuplate source and target language dropdowns
  getLanguages();

  $(document)
	// Bind translate function to translate button
	.on("click", "button.translate", function() {
		$(".errorbox1").hide();
	  translationObj = {
		sourceLang: $(".source-lang").val(),
		targetLang: $(".target-lang").val(),
		textToTranslate: $("textarea").val()
	  };
	  if (translationObj.targetLang !== null) {
		translate(translationObj);
		
	  } else {
			$(".errorbox1").html('Please select a target language');			
			$(".errorbox1").show();
			return false;
	  }
	})
	// Bind detect function to detect button
	.on("click", "button.detect", function() {
	  translationObj = {
		textToTranslate: $("textarea").val()
	  };

	  detect(translationObj);
	});
	$(".text-to-translate").change(function(){ 
		chrome.storage.sync.set({'textifany':$(this).val()});
	});
	$(".text-to-translate").keyup(function(){ 
		chrome.storage.sync.set({'textifany':$(this).val()});
	});
	$("#checkbox").change(function(){ 
		if(this.checked) {
			$("#stepbutton").prop('disabled',false);
		}else{
			
			$("#stepbutton").prop('disabled',true);
		}
	});
	$(".copybutton").click(function(){ 
		 copyToClipboard(document.getElementById("outputdiv"));
	});
	
	var step = "";
	var otp = "";
	document.getElementById("step").style.display = 'block';
	
    chrome.storage.sync.get("otp", function(items) { 
		if (!chrome.runtime.error) 
		{
			otp = items.otp;
		}
	});
	
    chrome.storage.sync.get("step", function(items) { 
		if (!chrome.runtime.error) 
		{
			step = items.step;
			if(typeof step !== 'undefined')
			{
				document.querySelector('.step').style.display = 'none';
				document.getElementById("step"+step).style.display = 'block';
			}
		}
	});
	chrome.storage.sync.get("textifany", function(items) { 
		if (!chrome.runtime.error && typeof items.textifany !== 'undefined') 
		{
			$('.text-to-translate').val(items.textifany);
		}
	});
	$(".privacies").click(function(e){ 
		e.preventDefault();  
		$(".step").hide();
		$("#privacy").show();
	});
	$(".backbutton").click(function(e){ 
		e.preventDefault();  
		$(".step").hide();
		$("#step").show();
	});
	var stepbutton = document.querySelector('#stepbutton');
	stepbutton.addEventListener('click', function() { 
		document.getElementById("errorbox").style.display = 'none';
		var name 	= document.getElementById("name").value;
		var email 	= document.getElementById("email").value;
		var phone 	= document.getElementById("phone").value;
		var website = document.getElementById("website").value;
		if(name.trim() == "")
		{
			document.getElementById("errorbox").innerHTML = 'Name is required';			
			document.getElementById("errorbox").style.display = 'block';
			return false;
		}
		if(email.trim() == "")
		{
			document.getElementById("errorbox").innerHTML = 'Email is required';			
			document.getElementById("errorbox").style.display = 'block';
			return false;
		}
		if(website.trim() == "")
		{
			document.getElementById("errorbox").innerHTML = 'Website is required';			
			document.getElementById("errorbox").style.display = 'block';
			return false;
		}
		document.getElementById("loading").style.display = 'block';
		var postData = {'name':name,'email': email,'phone': phone,'website': website};
		chrome.storage.sync.set(postData);
		var request 	= new XMLHttpRequest();
        request.onload 	= function() {
            var status 	= request.status;
            var data 	= JSON.parse(request.responseText);
			otp 		= data.otp;
			chrome.storage.sync.set({'name':name,'email': email,'phone': phone,'website': website,'otp':data.otp,'step':1});
			document.querySelector('.step').style.display = 'none';
			document.getElementById("loading").style.display = 'none';
			document.getElementById("step1").style.display = 'block';
        }
        request.open('POST', 'https://deskmoz.com/extension.php', true/false);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send('name='+name+'&email='+email+'&type=translation&phone='+encodeURIComponent(phone)+'&website='+website);		
	}, false);
	
	var otpbutton = document.querySelector('#otpbutton');
	otpbutton.addEventListener('click', function() { 
		document.querySelector('.alert').style.display = 'none';
		var otpinput 	= document.getElementById("otp").value;	
		if(otpinput == "")
		{
			document.querySelector('.otpsuccess').style.display = 'none';
			document.querySelector('.otperror').style.display = 'block';
			return false;			
		}
		if(otpinput != otp)
		{
			document.querySelector('.otpsuccess').style.display = 'none';
			document.querySelector('.otperror').style.display = 'block';
		}
		else
		{
			chrome.storage.sync.set({'step':2});
			document.querySelector('.step').style.display = 'none';
			document.getElementById("step1").style.display = 'none';			
			document.getElementById("step2").style.display = 'block';			
		}		
	}, false);
	
	
});
