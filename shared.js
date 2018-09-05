/*jshint esversion:6 */
var debug_mode = true;

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
            chrome.runtime.sendMessage(
                null, {
                    'cmd': 'get',
                    'url': settings.config_source
                },
                null,
                function(resp) {
                    if ((resp === null) || (resp.err === null)) {
                        if (false) {
                            log('resetting config_source at set_initial_url');
                            source = defaults.config_source;
                            chrome.storage.local.set({
                                'config_source': source
                            }, function() {
                                cb('err', 'error in eventpage code');
                            });
                        } else {
                            cb('err', 'error in eventpage code');
                        }
                    } else if (resp.err == 'OK') {
                        storeConfig(null, resp.text, cb);
                    } else {
                        cb('err', resp.status);
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
