
// These weill be overridden by the config itself.
var currTimeout = 1000;
var maxTimeout  = 120000;
var count       = 5;


// override whitelist
var run_anywhere = false;

// the config itself.
var current_config = null;

function get_randomize_time(mode) {
  var wait = 0;
  var potential_mode = mode;
  if (potential_mode == 'always') {
    wait = 0;
  } else if (potential_mode == '1min') {
    wait = 60 * 1000;
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
  // log('mode was: ' + mode);
  // log('wait is: ' + wait);
  return wait;
}


function choose_now(moniker_list,choice) {
  var whichever = Math.floor(moniker_list.length * Math.random());
  choice.last_chosen_item = whichever;
  choice.last_chosen_time = (new Date()).getTime();
}

function choose(rand_mode,moniker_list,choice) {
  var wait = get_randomize_time(rand_mode);
  var now = (new Date()).getTime();
  if (!choice.hasOwnProperty('last_chosen_time') || 
      ((now - choice.last_chosen_time) >= wait)) {
    choose_now(moniker_list,choice);
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
  /*jshint boss:true */
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


function make_replacement_elems_array(action_name,action,rand_mode,moniker_list,brackets,broken_texts,orig_node,choice) {
  var repl_array = [];
  for (var k=0;k<broken_texts.length;k++) {
    chunk = broken_texts[k];
    if (chunk.match) {
      choose(rand_mode, moniker_list, choice);
      var replacement = moniker_list[choice.last_chosen_item % moniker_list.length];
      replacement = brackets[0] + replacement + brackets[1];

      var unode = document.createElement('span');
      // This style setting that can be part of a config
      // is in addition to any styles's associated with the
      // detrumpified class.
      unode.style = "";
      unode.title = "was " + action_name;

      if (action.hasOwnProperty('match_style')) {
        unode.style = action.match_style;
      }
      unode.className = defaults.insult_classname;
      unode.appendChild(document.createTextNode(replacement));
      repl_array.push(unode);
    } else {
      var newnode = orig_node.cloneNode(false);
      newnode.nodeValue = chunk.text;
      repl_array.push(newnode);
    }
  }
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
  switch_text();
  switch_imgs();
  count -= 1;
  if (count) {
    log('currTimeout:' + currTimeout);
    setTimeout(switchem,currTimeout);
    if (currTimeout < maxTimeout) currTimeout *= current_config.run_info.timeMultiplier;
  }
}

function getRunnableActions(config_actions,items) {
    // generate a shortened list of actions that the user has enabled
    var actions_to_run = Object.keys(current_config.actions);
    if (items.hasOwnProperty('enabled_actions')) {
      temp_actions_to_run = Object.keys(items.enabled_actions);
      actions_to_run = [];
      for (n=0;n<temp_actions_to_run.length; n++) {
        action_name = temp_actions_to_run[n];
        if (current_config.actions.hasOwnProperty(action_name) &&
            (items.enabled_actions[action_name])) {
          actions_to_run.push(action_name);
        }
      }
    }
    return actions_to_run;
}

// this routine starts with an element and tries to work up
// the hierarchy to see if it is enclosed anywhere by an 'a',
// and then if that a's link matches the regex supplies, we
// return true.
function findParentLinkMatch(elem, re) {
    var done = false;
    var celem = elem;
    var count = 0;
    while (count < 15) {
        if (celem && (celem.nodeName === 'A')) {
            var ss = decodeURIComponent(celem.href);
            if (celem.href) {
                if (re.exec(decodeURIComponent(celem.href))) {
                    return true;
                }
                return false;
            }
        }
        count += 1;
        celem = celem.parentElement;
        if (celem === null) {
            return false;
        }
    }
    return false;
}


function switch_imgs() {
  log('switch_imgs()');
  chrome.storage.local.get(['kittenize','enabled_actions'],function(items) {
    var action_count = 0;

    var mode = items.hasOwnProperty('kittenize') ? items.kittenize : 'off';

    // this is for backward compatibility with boolean version that
    // may be stored in local store.
    if (typeof mode == 'boolean') {
        mode = mode ? 'kittens' : 'off';
    }

    if (mode !== 'off') {
      var actions_to_run = getRunnableActions(current_config.actions,items);

      for (var n=0; n<actions_to_run.length; n++) {
        action_name = actions_to_run[n];
        log('action_name: ' + action_name);
        var action = current_config.actions[action_name];
        var alt_re = new RegExp(action.find_regex[0],
                                action.find_regex[1]);
        var src_re;
        if (action.hasOwnProperty('img_find_regex')) {
            src_re = new RegExp(action.img_find_regex[0],
                                action.img_find_regex[1]);
        } else {
            src_re = new RegExp(action.find_regex[0],'i');
        }

        var imgs = document.getElementsByTagName('img');
        for (var i=0; i<imgs.length; i++) {
          var img = imgs[i];

          // Super-sophisticated image detection algorithm here:
          // -- does the alt text look trumpian?
          var alt_match = alt_re.exec(img.alt);
          // does the image source itself look trumpian?
          var src_match = src_re.exec(decodeURIComponent(img.src));
          // is there anything trumpian in the style tag?
          var sty_match = src_re.exec(decodeURIComponent(img.style));
          // is there an enclosing "A" parent whose href looks trumpian?
          var parent_link_match = false;
          try {
              parent_link_match = findParentLinkMatch(img, src_re);
          } catch (w) { }
          parent_link_match &= (mode === 'more_kittens');

          if (alt_match ||
              src_match ||
              sty_match ||
              parent_link_match ||
              false) {
            var replsrc;
            if (mode == 'div') {
                var border = 2;
                var nd = document.createElement('div');
                var repl = document.createElement('span');
                repl.textContent = 'National disgrace removed.';
                var backsrc = null;
                if (action.hasOwnProperty('image_replacement')) {
                    var idx = Math.floor(Math.random()*action.image_replacement.html.length);
                    repl.textContent = action.image_replacement.html[idx];
                    border = action.image_replacement.border;
                    if (action.image_replacement.hasOwnProperty('background')) {
                        idx = Math.floor(Math.random()*action.image_replacement.background.length);
                        backsrc = action.image_replacement.background[idx];
                    }
                }
                if (backsrc) {
                    nd.style.backgroundImage = "url('" + backsrc + "')";
                    nd.style['background-repeat'] = 'repeat';
                }
                removeChildrenReplaceWith(nd,[repl]);
                var dw = img.clientWidth - 2 * border;
                var dh = img.clientHeight - 2 * border;
                nd.style['text-align'] = 'center';
                nd.style['vertical-align'] = 'middle';
                nd.style.display = 'table-cell';
                nd.style.border = border.toString() + 'px solid';
                nd.style.width = dw.toString() + 'px';
                nd.style['max-width'] = dw.toString() + 'px';
                nd.style.height= dh.toString() + 'px';
                nd.style['max-height'] = dh.toString() + 'px';
                img.parentNode.replaceChild(nd,img);
            } else if ((mode == 'kittens') ||
                       (mode == 'more_kittens')) {
                replsrc = 'https://placekitten.com/' +
                          img.clientWidth.toString() + '/' + 
                          img.clientHeight.toString();
                if (img.src !== replsrc) img.src = replsrc;
            } else {
                replsrc = 'https://placehold.it/' +
                          img.clientWidth.toString() + 'x' +
                          img.clientHeight.toString();
                if (img.src !== replsrc) img.src = replsrc;
            }
          }
        }
      }
    }
  });
}

function switch_text() {
    log('switchem START, count:' + count);

    if (current_config === null) {
      log("current_config is invalid");
      return;
    }


    var action_name;
    var n;

    chrome.storage.local.get(['stored_choices','enabled_actions','brevity','brackets','rand_mode'],function(items) {
      var action_count = 0;
      var stored_choices = {};
      if (items.hasOwnProperty('stored_choices')) stored_choices = items.stored_choices;
      log(stored_choices);

      var actions_to_run = getRunnableActions(current_config.actions,items);

      for (var n=0; n<actions_to_run.length; n++) {
        action_name = actions_to_run[n];
        log('action_name: ' + action_name);
        var action = current_config.actions[action_name];
        // console.log(action);
        if (!action.hasOwnProperty('monikers')) {
          log("action is invalid");
          return;
        }

        // create a sublist of monikers that meet the brevity criteria
        var monikers_to_use = action.monikers;
        if (items.hasOwnProperty('brevity')) {
            monikers_to_use = [];
            var max_l = parseInt(items.brevity);
            for (var p=0; p<action.monikers.length; p++) {
                var moniker = action.monikers[p];
                var word_count = moniker.split(/[\s\-]/).length;
                if ((max_l === 0) || (word_count <= max_l)) {
                    monikers_to_use.push(moniker);
                }
            }
        }

        var rand_mode = 'always';
        if (items.hasOwnProperty('rand_mode')) {
            rand_mode = items.rand_mode;
        }

        // Determine quoting. I am gradually moving away from 
        // the config file for this, and letting the UI take
        // precendence. Eventually, I will not include the 
        // config file settings at all.
        var brackets = ['',''];
        if (action.hasOwnProperty('scarequote') && action.scarequote) {
          brackets = [ '\u201c', '\u201d' ];
        }
        if (action.hasOwnProperty('bracket') && (action.bracket.length >= 2)) {
          brackets = [ action.bracket[0], action.bracket[1] ];
        }
        if (items.hasOwnProperty('brackets')) {
            var mode = items.brackets;
            if (mode === 'curly') brackets = [ '\u201c', '\u201d' ];
            if (mode === 'square') brackets = [ '[', ']' ];
        }


        var search_regex = new RegExp(action.find_regex[0],
                                      action.find_regex[1]);
        var elements = document.getElementsByTagName('*');

        if (!stored_choices.hasOwnProperty(action_name)) {
          stored_choices[action_name] = {};
          choose_now(monikers_to_use,stored_choices[action_name]);
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
                        action_name,
                        action,
                        rand_mode,
                        monikers_to_use,
                        brackets,
                        broken_texts,
                        node,
                        stored_choices[action_name]);
                replace_elem_with_array_of_elems(node,repl_array);
              }
            }
          }
        }

        if (action_count == (Object.keys(current_config.actions).length-1)) {
          // console.log("iteration done; storing choices");
          chrome.storage.local.set({'stored_choices': stored_choices}, function() { });

        }
        action_count += 1;
      }
    });
}


function isThisPageRunnable() {
  if (run_anywhere) return true;
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
  if (err === null) {
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
    chrome.storage.local.get(['insult_style','run_anywhere'],function(items) {
      if (items.hasOwnProperty('run_anywhere')) {
          run_anywhere = items.run_anywhere;
      }
      if (items.hasOwnProperty('insult_style')) {
        createAndSetStyle(defaults.insult_cssname,items.insult_style);
      }
    });
    loadConfig(startReplTries);
  });
}

log("starting");
setTimeout(init, currTimeout);
