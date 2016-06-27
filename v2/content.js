
// These weill be overridden by the config itself.
var currTimeout = 1000;
var maxTimeout  = 120000;
var count       = 5;

// for determining when to refetch the cached config
// var max_age     = 7 * 24 * 60 * 60 * 1000;
var max_age     = 180 * 1000;

// where to get the config from
var source = null;

// sets the initial stored url for configuration fetching
// if it is not already set. It also stores it to the local store.
function set_initial_url() {
  chrome.storage.local.get(['config_source'],function(items) {
    if ('config_source' in items) {
      source = items.config_source;
    } else {
      source = "http://localhost:8000/clean.json";
      chrome.storage.loca.set({'config_source': source},function() {});
    }
  });
};


set_initial_url();

// the config itself.
var current_config = null;

function switchem() {
    if ((current_config == null) || !('monikers' in current_config)) {
      console.log("current_config is invalid");
      return;
    }

    var search_regex = new RegExp(current_config.find_regex[0],
		                  current_config.find_regex[1]);
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var whichever = Math.floor(current_config.monikers.length * Math.random());
                var replacement = current_config.monikers[whichever];
		if (('scarequote' in current_config) && (current_config.scarequote)) {
                  replacement = '\u201c' + replacement + '\u201d';
		}
                var replacedText = text.replace(search_regex, replacement);
                // var replacedText = text.replace(/(Donald\s*(J\.?\s*)?)?Trump/g, replacement);
                if (replacedText !== text) {
                    // console.log("REPL: " + replacedText);
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
    count -= 1;
    if (count) {
        setTimeout(switchem,currTimeout);
        if (currTimeout < maxTimeout) currTimeout *= current_config.run_info.timeMultiplier;
    }
}

function storeConfig(err,txt,cb) {
  console.log("storeConfig");
  if (err != null) {
    cb(err,txt);
    return;
  } 

  var data = {};

  try {
    data = JSON.parse(txt);
  } catch(e) {
    console.log("JSON parse error");
    console.log(e);
    cb(e,txt);
    return;
  }
 

  if (data.schema == 'InsultMarkupLanguage/0.1') {
    chrome.storage.local.set({'cfgdata': data}, function() {
      if (chrome.lastError) {
        cb(chrome.lastError);
      }	else {
        date = (new Date).getTime();
        chrome.storage.local.set({'config_date': date}, function() {});
        chrome.storage.local.set({'config_valid': true}, function() {});
	console.log("STORE SUCCESS");
	// console.log("STORE DUMP:");
	// chrome.storage.local.get(function(data) { console.log(data) });
	loadConfig(cb,false);
      }
    });
  }
}

function isThisPageRunnable() {
  console.log('isThisPageRunnable');
  var url = document.location.href;
  var match = false;
  for (var i=0;i<current_config.whitelist.length;i++) {
    var item = current_config.whitelist[i];
    var re   = new RegExp('https?://(\\w+\\.)?' + item);
    if (url.match(re)) { 
      match = true;
      console.log("IS RUNNABLE: " + url);
      break;
    }
  } 
  return match;
}

function startReplTries(err,res) {
  console.log("startReplTries()");
  if (err == null) {
    current_config = res;
    if (isThisPageRunnable()) {
      setTimeout(switchem, currTimeout);
      try {
        currTimeout = current_config.run_info.startTimeout;
        currTimeout *= current_config.run_info.timeMultiplier;
        count = current_config.run_info.count;
      } catch(e) {
        console.log("config probably doesn't have run_info");
      } 
    } else {
      console.log("this page is not whitelisted");
    }
  } else {
    console.log("Skipping startReplTries due to ERROR");
    console.log(err);
    console.log(res);
  }
}

/*
 // experimental does not work yet
chrome.runtime.onMessage.addListener(function(msg,sender,funcresp) {
   console.log('receive message');
   if (('message' in msg) && (msg.message == 'load_config')) {
     console.log('message is for me!');
     loadConfig(function(err,res) {
       funcresp(res);
     });
   }
});
*/

function loadConfig(cb,try_remote = true) {
  chrome.storage.local.get(['cfgdata',
		            'config_date',
			    'config_valid'],
	function(items) {
          var now = (new Date).getTime();
          if (('config_valid' in items) && 
	      (items.config_valid) && 
	      (now - items.config_date < max_age)) {
	    console.log("LOAD FROM STORAGE");
            cb(null,items.cfgdata);
	  } else if (try_remote) {
            loadConfigRemote(cb);
	  } else {
            cb('load_config_failed');
	  }
	});		
}

function loadConfigRemote(cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      text = xhr.responseText;
      if (xhr.status == 200) {
	console.log("FETCH SUCCESS");
        storeConfig(null,text,cb)
      } else {
        cb('err',"status was " + xhr.status);
      }
    }
  };
  xhr.open('GET',source, true);
  xhr.send();
}

function init() {
  loadConfig(startReplTries);
}

console.log("starting");
setTimeout(init, currTimeout);
