/*jshint esversion:6 */
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

var OptionsThingy = function() {
    this.current_settings = {};
    this.some_styles = [
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
    this.restorethings = [
        ['imgreplsrc', 'imgreplsrcinput', false],
        ['insult_style', 'styleinput', false],
        ['brevity', 'brevityinput', false],
        ['use_matic', 'use_matic', false],
        ['breaking_fract', 'breaking_fract', false],
        ['replace_fraction', 'replace_fraction', false],
        ['brackets', 'quoteinput', false],
        ['rand_mode', 'randmodeinput', false],
        ['site_filter', 'site_filter', false],
        ['track_mutations', 'track_mutations', true],
        ['user_blacklist', 'user_blacklist', false],
        ['user_whitelist', 'user_whitelist', false],
    ];
    var tthis = this;
    this.savethings = [
        // [ elemid, event, fn ],
        ['imgreplsrcinput', 'change', function() {
            tthis.saveImgReplURL();
        }],
        ['imgrepl_save_button', 'click', function() {
            tthis.saveImgReplURL();
        }],
        ['config_save_button', 'click', function() {
            tthis.saveConfigURL();
        }],
        ['configsrc', 'change', function() {
            tthis.saveConfigURL();
        }],
        ['style_save_button', 'click', function() {
            tthis.saveGen('insult_style',
                'styleinput');
        }],
        ['styleinput', 'change', function() {
            tthis.saveGen('insult_style',
                'styleinput');
        }],
        ['brevityinput', 'change', function() {
            tthis.saveGen('brevity',
                'brevityinput');
        }],
        ['use_matic', 'change', function() {
            tthis.saveGen('use_matic',
                'use_matic');
        }],
        ['breaking_fract', 'change', function() {
            tthis.saveGen('breaking_fract',
                'breaking_fract');
        }],
        ['replace_fraction', 'change', function() {
            tthis.saveGen('replace_fraction',
                'replace_fraction');
        }],
        ['quoteinput', 'change', function() {
            tthis.saveGen('brackets',
                'quoteinput');
        }],
        ['randmodeinput', 'change', function() {
            tthis.saveGen('rand_mode',
                'randmodeinput');
        }],
        ['site_filter', 'change', function() {
            tthis.grayWhitelist();
            tthis.saveGen('site_filter',
                'site_filter',
                false);
        }],
        ['track_mutations', 'change', function() {
            tthis.saveGen('track_mutations',
                'track_mutations',
                true);
        }],
        ['user_blacklist', 'change', function() {
            tthis.saveGen('user_blacklist',
                'user_blacklist',
                false);
        }],
        ['user_whitelist', 'change', function() {
            tthis.saveGen('user_whitelist',
                'user_whitelist',
                false);
        }],
        ['blacklist_save_button', 'click', function() {
            neatenList('user_blacklist');
            tthis.saveGen('user_blacklist',
                'user_blacklist',
                false);
        }],
        ['whitelist_save_button', 'click', function() {
            neatenList('user_whitelist');
            tthis.saveGen('user_whitelist',
                'user_whitelist',
                false);
        }],
        ['blacklist_add_button', 'click', function() {
            getCurrentWindowHost((host) => {
                if (host) {
                    neatenList('user_blacklist',host);
                    tthis.saveGen('user_blacklist',
                        'user_blacklist',
                        false);
                }
            });

        }],
        ['whitelist_add_button', 'click', function() {
            getCurrentWindowHost((host) => {
                if (host) {
                    neatenList('user_whitelist',host);
                    tthis.saveGen('user_whitelist',
                        'user_whitelist',
                        false);
                }
            });

        }],
        ['whitelist_addconfig_button', 'click', function() {
            var configwhitelist = tthis.getConfigWhitelist();
            if (configwhitelist) {
                document.getElementById('user_whitelist').value = 
                    configwhitelist;
                neatenList('user_whitelist');
                tthis.saveGen('user_whitelist', 'user_whitelist', false);
            }
        }],
        ['reset_storage', 'click', function() {
            tthis.resetStorage();
        }],
        ['save_edited_config', 'click', function() {
            tthis.save_config_edits();
        }],
    ];
};

OptionsThingy.prototype.grayWhitelist = function() {

    var use_whitelist = 
        document.getElementById('site_filter').value == 'use_whitelist';

    [
        [ 'whitelist_save_button', false, ],
        [ 'whitelist_add_button', false, ],
        [ 'whitelist_addconfig_button', false, ],
        [ 'wl_td', false, ],
        [ 'user_whitelist', false, ],
        [ 'blacklist_save_button', true, ],
        [ 'blacklist_add_button', true, ],
        [ 'user_blacklist', true, ],
        [ 'bl_td', true, ],
    ].forEach((n) => {
        var disable = (use_whitelist && n[1]) || (!use_whitelist && !n[1]);
        var el = document.getElementById(n[0]);
        el.disabled  = disable ? true : false;
        el.className = disable ? 'disabled' : '';
        // console.log(disable,el.disabled,el.className,el.id);
    });
};

OptionsThingy.prototype.getConfigWhitelist = function() {
    if (this.current_settings && this.current_settings.cfgdata &&
        this.current_settings.cfgdata.whitelist) {
        return this.current_settings.cfgdata.whitelist.join(' ');
    }
    return null;
};

var neatenList = function(listname, to_add = null) {
    var bl = document.getElementById(listname);
    if (to_add) bl.value += ' ' + to_add;
    var il = bl.value.split(/[^\w\.-]+/)
        .map((x) => { return x.trim(); })
        .filter((x) => { return x.length; });
    var id = {};
    il.forEach((i) => { id[i] = 1; });
    il = Object.keys(id).sort();
    bl.value = il.join(' ');
    return il;
};

OptionsThingy.prototype.storeThings = function(dict, cb) {
    var tthis = this;
    chrome.storage.local.set(dict, function() {
        copyDictByKeys(tthis.current_settings, dict);
        return cb(tthis.current_settings);
    });
};

OptionsThingy.prototype.selectConfig = function(e) {
    this.genericSelect(e, 'configsrc', this.saveConfigURL.bind(this));
};

OptionsThingy.prototype.selectImgReplConfig = function(e) {
    this.genericSelect(e, 'imgreplsrcinput', this.saveImgReplURL.bind(this));
};

OptionsThingy.prototype.genericSelect = function(e, srcename, save_fn) {
    var tgt = e.target || e.srcElement;
    var id = tgt.id;
    var new_url = tgt.value;
    log('genericSelect(): ' + new_url);
    var srcelem = document.getElementById(srcename);
    var curr_url = srcelem.value;

    if (new_url !== curr_url) {
        srcelem.value = new_url;
        save_fn();
    }
};

OptionsThingy.prototype.save_config_edits = function() {
    var jselem = document.getElementById('configjson');
    var jsontext = jselem.value;
    var new_config = null;
    try {
        new_config = JSON.parse(jsontext);
    } catch (e) {
        log(e);
    }

    if (new_config) {
        chrome.storage.local.set({
            'cfgdata': new_config,
        }, function() {
            jselem.value = JSON.stringify(new_config,null,2);
        });
    }
};

OptionsThingy.prototype.resetStorage = function() {
    this.current_settings = {};
    var tthis = this;
    zapStorage(function(config_source) {
        tthis.current_settings.config_source = config_source;
        log('storage zapped');
        loadConfig(tthis.current_settings, function(err, res) {
            tthis.updateConfigDisplay(err, res);
            tthis.restorePluginOptions();
        });
    });
};

OptionsThingy.prototype.dumb_cb = function() {
    // log('dumb_cb');
};

OptionsThingy.prototype.getCannedConfigList = function(cb) {
    var args = ['buttonsdiv', 'confselect', 'configsrc', this.selectConfig.bind(this), defaults.buttons_fetch_url];
    this.getCannedList(args, cb);
};

OptionsThingy.prototype.getCannedImgReplList = function(cb) {
    var args = ['buttonsdiv2', 'imgreplselect', 'imgreplsrcinput', this.selectImgReplConfig.bind(this), defaults.imgrepls_fetch_url];
    this.getCannedList(args, cb);
};

OptionsThingy.prototype.getCannedList = function(targs, cb) {
    var target = document.getElementById(targs[0]);

    var tthis = this;
    doGet(targs[4], function(resp) {
            var errmsg = document.createElement('p');
            errmsg.textContent = 'Could not load button metadata. How is our Internet connection?';
            log(resp)
            if ((resp === null) || (resp.err === null)) {
                cb('err', 'error in eventpage code');
            } else if (resp.err == 'OK') {
                var data = {};
                try {
                    resp.text += "\n";
                    data = JSON.parse(resp.text);
                    removeChildrenReplaceWith(target, []);
                    log(resp.text);
                } catch (e) {
                    removeChildrenReplaceWith(target, [errmsg]);
                    log("Button JSON parse error");
                    log(e);
                    cb(e, resp.txt);
                    return;
                }
                tthis.elaborateConfigSelector(targs, data, cb);
            } else {
                removeChildrenReplaceWith(target, [errmsg]);
                cb('err', resp.status);
            }
        }
    );
};

OptionsThingy.prototype.elaborateConfigSelector = function(targs, data, cb) {
    var selector = document.getElementById(targs[1]);

    for (var i = selector.options.length - 1; i >= 0; i--) {
        selector.remove(i);
    }

    var current_url = document.getElementById(targs[2]).value;

    var opt = document.createElement('option');
    opt.id = 'selIdx_0';
    opt.value = current_url;
    opt.text = "Use currently set config.";
    selector.options.add(opt);

    var set_value = null;
    for (i = 0; i < data.length; i++) {
        opt = document.createElement('option');
        opt.id = 'selIdx_' + (i + 1).toString();
        opt.value = data[i].url;
        opt.text = data[i].description;
        opt.setAttribute('short-name', data[i].name);
        log('thingy: ' + data[i].url + ' current: ' + current_url);
        if (data[i].url === current_url) {
            set_value = i + 1;
        }
        selector.addEventListener('change', targs[3]);
        selector.options.add(opt);
    }
    if (set_value !== null) {
        selector.selectedIndex = set_value;
    }
    cb('null', 'yay!');
};

// since this is static, it should probably be done in straight
// html
OptionsThingy.prototype.createStyleSuggestions = function() {
    // attempt to populate a datalist
    styleelem = document.getElementById('styleinput');
    list = document.getElementById('style_suggestions');
    if (list === null) {
        list = document.createElement('datalist');
        list.id = 'style_suggestions';
        document.getElementById('inputstylediv').appendChild(list);
        for (var i = 0; i < this.some_styles.length; i++) {
            var opt = document.createElement('option');
            opt.value = this.some_styles[i];
            list.appendChild(opt);
        }
    }
    styleelem.setAttribute('list', 'style_suggestions');
    styleelem.setAttribute('autocomplete', 'off');
};


OptionsThingy.prototype.restorePluginOptions = function() {
    log('restorePluginOptions START');
    document.getElementById('ver').innerText = chrome.runtime.getManifest()['version'];

    this.getCannedConfigList(this.dumb_cb.bind(this));
    log('cannedConfigList options created');

    this.getCannedImgReplList(this.dumb_cb.bind(this));
    log('cannedImgReplList options created');

    var tthis = this;
    chrome.storage.local.get(null, function(settings) {

        copyDictByKeys(tthis.current_settings, settings);

        srcelem = document.getElementById('configsrc');
        if (settings.hasOwnProperty('config_source')) {
            srcelem.value = settings.config_source;
        } else {
            log('resetting config_source in restorePluginOptions');
            tthis.storeThings({
                    'config_source': defaults.config_source
                },
                function() {});
            srcelem.value = defaults.config_source;
        }

        tthis.finishRestoringOptions();
        loadConfig(tthis.current_settings, tthis.updateConfigDisplay.bind(tthis));
    });
};

OptionsThingy.prototype.finishRestoringOptions = function() {
    log('finishRestoringOptions START');
    var tthis = this;
    var restoreThing = function(name, inpname, checkbox = false) {
        var thingelem = document.getElementById(inpname);
        log(inpname);
        log(thingelem);
        if (tthis.current_settings.hasOwnProperty(name)) {
            if (checkbox) {
                thingelem.checked = tthis.current_settings[name];
            } else {
                thingelem.value = tthis.current_settings[name];
            }
        } else {
            chrome.storage.local.set({
                name: defaults[name]
            }, function() {
                if (checkbox) {
                    thingelem.checked = defaults[name];
                } else {
                    thingelem.value = defaults[name];
                }
            });
        }
    };

    for (var i = 0; i < this.restorethings.length; i++)
        restoreThing.apply(this, this.restorethings[i]);

    this.grayWhitelist();

    // if this fails, then the browser didn't support data lists anyway
    try {
        this.createStyleSuggestions();
    } catch (e) {
        log('oh well');
        log(e);
    }
    log('finishRestoringOptions DONE');
};

OptionsThingy.prototype.saveEnabledActions = function() {
    log('saveEnabledActions');
    var enelem = document.getElementById('actionstd');
    var children = enelem.childNodes;
    enabled = {};
    for (var i = 0; i < children.length; i++) {
        var groupdiv = children[i];
        var divchildren = groupdiv.childNodes;
        for (var j = 0; j < divchildren.length; j++) {
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
    this.storeThings({
        'enabled_actions': enabled
    }, function() {
        log(enabled);
        log('saved action changes');
    });
};


OptionsThingy.prototype.showEnabledActionsList = function(settings, cfg_actions) {
    log('showEnabledActionsList()');
    var enelem = document.getElementById('actionstd');

    var enabled = {};
    var action;
    var enable_this = true;
    var i;

    var action_names = Object.keys(cfg_actions);

    // NEW way to handle enabled actions:
    // get a list of actions that the user can enable or disable.
    // if the user has a preference already stored for an action of 
    // that name, use it, otherwise set it to enabled.
    for (i = 0; i < action_names.length; i++) {
        action = action_names[i];
        enable_this = true;
        if (settings.hasOwnProperty('enabled_actions') &&
            settings.enabled_actions.hasOwnProperty(action)) {
            enable_this = settings.enabled_actions[action];
        } else if (cfg_actions[action].hasOwnProperty('default_enabled')) {
            enable_this = Boolean(cfg_actions[action].default_enabled);
        }
        enabled[action] = enable_this;
    }

    removeChildrenReplaceWith(enelem, []);
    for (i = 0; i < action_names.length; i++) {
        action = action_names[i];
        var label_elem = document.createElement('span');
        label_elem.className = 'actionlabel';
        label_elem.textContent = action + ' ';
        var check_elem = document.createElement('input');
        check_elem.type = 'checkbox';
        check_elem.name = action + '_check';
        check_elem.value = action;
        check_elem.id = action + '_check';
        check_elem.checked = enabled[action];
        check_elem.onchange = this.saveEnabledActions.bind(this);
        var groupingdiv = document.createElement('div');
        groupingdiv.appendChild(check_elem);
        groupingdiv.appendChild(label_elem);
        groupingdiv.className = i % 2 ? 'action_odd' : 'action_even';
        enelem.appendChild(groupingdiv);
        if ((i % 3) == 2) {
        //if (i !== action_names.length - 1) {
            var br_elem = document.createElement('br');
            enelem.appendChild(br_elem);
        }

    }
};

OptionsThingy.prototype.updateConfigDisplay = function(err, cfg) {
    log('updateConfigDisplay START');

    var jselem = document.getElementById('configjson');
    var urlem = document.getElementById('configsrc');

    if (this.hasOwnProperty('current_settings') && 
        this.current_settings.hasOwnProperty('config_source')) {
        urlem.value = this.current_settings.config_source;
    }

    if (this && this.hasOwnProperty('current_settings') && (err === null)) {
        // this is here rather than in earlier in restorePluginOptions
        // becauase generating this list requires the config as well as
        // the plugin options
        this.showEnabledActionsList(this.current_settings, cfg.actions);
        jselem.value = JSON.stringify(cfg, null, 2);
    } else {
        log('error');
        jselem.value = "ERROR:" + err;
    }
    log('updateConfigDisplay DONE');
};

OptionsThingy.prototype.saveGen = function(name, inpname, checkbox = false) {
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

    this.storeThings(sv, function() {
        log(name + ' saved');
    });
};


OptionsThingy.prototype.saveImgReplURL = function() {
    log('saveImgReplURL START');
    var srcelem = document.getElementById('imgreplsrcinput');
    var url = srcelem.value;

    var not_an_url = url.match(/^__(\w+)__$/);
    if (not_an_url) {
        this.storeThings({
            imgreplsrc: url,
        }, function() {});
        return;
    }

    var tthis = this;
    doGet(url + '/img_list.json', function(resp) {
            var imgrepldata = null;
            if (resp.err == 'OK') {
                try {
                    resp.text += "\n";
                    imgrepldata = JSON.parse(resp.text);
                    log(imgrepldata);
                    tthis.storeThings({
                        imgreplsrc: url,
                        imgrepldata: imgrepldata,
                    }, function() {
                        log('imgrepldata saved');
                        chrome.storage.local.get(['imgreplsrc'], function(x) {
                            log(x);
                        });
                    });
                } catch (e) {
                    return 'err_fetching_imgrepldata';
                }

            } else {
                log('imgrepldata not saved');
            }
        }
    );
};


OptionsThingy.prototype.saveConfigURL = function() {
    log('saveConfigURL START');
    var srcelem = document.getElementById('configsrc');
    var url = srcelem.value;

    var tthis = this;
    this.storeThings({
            'config_source': url,
            'config_valid': false,
            'config_date': 0
        },
        function() {
            log('config_source saved');
            loadConfig(tthis.current_settings, tthis.updateConfigDisplay);
            tthis.restorePluginOptions();
            log('saveConfigURL DONE');
        }
    );
};

OptionsThingy.prototype.setupSaveHandlers = function() {
    for (var i = 0; i < this.savethings.length; i++) {
        var st = this.savethings[i];
        document.getElementById(st[0]).addEventListener(st[1], st[2]);
    }
};

getCurrentWindowHost = function(cb) {
    chrome.windows.getCurrent({populate:true}, (w) => {
        for (var i=0;i<w.tabs.length;i++) {
            var tab = w.tabs[i];
            if (tab && tab.active) {
                var a = document.createElement('a');
                a.href = tab.url;
                var host = a.hostname;
                return cb(host);
            }
        }
        return cb(null);
    });
};

function setup_handlers() {

    var ot = new OptionsThingy();

    log('adding onloaded handler');
    document.addEventListener('DOMContentLoaded', ot.restorePluginOptions.bind(ot));

    log('adding save handler');
    ot.setupSaveHandlers();

    document.getElementById('showconfigcheck').addEventListener('change', function(ev) {
        var configdiv = document.getElementById('configdiv');
        var tgt = ev.target || ev.srcElement;
        configdiv.style.display = tgt.checked ? 'block' : 'none';
    });
}

setup_handlers();
