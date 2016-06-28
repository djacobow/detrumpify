
set_initial_url();

function selectConfig(e) {
  var tgt = e.target || e.srcElement; 
  var id  = tgt.id;
  var idx = parseInt(id.substr(7,id.length-1));
  var url = defaults.buttons[idx][1];
  log(url);
  srcelem = document.getElementById('configsrc');
  srcelem.value = url;
  save_plugin_options();
}


function restore_plugin_options() {
  log('restore_plugin_options START');

  bd = document.getElementById('buttonsdiv');
  bd.innerHTML = '';
  for (var i=0;i<defaults.buttons.length;i++) {
    log('added button');
    var nb = document.createElement('input');
    nb.type = 'button';
    nb.id = 'btnIdx_' + i;
    nb.value = defaults.buttons[i][0];
    nb.title = defaults.buttons[i][2];
    nb.addEventListener('click',selectConfig);
    bd.appendChild(nb);
  };

  log('restore_plugin_options buttons created ');

  chrome.storage.local.get(['config_source'], function(items) {
    srcelem = document.getElementById('configsrc');
    if ('config_source' in items) {
      srcelem.value = items.config_source;
    } else {
      chrome.storage.local.set({'config_source': defaults.config_source},
		      function() {});
      secelem.value = defaults.config_source;
    };
  });
  loadConfig(showConfig);
  log('restore_plugin_options DONE');
};

function showConfig(err,res) {
  log('showConfig START');
  var jselem = document.getElementById('configjson');  
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
  chrome.storage.local.set({'config_source': srcelem.value}, function() {});
  chrome.storage.local.set({'config_valid': false}, function() {});
  chrome.storage.local.set({'config_date': 0.0}, function() {});

  loadConfig(showConfig);
  log('save_plugin_options DONE');
};

log('adding handlers');
document.addEventListener('DOMContentLoaded', restore_plugin_options);
log('adding save handler');
document.getElementById('savebutton').addEventListener('click',save_plugin_options);

	
