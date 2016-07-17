
// These weill be overridden by the config itself.
var currTimeout = 1000;
var maxTimeout  = 120000;
var count       = 5;


// the config itself.
var current_config = null;

function get_randomize_time(action) {
  var wait = 0;
  if ('randomize_mode' in action) {
    var potential_mode = action.randomize_mode;
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


function choose_now(action,choice) {
  var whichever = Math.floor(action.monikers.length * Math.random());
  choice.last_chosen_item = whichever;
  choice.last_chosen_time = (new Date).getTime();
};

function choose(action,choice) {
  var wait = get_randomize_time(action);
  var now = (new Date).getTime();
  if ((now - choice.last_chosen_time) >= wait) {
    choose_now(action,choice);
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
    // log("start: " + start + ' end: ' + end);
    var before_text = text.substr(end,start-end);
    if (before_text.length > 0) {
      broken_texts.push({'match':false, 'text': before_text});
    }
    var match_text = text.substr(start,new_end-start);
    broken_texts.push({'match':true, 'text': match_text});
    end = new_end;
  }
  if (broken_texts.length && (end < text.length)) {
    var after_text = text.substr(end,text.length-1);
    broken_texts.push({'match':false, 'text':after_text});
  }
  // if (broken_texts.length) {
  //   console.log(broken_texts);
  // }
  return broken_texts;
}

function make_replacement_elems_array(action,broken_texts,orig_node,choice) {
  var repl_array = [];
  for (var k=0;k<broken_texts.length;k++) {
    chunk = broken_texts[k];
    if (chunk.match) {
      choose(action, choice);
      var replacement = action.monikers[choice.last_chosen_item];
      if (('scarequote' in action) && action.scarequote) {
        replacement = '\u201c' + replacement + '\u201d';
      }
      if (('bracket' in action) && (action.bracket.length >= 2)) {
        replacement = action.bracket[0] + replacement + action.bracket[1];
      }
      var unode = document.createElement('span');
      unode.style = "";
      if ('match_style' in action) {
        unode.style = action.match_style;
      }
      unode.appendChild(document.createTextNode(replacement));
      repl_array.push(unode);
    } else {
      var newnode = orig_node.cloneNode(false);
      newnode.nodeValue = chunk.text;
      repl_array.push(newnode);
    }
  }
  // console.log(repl_array);
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

    if (current_config == null) {
      log("current_config is invalid");
      return;
    }


    chrome.storage.local.get(['stored_choices'],function(stored_choices_holder) {
      var action_count = 0;
      for (var action_name in current_config.actions) {
        log('action_name: ' + action_name);
        var action = current_config.actions[action_name];
        if (!('monikers' in action)) {
          log("action is invalid");
          return;
        }

        var search_regex = new RegExp(action.find_regex[0],
                                      action.find_regex[1]);
        var elements = document.getElementsByTagName('*');

        if (!('stored_choices' in stored_choices_holder)) {
          stored_choices_holder.stored_choices = {};
        }

        if (!(action_name in stored_choices_holder.stored_choices)) {
          stored_choices_holder.stored_choices[action_name] = {};
          choose_now(action,stored_choices_holder.stored_choices[action_name]);
        }

        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          for (var j =0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];
            if (node.nodeType === 3) {
              var text = node.nodeValue;
              broken_texts = find_match_nonmatch_chunks(text,search_regex);

              if (broken_texts.length) {
                repl_array = make_replacement_elems_array(
                        action,
                        broken_texts,
                        node,
                        stored_choices_holder.stored_choices[action_name]);
                replace_elem_with_array_of_elems(node,repl_array);
              }
            }
          }
        }

        if (action_count == (Object.keys(current_config.actions).length-1)) {
          console.log("iteration done; storing choices");
          console.log(stored_choices_holder);
          chrome.storage.local.set(stored_choices_holder, function() { });

          count -= 1;
          if (count) {
            log('currTimeout:' + currTimeout);
            setTimeout(switchem,currTimeout);
            if (currTimeout < maxTimeout) currTimeout *= current_config.run_info.timeMultiplier;
          }
        }
        action_count += 1;
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
