/*jshint esversion:6 */

function selectConfig(e) {
  var tgt = e.target || e.srcElement;
  var id  = tgt.id;
  var new_url = tgt.value;
  log('selectConfig(): ' + new_url);
  var srcelem = document.getElementById('configsrc');
  var curr_url = srcelem.value;

  if (new_url !== curr_url) {
      editModeClick('url');
      document.getElementById('editmode_url').checked = true;
      srcelem.value = new_url;
      saveConfigURL();
  }
}

function resetStorage() {
    zapStorage(function() {
        log('storage zapped');
        loadConfig(function(err,res) {
            showConfig(err,res);
            restorePluginOptions();
        });
    });
}

function dumb_cb(err,msg) {
 // console.log('dumb_cb');
}

function getCannedList(cb) {
  chrome.runtime.sendMessage(
    null,
    {'cmd':'get',
    'url': defaults.buttons_fetch_url, },
    null,
    function(resp) {
      var errmsg = document.createElement('p');
      errmsg.textContent = 'Could not load button metadata. How is our Internet connection?';
      var bd = document.getElementById('buttonsdiv');
      if ((resp === null) || (resp.err === null)) {
        cb('err','error in eventpage code');
      } else if (resp.err == 'OK') {
        var data = {};
        try {
          resp.text += "\n";
          data = JSON.parse(resp.text);
          removeChildrenReplaceWith(bd, []);
          log(resp.text);
        } catch(e) {
          removeChildrenReplaceWith(bd, [errmsg]);
          log("Button JSON parse error");
          log(e);
          cb(e,resp.txt);
          return;
        }
        elaborateConfigSelector(data,cb);
      } else {
        removeChildrenReplaceWith(bd, [errmsg]);
        cb('err',resp.status);
      }
    }
  );
}

function elaborateConfigSelector(data,cb) {
  var selector = document.getElementById('confselect');

  for(var i=selector.options.length-1; i>=0 ;i--) {
     selector.remove(i);
  }

  var current_url = document.getElementById('configsrc').value;

  var opt = document.createElement('option');
  opt.id = 'selIdx_0';
  opt.value = current_url;
  opt.text= "Use currently set config.";
  selector.options.add(opt);

  var set_value = null;
  for (i=0;i<data.length;i++) {
    opt = document.createElement('option');
    opt.id = 'selIdx_' + (i+1).toString();
    opt.value = data[i].url;
    opt.text= data[i].description;
    opt.setAttribute('short-name',data[i].name);
    console.log('thingy: ' + data[i].url + ' current: ' + current_url);
    if (data[i].url === current_url) {
        set_value = i +1;
    }
    selector.addEventListener('change',selectConfig);
    selector.options.add(opt);
  }
  if (set_value !== null) {
      selector.selectedIndex = set_value;
  }
  cb('null','yay!');
}

// since this is static, it should probably be done in straight
// html
function createStyleSuggestions() {    
    // attempt to populate a datalist
    styleelem = document.getElementById('styleinput');
    list = document.getElementById('style_suggestions');
    if (list === null) {
        list = document.createElement('datalist');
        list.id = 'style_suggestions';
        document.getElementById('inputstylediv').appendChild(list);
        var some_styles = [
            'color: red;',
            'color: blue;',
            'color: purple;',
            'color: green;',
            'background-color: yellow;',
            'background-color: #e6dd93;',
            'background-color: black; color: white;',
            'background-color: #050556; color: white;',
            'color: #f8ded2; background-color: #6f402a;',
            'font-size: 80%;',
            'font-size: 120%;',
            'font-style: italic;',
            'font-style: bold;',
            'text-decoration: overline;',
            'text-decoration: underline;',
            'text-decoration: strikethrough;',
        ];
        for (var i=0; i<some_styles.length; i++) {
            var opt = document.createElement('option');
            opt.value = some_styles[i];
            list.appendChild(opt);
        }
    }
    styleelem.setAttribute('list','style_suggestions');
    styleelem.setAttribute('autocomplete','off');
} 

function restorePluginOptions() {
  log('restorePluginOptions START');

  getCannedList(dumb_cb);
  log('restorePluginOptions buttons created ');

  chrome.storage.local.get(['config_source'], function(items) {
    srcelem = document.getElementById('configsrc');
    if (items.hasOwnProperty('config_source')) {
      srcelem.value = items.config_source;
    } else {
      log('resetting config_source in restorePluginOptions');
      chrome.storage.local.set({'config_source': defaults.config_source},
              function() {});
      srcelem.value = defaults.config_source;
    }
    if (srcelem.value == '__local__') {
      document.getElementById('editmode_lock').checked = true;
      editModeClick('lock');
    } else {
      editModeClick('url');
    }
  });

  loadConfig(showConfig);

  vars_to_get = ['insult_style','brevity','use_matic', 'replace_fraction', 
                 'brackets', 'rand_mode', 'kittenize','run_anywhere',
                 'track_mutations'];
  chrome.storage.local.get(vars_to_get, function(items) {

      var restoreThing = function(name,inpname,checkbox = false) {
          var thingelem = document.getElementById(inpname);
          log(inpname);
          log(thingelem);
          if (items.hasOwnProperty(name)) {
              if (checkbox) {
                  thingelem.checked = items[name];
              } else {
                  thingelem.value = items[name];
              }
          } else {
              chrome.storage.local.set({name:defaults[name]}, function() {
                  if (checkbox) {
                      thingelem.checked = defaults[name];
                  } else {
                      thingelem.value = defaults[name];
                  }
              });
          }
      };

      var restorethings = [
        [ 'insult_style',    'styleinput',       false ],
        [ 'brevity',         'brevityinput',     false ],
        [ 'use_matic',       'use_matic',        false ],
        [ 'replace_fraction','replace_fraction', false ],
        [ 'brackets',        'quoteinput',       false ],
        [ 'rand_mode',       'randmodeinput',    false ],
        [ 'kittenize',       'kittensel',        false ],
        [ 'run_anywhere',    'run_anywhere',     true  ],
        [ 'track_mutations', 'track_mutations',  true  ],
      ];

      for (var i=0;i <restorethings.length; i++)
          restoreThing.apply(this,restorethings[i]);

      // if this fails, then the browser didn't support data lists 
      // anyway
      try {
          createStyleSuggestions();
      } catch (e) {
          log('oh well');
          log(e);
      }

  });

  log('restorePluginOptions DONE');

}

function saveEnabledActions() {
  log('saveEnabledActions');
  var enelem = document.getElementById('actionstd');
  var children = enelem.childNodes;
  enabled = {};
  for (var i=0;i<children.length;i++) {
    var groupdiv = children[i];
    var divchildren = groupdiv.childNodes;
    for (var j=0;j<divchildren.length; j++) {
      var cbox = divchildren[j];
      if (cbox.nodeName === 'INPUT') {
        var m = cbox.id.match(/^([\w-]+)_check/);
        if (m) {
          var action = m[1];
          enabled[action] = cbox.checked;
        }
      }
    }
  }
  chrome.storage.local.set({'enabled_actions': enabled}, function() {
   log(enabled);
   log('saved action changes');
  });
}


function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function showEnabledActionsList(items,cfg_actions) {
      log('showEnabledActionsList()');
      var enelem = document.getElementById('actionstd');

      var enabled = {};
      var action;
      var enable_this = true;
      var i;

      var action_names = Object.keys(cfg_actions);

      if (true) {
          // NEW way to handle enabled actions:
          // get a list of actions that the user can enable or disable.
          // if the user has a preference already stored for an action of 
          // that name, use it, otherwise set it to enabled.
          for (i=0; i<action_names.length; i++) {
              action =action_names[i];
              enable_this = true;
              if (items.hasOwnProperty('enabled_actions') &&
                  items.enabled_actions.hasOwnProperty(action)) {
                  enable_this = items.enabled_actions[action];
              } else if (cfg_actions[action].hasOwnProperty('default_enabled')) {
                  enable_this = Boolean(cfg_actions[action].default_enabled);
              }
              enabled[action] = enable_this;
          }
      } else { 
          // OLD way to handle enabled actions. Keeping around in case I 
          // want to go back.
          // first, check to see if the list of actions in the config even matches
          // the list of enabled actions stored. If it does, keep the stored list,
          // but if it doesn't, reset the stored list to what is in the config
          // (with everything enabled)
          var enabled_exist_list = [];
          if (items.hasOwnProperty('enabled_actions')) {
              enabled_exist_list = Object.keys(items.enabled_actions);
          }
          var config_and_stored_actions_match = arraysEqual(action_names, enabled_exist_list);

          if (!config_and_stored_actions_match) {
              log('resetting actions list from config');
              for (i=0; i<action_names.length; i++) {
                  action = action_names[i];
                  enabled[action] = true;
              }   
              chrome.storage.local.set({'enabled_actions': enabled},function() {
                  log('stored reset enabled actions');
              });
          } else {
              for (i=0; i<action_names.length; i++) {
                  action = action_names[i];
                  enable_this = true;
                  if (items.hasOwnProperty('enabled_actions') && 
                      items.enabled_actions.hasOwnProperty(action)) {
                      enable_this = items.enabled_actions[action];
                  }
                  enabled[action] = enable_this;
              }    
          }
      }

      removeChildrenReplaceWith(enelem,[]);
      for (i=0; i<action_names.length; i++) {
        action = action_names[i];
        var label_elem = document.createElement('span');
        label_elem.textContent = action + ' ';
        var check_elem = document.createElement('input');
        check_elem.type = 'checkbox';
        check_elem.name = action + '_check';
        check_elem.value = action;
        check_elem.id = action + '_check';
        check_elem.checked = enabled[action];
        check_elem.onchange = saveEnabledActions;
        var groupingdiv = document.createElement('div');
        groupingdiv.appendChild(label_elem);
        groupingdiv.appendChild(check_elem);
        groupingdiv.style.display = 'inline-block';
        enelem.appendChild(groupingdiv);
        if (i !== action_names.length-1) {
          var pipe_elem = document.createElement('span');
          pipe_elem.textContent = ' | ';
          enelem.appendChild(pipe_elem);
        }

      }
}

function showConfig(err,res) {
  log('showConfig START');
  var jselem = document.getElementById('configjson');
  var urlem =  document.getElementById('configsrc');
  chrome.storage.local.get(['config_source','stored_config_source','enabled_actions'],function(items) {

    if (items.hasOwnProperty('config_source')) {
      urlem.value = items.config_source;
    }

    if (err === null) {
      log('no error');
      // this is here rather than in earlier in restorePluginOptions
      // becauase generating this list requires the config as well as
      // the plugin options
      showEnabledActionsList(items,res.actions);
      jselem.value = JSON.stringify(res,null,2);
    } else {
      log('error');
      jselem.value = "ERROR:" + err;
    }
    log('showConfig DONE');
  });
}

function saveGen(name,inpname,checkbox = false) {
 log('saving ' + name);
 var elem = document.getElementById(inpname);
 var v;
 if (checkbox) {
   v = elem.checked;
 } else {
   v = elem.value;
 }
 var sv = {};
 sv[name] = v;

 chrome.storage.local.set(sv,function() {
  log(name + ' saved');
 });
}

var savethings = [
  // [ elemid, event, fn ],
  [ 'config_save_button', 'click',  saveConfigURL ],
  [ 'configsrc',          'change', saveConfigURL ],
  [ 'style_save_button',  'click',  function() { saveGen('insult_style',
                                                         'stlyeinput'); } ],
  [ 'styleinput',         'change', function() { saveGen('insult_style',
                                                         'styleinput'); } ],
  [ 'brevityinput',       'change', function() { saveGen('brevity',
                                                         'brevityinput'); } ],
  [ 'use_matic',          'change', function() { saveGen('use_matic',
                                                         'use_matic'); } ],
  [ 'replace_fraction',   'change', function() { saveGen('replace_fraction',
                                                         'replace_fraction'); } ],
  [ 'quoteinput',         'change', function() { saveGen('brackets',
                                                         'quoteinput'); } ],
  [ 'randmodeinput',      'change', function() { saveGen('rand_mode',
                                                         'randmodeinput'); } ],
  [ 'kittensel',          'change', function() { saveGen('kittenize',
                                                         'kittensel'); } ],
  [ 'run_anywhere',       'change', function() { saveGen('run_anywhere',
                                                         'run_anywhere',
                                                         true); } ],
  [ 'track_mutations',    'change', function() { saveGen('track_mutations',
                                                         'track_mutations',
                                                         true);} ],
  [ 'reset_storage',      'click',  resetStorage ],
];

function saveConfigURL() {
  log('saveConfigURL START');
  var srcelem = document.getElementById('configsrc');
  var url = srcelem.value;
  // if it's set to local, then it was set by the 'lock' button
  // after validating and we should not do so here just because
  // someone types __local__ into the url bar.
  if (srcelem.value != '__local__') {
    chrome.storage.local.set(
      {'config_source': url,
       'config_valid': false,
       'config_date': 0
      },
      function() {
        log('config_source saved');
      });
  }

  loadConfig(showConfig);
  restorePluginOptions();
  log('saveConfigURL DONE');
}

function editModeClick(which) {
 log('editModeClick: ' + which);
 cfjson = document.getElementById('configjson');
 urlinp = document.getElementById('configsrc');
 if (which == 'url') {

   cfjson.readOnly = true;
   cfjson.style.backgroundColor = "#e0f0e0";
   urlinp.readOnly = false;
   urlinp.style.backgroundColor = '#ffffff';

   // reset to default
   var src = urlinp.value;
   if (src == '__local__') {
     src = defaults.config_source;
     urlinp.value = src;
   }
   chrome.storage.local.set({'config_source': src, 'config_valid': false}, function() {
     loadConfig(showConfig,true);
   });

 } else if (which == 'edit') {

   cfjson.readOnly = false;
   cfjson.style.backgroundColor = "#f0f0e0";
   urlinp.readOnly = true;
   urlinp.style.backgroundColor = '#d0d0d0';

 } else if (which == 'lock') {

   cfjson.readOnly = true;
   cfjson.style.backgroundColor = "#f0e0e0";
   urlinp.readOnly = true;
   urlinp.style.backgroundColor = '#d0d0d0';

   storeConfig(null,cfjson.value,function(err) {
     if (err === null) {
       log('setting to __local__');
       urlinp.value = '__local__';
       chrome.storage.local.set({'config_source': '__local__'}, function() {
         loadConfig(showConfig,false);
       });
     } else {
       log('custom json did not validate');
       log('NOT setting to __local__');
     }
   });
 }
}


function setup_handlers() {

  log('adding handlers');
  document.addEventListener('DOMContentLoaded', restorePluginOptions);
  log('adding save handler');

  for (var i=0; i<savethings.length; i++) {
    var st = savethings[i];
    document.getElementById(st[0]).addEventListener(st[1], st[2]);
  }

  log('adding radiobutton handler');
  var edit_radios = document.forms.editmodeform.elements.editmode;
  for (var j=0;j<edit_radios.length;j++) {
    radio = edit_radios[j];
    /*jshint loopfunc:true */
    radio.onchange = function(ev) {
      editModeClick(ev.target.value);
    };
  }

  document.getElementById('showconfigcheck').addEventListener('change', function(ev) {
    var configdiv = document.getElementById('configdiv');
    var tgt = ev.target || ev.srcElement;
    if (tgt.checked) {
        configdiv.style.display = 'block';
    } else {
        configdiv.style.display = 'none';
    }
  });
}


setup_handlers();

