
// These weill be overridden by the config itself.
var currTimeout = 1000;
var maxTimeout  = 120000;
var count       = 5;


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

function init() {
  set_initial_url(function() {
    loadConfig(startReplTries);
  });
}

console.log("starting");
setTimeout(init, currTimeout);
