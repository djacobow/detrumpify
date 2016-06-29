
// These weill be overridden by the config itself.
var currTimeout = 1000;
var maxTimeout  = 120000;
var count       = 5;


// the config itself.
var current_config = null;

function get_randomize_time(cfg) {
  var wait = 0;
  if ('randomize_mode' in cfg) {
    var potential_mode = cfg.randomize_mode;
    if (potential_mode == 'always') {
      wait = 0;
    } else if (potential_mode == '15min') {
      wait = 15 * 60 * 1000;
    } else if (potential_mode == 'hourly') {
      wait = 60 * 60 * 1000;
    } else if (potential_mode == 'daily') {
      wait = 24 * 60 * 60 * 1000;
    } else if (potential_mode == 'weekly') {
      wait = 7 * 24 * 60 * 60 * 1000;
    } else if (potential_mode == 'monthly') {
      wait = 30 * 24 * 60 * 60 * 1000;
    } else if (potential_mode == 'yearly') {
      wait = 365 * 24 * 60 * 60 * 1000;
    }         
  }
  return wait;
}

function get_stored_choice(cfg,cb) {
 log('get_stored_choice START');
 chrome.storage.local.get(
   ['last_chosen_time', 'last_chosen_item'],
   function(existing_choice) {
     if (('last_chosen_time' in existing_choice) && 
         (existing_choice.last_chosen_time != 0)) {
       cb(existing_choice);
     } else {
       var new_choice = {};
       choose_now(cfg,new_choice);
       cb(new_choice);
     }
   }
 );
};

function store_updated_choice(choice) {
  log('store_updated_choice START');
  log(JSON.stringify(choice));
  chrome.storage.local.set(choice, function() { });
};


function choose_now(cfg,choice) {
  var whichever = Math.floor(cfg.monikers.length * Math.random());
  choice.last_chosen_item = whichever;
  choice.last_chosen_time = (new Date).getTime();
};

function choose(cfg,choice) {
  var wait = get_randomize_time(cfg);
  var now = (new Date).getTime();
  if ((now - choice.last_chosen_time) >= wait) {
    choose_now(cfg,choice);
  }
  return choice;
}

// convert a text string into an array of 
// elements that represent the bits and pieces
// that do and do not match the regex
function find_match_nonmatch_chunks(text,re) {
  var match;
  var broken_texts = [];
  var end = 0;
  // first, break what was a text node into an
  // array of text chunks representing trump and
  // non-trump sections
  while (match = re.exec(text)) {
    var start = match.index;
    var new_end = re.lastIndex;
    log("start: " + start + ' end: ' + end);
    var before_text = text.substr(end,start-end);
    if (before_text.length) {
      broken_texts.push({'match':false, 'text': before_text});
    }
    var match_text = text.substr(start,new_end-start-1);
    broken_texts.push({'match':true, 'text': match_text});
    end = new_end;
  }
  if (broken_texts.length && (end < text.length-1)) {
    var after_text = text.substr(end,text.length-1); 
    broken_texts.push({'match':false, 'text':after_text});
  }
  return broken_texts;
}

function make_replacement_elems_array(broken_texts,orig_node,choice) {
  var repl_array = [];
  for (var k=0;k<broken_texts.length;k++) {
    chunk = broken_texts[k];
    if (chunk.match) {
      choose(current_config, choice);
      var replacement = current_config.monikers[choice.last_chosen_item];
      if (('scarequote' in current_config) && current_config.scarequote) {
        replacement = '\u201c' + replacement + '\u201d';
      }
      var unode = document.createElement('span');
      unode.style = "";
      if ('match_style' in current_config) {
        unode.style = current_config.match_style;
      }
      unode.appendChild(document.createTextNode(replacement));
      repl_array.push(unode);
    } else {
      var newnode = orig_node.cloneNode(false);
      newnode.nodeValue = chunk.text;
      repl_array.push(newnode);
    }
  }
  console.log(repl_array);
  return repl_array;
}

function replace_elem_with_array_of_elems(orig, arry) {
  var newnode = document.createElement('span');
  for (var k=0;k<repl_array.length;k++) {
    newnode.appendChild(repl_array[k]);
  }
  orig.parentNode.replaceChild(newnode,orig);
}


function switchem() {
    log('switchem START, count:' + count); 
    if ((current_config == null) || !('monikers' in current_config)) {
      log("current_config is invalid");
      return;
    }

    var search_regex = new RegExp(current_config.find_regex[0],
		                  current_config.find_regex[1]);
    var elements = document.getElementsByTagName('*');

    get_stored_choice(current_config,function(choice) {
      for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j =0; j < element.childNodes.length; j++) {
          var node = element.childNodes[j];
          if (node.nodeType === 3) {
            var text = node.nodeValue;
            broken_texts = find_match_nonmatch_chunks(text,search_regex);

	    if (broken_texts.length) {
              repl_array = make_replacement_elems_array(broken_texts, node, choice);
	      replace_elem_with_array_of_elems(node,repl_array);
            }
          }
        }
      }
      store_updated_choice(choice);

      count -= 1;
      if (count) {
        log('currTimeout:' + currTimeout);
        setTimeout(switchem,currTimeout);
        if (currTimeout < maxTimeout) currTimeout *= current_config.run_info.timeMultiplier;
      }
    });
}


function isThisPageRunnable() {
  log('isThisPageRunnable');
  var url = document.location.href;
  var match = false;
  for (var i=0;i<current_config.whitelist.length;i++) {
    var item = current_config.whitelist[i];
    var re   = new RegExp('https?://(\\w+\\.)?' + item);
    if (url.match(re)) { 
      match = true;
      log("IS RUNNABLE: " + url);
      break;
    }
  } 
  return match;
}

function startReplTries(err,res) {
  log("startReplTries()");
  if (err == null) {
    current_config = res;
    if (isThisPageRunnable()) {
      setTimeout(switchem, currTimeout);
      try {
        currTimeout = current_config.run_info.startTimeout;
        currTimeout *= current_config.run_info.timeMultiplier;
        count = current_config.run_info.count;
      } catch(e) {
        log("config probably doesn't have run_info");
      } 
    } else {
      log("this page is not whitelisted");
    }
  } else {
    log("Skipping startReplTries due to ERROR");
    log(err);
    log(res);
  }
}

function init() {
  set_initial_url(function() {
    loadConfig(startReplTries);
  });
}

log("starting");
setTimeout(init, currTimeout);
