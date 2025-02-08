/*jshint esversion:6 */
var debug_mode = false;

var log_count = 0;

function log(t) {
    try {
        sd = document.getElementById('statusdiv');
        sd.innerText += '(' + log_count + '): ' + t + "\n";
        sd.scrollTop = sd.scrollHeight;
        log_count += 1;
    } catch (e) {}
    if (debug_mode) {
        console.log(t);
    }
}

var statusOK = function(xhr) {
    var s = xhr.status;
    var ok = (s === 0) || ((s >= 200) && (s < 300));
    return ok;
};

var doGet = function(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        // console.log(xhr);
            rv = {};
            rv.text = xhr.responseText;
            rv.status = xhr.status;
            rv.err = statusOK(xhr) ? 'OK' : 'not_2xx';
        // console.log(rv);
            cb(rv);
        }
    };
    var source = url;
    // extra weirdness to force dropbox to download rather than page,
    // and the date to force no cache
    source += '?dl=1&_=' + (new Date()).getTime();
    xhr.open('GET', source, true);
    xhr.send();
    //
    // to tell chrome to let us call the cb after
    // returning we must return true;
    return true;
}

// sets the initial stored url for configuration fetching
// if it is not already set. It also stores it to the local store.
function set_initial_url(cb) {
    var source = null;
    chrome.storage.local.get(['config_source'], function(items) {
        if (items.hasOwnProperty('config_source')) {
            source = items.config_source;
            cb(source);
        } else {
            log('resetting config_source at set_initial_url');
            source = defaults.config_source;
            chrome.storage.local.set({
                'config_source': source
            }, function() {
                cb(source);
            });
        }
    });
}

function zapStorage(cb) {
    chrome.storage.local.clear(function() {
        set_initial_url(cb);
    });
}


// send a message to an event page to have it do an xhr for us
var loadConfigRemote = function(settings, cb) {
    if (true) {
        if (settings.hasOwnProperty('config_source')) {
            doGet(settings.config_source, function(resp) {
                var resp_exists = resp && resp.hasOwnProperty('err');
                var resp_ok = resp_exists && (resp.err == 'OK');
                var resp_nok = resp_exists && (resp.err != 'OK');
                if (resp_ok) {
                    storeConfig(null, resp.text, cb);
                } else if (resp_nok) {
                    cb('err', resp.status);
                } else {
                    cb('err', 'error in eventpage code');
                }
            });
        } else {
            cb('err', 'no config source');
        }
    }
};


function loadConfig(settings, cb, try_remote = true) {
    log('loadConfig START');
    if (true) {
        log('loadConfig readLocal');
        var now = (new Date()).getTime();
        var have_config = settings.hasOwnProperty('config_valid') && settings.config_valid;
        var max_age = defaults.max_age;
        if (have_config) {
            if (settings.cfgdata.hasOwnProperty('refresh_age')) {
                max_age = settings.cfgdata.refresh_age;
            }
        }
        // if max_age is set to negative then we never refresh
        var use_stored = max_age < 0 ? true :
            ((now - settings.config_date) < max_age);

        if (have_config && use_stored) {
            log('loading from local storage');
            cb(null, settings.cfgdata);
        } else if (try_remote) {
            log('calling loadConfigRemote');
            loadConfigRemote(settings, cb);
        } else {
            log('loadConfig FAILED');
            cb('load_config_failed');
        }
    }
    log('loadConfig DONE');
}
 

function storeConfig(err, txt, cb) {
    log("storeConfig START");
    if (err !== null) {
        cb(err, txt);
        return;
    }

    var data = {};

    try {
        data = JSON.parse(txt);
    } catch (e) {
        log("JSON parse error");
        log(e);
        cb(e, txt);
        return;
    }

    if (data.schema.match(/InsultMarkupLanguage\/0.\d/)) {
        chrome.storage.local.set({
            'cfgdata': data
        }, function() {
            if (chrome.lastError) {
                log('error storing configdata');
                cb(chrome.lastError);
            } else {
                date = (new Date()).getTime();
                chrome.storage.local.set({
                        'config_date': date,
                        'config_valid': true,
                        'last_chosen_time': 0
                    },
                    function() {
                        log("STORE SUCCESS");
                        chrome.storage.local.get(null, function(settings) {
                            loadConfig(settings, cb, false);
                        });
                    }
                );
            }
        });
    }
}

function copyDictByKeys(dst, src) {
    var ks = Object.keys(src);
    for (var i = 0; i < ks.length; i++) {
        dst[ks[i]] = src[ks[i]];
    }
}

function createAndSetStyle(name, style_text) {
    var style_element_id = 'detrumpify_style_element';
    var se = document.getElementById(style_element_id);
    if (se === null) {
        se = document.createElement('style');
        se.setAttribute('id', style_element_id);
        se.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(se);
    }
    se.textContent = name + ' { ' + style_text + ' } ';
}

function removeChildrenReplaceWith(elem, newchildren) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
    for (var i = 0; i < newchildren.length; i++) {
        elem.appendChild(newchildren[i]);
    }
}

function useIfElse(dict, name, deflt) {
    return dict.hasOwnProperty(name) ? dict[name] : deflt;
}

function replace_elem_with_array_of_elems(orig, arry) {
    // log('replace_elem_with_array_of_elems');
    var newnode = document.createElement('span');
    for (var k = 0; k < arry.length; k++) {
        newnode.appendChild(arry[k]);
    }
    orig.parentNode.replaceChild(newnode, orig);
}
