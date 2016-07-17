
set_initial_url();

function selectConfig(e) {
  var tgt = e.target || e.srcElement;
  var id  = tgt.id;
  var idx = parseInt(id.substr(7,id.length-1));
  var url = tgt.getAttribute('data-url');
  log('selectConfig(): ' + url);
  srcelem = document.getElementById('configsrc');
  srcelem.value = url;
  modeclick('url');
  document.getElementById('editmode_url').checked = true;
  save_plugin_options();
}

function dumb_cb(err,msg) {
 console.log('dumb_cb');
}

function getCannedList(cb) {
  chrome.runtime.sendMessage(
    null,
    {'cmd':'get',
    'url': defaults.buttons_fetch_url, },
    null,
    function(resp) {
      if ((resp == null) || (resp.err == null)) {
        cb('err','error in eventpage code');
      } else if (resp.err == 'OK') {
        var data = {};
        try {
          resp.text += "\n";
          data = JSON.parse(resp.text);
          log(resp.text);
        } catch(e) {
          log("Button JSON parse error");
          log(e);
          cb(e,resp.txt);
          return;
        }
        elaborate_canned_buttons(data,cb);
      } else {
        cb('err',resp.status);
      }
      var bd = document.getElementsById('buttonsdiv');
      bd.innerHTML = '<p>Could not load button metadata. How is our Internet connection?</p>';
    }
  );
}

function elaborate_canned_buttons(data,cb) {
  bd = document.getElementById('buttonsdiv');
  bd.innerHTML = '';
  for (var i=0;i<data.length;i++) {
    log('added button');
    var nb = document.createElement('input');
    nb.type = 'button';
    nb.id = 'btnIdx_' + i;
    nb.value = data[i]['name'];
    nb.title = data[i]['description'];
    nb.setAttribute('data-url',data[i]['url']);
    nb.addEventListener('click',selectConfig);
    bd.appendChild(nb);
  };
  cb('null','yay!');
}

function restore_plugin_options() {
  log('restore_plugin_options START');

  getCannedList(dumb_cb);
  log('restore_plugin_options buttons created ');

  chrome.storage.local.get(['config_source'], function(items) {
    srcelem = document.getElementById('configsrc');
    if ('config_source' in items) {
      srcelem.value = items.config_source;
    } else {
      log('resetting config_source in restore_plugin_options');
      chrome.storage.local.set({'config_source': defaults.config_source},
              function() {});
      secelem.value = defaults.config_source;
    };
    if (srcelem.value == '__local__') {
      document.getElementById('editmode_lock').checked = true;
      modeclick('lock');
    } else {
      modeclick('url');
    }
  });
  loadConfig(showConfig);
  log('restore_plugin_options DONE');
};

function showConfig(err,res) {
  log('showConfig START');
  var jselem = document.getElementById('configjson');
  var urlem =  document.getElementById('configsrc');
  chrome.storage.local.get(['config_source'],function(items) {
   if ('config_source' in items) {
     urlem.value = items.config_source;
   }
  });

  if (err == null) {
    log('no error');
    jselem.value = JSON.stringify(res,null,2);
  } else {
    log('error');
    jselem.value = "ERROR:" + err;
  }
  log('showConfig DONE');
};

function save_plugin_options() {
  log('save_plugin_options START');
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
  };

  loadConfig(showConfig);
  log('save_plugin_options DONE');
};

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
   };
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
     if (err == null) {
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
  document.getElementById('savebutton').addEventListener('click',save_plugin_options);

  log('adding radiobutton handler');
  var edit_radios = document.forms['editmodeform'].elements['editmode'];
  for (var i=0;i<edit_radios.length;i++) {
    radio = edit_radios[i];
    radio.onchange = function(ev) {
      modeclick(ev.target.value);
    }
  }
}


setup_handlers();

