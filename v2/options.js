function log(t) {
  sd = document.getElementById('statusdiv');
  sd.innerText += t + "\n";
}

//var url_base = 'http://localhost:8000/';
var url_base = 'http://toolsofourtools.org/detrumpify2/';

var defaults = {
  'config_source': url_base + "clean.json",
  'buttons': [
   [ 'NSFW+Clean quoted', url_base + 'combined-scare.json' ],
   [ 'NSFW quoted', url_base + 'dirty-scare.json' ],
   [ 'Clean quoted', url_base + 'clean-scare.json' ],
   [ 'NSFW+Clean unquoted', url_base + 'combined.json' ],
   [ 'NSFW unquoted', url_base + 'dirty.json' ],
   [ 'Clean unquoted', url_base + 'clean.json' ]
  ]
};


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
    nb.addEventListener('click',selectConfig);
    bd.appendChild(nb);
  };

  log('restore_plugin_options buttons created ');
  chrome.storage.local.get(['config_source','data_valid'], function(items) {
    srcelem = document.getElementById('configsrc');
    if ('config_source' in items) {
      srcelem.value = items.config_source;
    } else {
      chrome.storage.local.set({'config_source': defaults.config_source},
		      function() {});
      secelem.value = defaults.config_source;
    };
  });
  log('restore_plugin_options DONE');
};

function save_plugin_options() {
  log('save_plugin_options');
  var srcelem = document.getElementById('configsrc');
  chrome.storage.local.set({'config_source': srcelem.value}, function() {});
  chrome.storage.local.set({'config_valid': false}, function() {});
  chrome.storage.local.set({'config_date': 0.0}, function() {});
};

/*
 // doesn't work yet
 
function force_config_load() {
  log('force_config_load');
  chrome.runtime.sendMessage({ 'message': 'load_config' }, function(a,b) {
    log('got response');
    log(a);
    log(b);
  });
};
document.getElementById('loadbutton').addEventListener('click',force_config_load);
*/

log('adding handlers');
document.addEventListener('DOMContentLoaded', restore_plugin_options);
log('adding save handler');
document.getElementById('savebutton').addEventListener('click',save_plugin_options);

	
