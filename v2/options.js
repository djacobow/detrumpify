
set_initial_url(function(src) { log('set_initial_url cb: ' + src); });

function selectConfig(e) {
  var tgt = e.target || e.srcElement;
  var id  = tgt.id;
  var new_url = tgt.value;
  log('selectConfig(): ' + new_url);
  var srcelem = document.getElementById('configsrc');
  var curr_url = srcelem.value;

  if (new_url !== curr_url) {
      modeclick('url');
      document.getElementById('editmode_url').checked = true;
      srcelem.value = new_url;
      save_config_options();
  }
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
      var bd = document.getElementById('buttonsdiv');
      if ((resp === null) || (resp.err === null)) {
        cb('err','error in eventpage code');
      } else if (resp.err == 'OK') {
        var data = {};
        try {
          resp.text += "\n";
          data = JSON.parse(resp.text);
          bd.innerHTML = '';
          log(resp.text);
        } catch(e) {
          bd.innerHTML = '<p>Could not load button metadata. How is our Internet connection?</p>';
          log("Button JSON parse error");
          log(e);
          cb(e,resp.txt);
          return;
        }
        elaborate_selector(data,cb);
      } else {
        bd.innerHTML = '<p>Could not load button metadata. How is our Internet connection?</p>';
        cb('err',resp.status);
      }
    }
  );
}

function elaborate_selector(data,cb) {
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

  var set_value = false;
  for (i=0;i<data.length;i++) {
    opt = document.createElement('option');
    opt.id = 'selIdx_' + (i+1).toString();
    opt.value = data[i].url;
    opt.text= data[i].description;
    opt.setAttribute('short-name',data[i].name);
    if (data[i].url === current_url) {
        set_value = opt.value;
    }
    selector.addEventListener('change',selectConfig);
    selector.options.add(opt);
  }
  if (set_value) {
      selector.value = set_value;
  }
  cb('null','yay!');
}

function restore_plugin_options() {
  log('restore_plugin_options START');

  getCannedList(dumb_cb);
  log('restore_plugin_options buttons created ');

  chrome.storage.local.get(['insult_style'], function(items) {
    styleelem = document.getElementById('styleinput');
      if ('insult_style' in items) {
          styleelem.value = items.insult_style;
      } else {
          chrome.storage.local.set({'insult_style': defaults.insult_style},
              function() {});
          styleelem.value = defaults.insult_style;
      }
  });

  chrome.storage.local.get(['config_source'], function(items) {
    srcelem = document.getElementById('configsrc');
    if ('config_source' in items) {
      srcelem.value = items.config_source;
    } else {
      log('resetting config_source in restore_plugin_options');
      chrome.storage.local.set({'config_source': defaults.config_source},
              function() {});
      secelem.value = defaults.config_source;
    }
    if (srcelem.value == '__local__') {
      document.getElementById('editmode_lock').checked = true;
      modeclick('lock');
    } else {
      modeclick('url');
    }
  });
  loadConfig(showConfig);
  log('restore_plugin_options DONE');
}

function showConfig(err,res) {
  log('showConfig START');
  var jselem = document.getElementById('configjson');
  var urlem =  document.getElementById('configsrc');
  chrome.storage.local.get(['config_source'],function(items) {
   if ('config_source' in items) {
     urlem.value = items.config_source;
   }
  });

  if (err === null) {
    log('no error');
    jselem.value = JSON.stringify(res,null,2);
  } else {
    log('error');
    jselem.value = "ERROR:" + err;
  }
  log('showConfig DONE');
}

function save_style() {
  var styleelem = document.getElementById('styleinput');
  var style = styleelem.value;
  chrome.storage.local.set(
    {'insult_style': style,
    },
    function() {
      log('style saved');
    });
}

function save_config_options() {
  log('save_config_options START');
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
  log('save_config_options DONE');
}

function modeclick(which) {
 log('modeclick: ' + which);
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
  document.addEventListener('DOMContentLoaded', restore_plugin_options);
  log('adding save handler');
  document.getElementById('config_save_button').addEventListener('click',save_config_options);
  document.getElementById('configsrc').addEventListener('keypress',function(ev) {
    if (ev.keyCode === 13) {
      save_config_options();
    }
  });
  document.getElementById('style_save_button').addEventListener('click',save_style);
  document.getElementById('styleinput').addEventListener('keypress',function(ev) {
    if (ev.keyCode === 13) {
      save_style();
    }
  });

  log('adding radiobutton handler');
  var edit_radios = document.forms.editmodeform.elements.editmode;
  for (var i=0;i<edit_radios.length;i++) {
    radio = edit_radios[i];
    /*jshint loopfunc:true */
    radio.onchange = function(ev) {
      modeclick(ev.target.value);
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

