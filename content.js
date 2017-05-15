/* jshint esversion:6 */
// These weill be overridden by the config itself.
var runInfo = {
    trackMutations: false,
    currTimeout: 1000,
    maxTimeout: 120000,
    runCount: 5
};

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


// create a trump insult from raw ingredients
function make_matic(action, recipe) {
    var slots = action.matic.slots;
    var chunks = [];
    var last_slot_name = '';
    var last_elemidx = -1;
    var tries = 0;
    var max_tries = 10;
    for (var i = 0; i < recipe.length; i++) {
        var slot_name = recipe[i];
        var elemidx = Math.floor(slots[slot_name].length * Math.random());
        while ((slot_name == last_slot_name) &&
            (elemidx === last_elemidx) &&
            (tries < max_tries)
        ) {
            elemidx = Math.floor(slots[slot_name].length * Math.random());
            tries += 1;
        }
        var chunkelem = slots[slot_name][elemidx];
        if ((recipe.length > 2) && (i < (recipe.length - 2))) {
            // put commas between successive adjectives
            chunkelem += ',';
        }
        chunks.push(chunkelem);
        last_slot_name = slot_name;
        last_elemidx = elemidx;
    }
    return chunks.join(' ');
}

// pick or generate a new insult immediately
function choose_now(use_matic, moniker_list, action, choice) {
    var item = null;

    if ((use_matic !== "off") &&
        action.hasOwnProperty('matic')
    ) {
        recipe = use_matic.toLowerCase().split(/_/);
        log(recipe);
        item = make_matic(action, recipe);
    } else {
        var item_idx = Math.floor(moniker_list.length * Math.random());
        item = moniker_list[item_idx % moniker_list.length];
    }
    choice.last_chosen_item = item;
    choice.last_chosen_time = (new Date()).getTime();
}

// return the next insult -- may be the same as the last
// insult or a new one depending on time and user mode
function choose(rand_mode, use_matic, moniker_list, action, choice) {
    var wait = get_randomize_time(rand_mode);
    var now = (new Date()).getTime();
    if (!choice.hasOwnProperty('last_chosen_time') ||
        ((now - choice.last_chosen_time) >= wait)) {
        choose_now(use_matic, moniker_list, action, choice);
    }
    return choice;
}

// convert a text string into an array of
// elements that represent the bits and pieces
// that do and do not match the regex
function find_match_nonmatch_chunks(text, re) {
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
        var before_text = text.substr(end, start - end);
        if (before_text.length > 0) {
            broken_texts.push({
                'match': false,
                'text': before_text
            });
        }
        var match_text = text.substr(start, new_end - start);
        broken_texts.push({
            'match': true,
            'text': match_text
        });
        end = new_end;
    }
    if (broken_texts.length && (end < text.length)) {
        var after_text = text.substr(end, text.length - 1);
        broken_texts.push({
            'match': false,
            'text': after_text
        });
    }
    // if (broken_texts.length) {
    //   console.log(broken_texts);
    // }
    return broken_texts;
}

function randomPercentTrue(perc) {
    var res = (Math.floor(Math.random() * 100) < perc);
    // log('repl_perc: ' + perc + ' res: ' + res);
    return res;
}

function make_replacement_elems_array(args) {

    var action_name = useIfElse(args, 'action_name', '__error_missing_action_name');
    var action = args.action;
    var rand_mode = useIfElse(args, 'rand_mode', 'always');
    var use_matic = useIfElse(args, 'use_matic', 'off');
    var moniker_list = useIfElse(args, 'monikers', []);
    var brackets = useIfElse(args, 'brackets', ['', '']);
    var repl_percent = useIfElse(args, 'replace_percent', 100);
    var broken_texts = args.broken_texts;
    var orig_node = args.node;
    var choice = args.choice;

    var repl_array = [];
    var repl_count = 0;
    for (var k = 0; k < broken_texts.length; k++) {
        chunk = broken_texts[k];
        if (chunk.match && randomPercentTrue(repl_percent)) {
            choose(rand_mode, use_matic, moniker_list, action, choice);
            var replacement = choice.last_chosen_item;
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
            repl_count += 1;
        } else {
            var newnode = orig_node.cloneNode(false);
            newnode.nodeValue = chunk.text;
            repl_array.push(newnode);
        }
    }
    return {
        repl_array: repl_array,
        repl_count: repl_count
    };
}

function replace_elem_with_array_of_elems(orig, arry) {
    // log('replace_elem_with_array_of_elems');
    var newnode = document.createElement('span');
    for (var k = 0; k < arry.length; k++) {
        newnode.appendChild(arry[k]);
    }
    orig.parentNode.replaceChild(newnode, orig);
}


function runReplacementOnce(elems = null, img_elems = null) {
    switch_text(elems);
    switch_imgs(img_elems);
}


function runPeriodicReplacement() {
    runReplacementOnce();
    runInfo.runCount -= 1;
    if (runInfo.runCount) {
        log('runInfo.currTimeout:' + runInfo.currTimeout);
        setTimeout(runPeriodicReplacement, runInfo.currTimeout);
        if (runInfo.currTimeout < runInfo.maxTimeout) {
            runInfo.currTimeout *= current_config.run_info.timeMultiplier;
        }
    }
}

function getRunnableActions(config_actions, items) {
    // generate a shortened list of actions that the user has enabled

    var actions_to_run = [];
    var action_names = Object.keys(current_config.actions);
    for (var i = 0; i < action_names.length; i++) {
        var action_name = action_names[i];
        var enable_this = true;
        if (items.hasOwnProperty('enabled_actions') &&
            items.enabled_actions.hasOwnProperty(action_name)) {
            enable_this = items.enabled_actions[action_name];
        } else if (current_config.actions[action_name].hasOwnProperty('default_enabled')) {
            enable_this = Boolean(config_actions[action_name].default_enabled);
        }
        if (enable_this) actions_to_run.push(action_name);
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

function makeImageReplacementDiv(img, action) {
    var border = 2;
    var nd = document.createElement('div');
    var newimg = document.createElement('img');
    newimg.setAttribute('detrumpified', true);
    newimg.alt = 'National disgrace removed.';
    var newimgsrc = chrome.runtime.getURL('empty_image.png');
    if (action.hasOwnProperty('image_replacement')) {
        var idx = Math.floor(Math.random() * action.image_replacement.html.length);
        newimg.alt = action.image_replacement.html[idx];
        border = action.image_replacement.border;
        if (action.image_replacement.hasOwnProperty('background')) {
            idx = Math.floor(Math.random() * action.image_replacement.background.length);
            newimgsrc = action.image_replacement.background[idx];
        }
    }
    var dw = img.clientWidth - 2 * border;
    var dh = img.clientHeight - 2 * border;
    nd.style['text-align'] = 'center';
    nd.style['vertical-align'] = 'middle';
    nd.style.display = 'table-cell';
    nd.style.border = border.toString() + 'px solid';
    nd.style.width = dw.toString() + 'px';
    nd.style['max-width'] = dw.toString() + 'px';
    nd.style.height = dh.toString() + 'px';
    nd.style['max-height'] = dh.toString() + 'px';
    removeChildrenReplaceWith(nd, [newimg]);

    newimg.src = newimgsrc;
    // very primitive way to deal with the aspect ratio. Assume that
    // the longer edge is more important to match, don't do anything
    // else. Will have to revisit this, but not today.
    if (dw > dh) {
        newimg.width = '100%';
    } else {
        newimg.height = '100%';
    }
    return nd;
}

function switch_imgs(imgs = null) {
    log('switch_imgs()');
    chrome.storage.local.get(['kittenize', 'enabled_actions'], function(items) {
        var action_count = 0;

        var mode = useIfElse(items, 'kittenize', 'off');

        // this is for backward compatibility with boolean version that
        // may be stored in local store.
        if (typeof mode == 'boolean') {
            mode = mode ? 'kittens' : 'off';
        }
        // Also for backward compatibility with "more kittens" (switch
        // image if parent element matches), which we are making the 
        // default and only behavior now
        if (mode == 'more_kittens') mode = 'kittens';

        if (mode !== 'off') {
            var actions_to_run = getRunnableActions(current_config.actions, items);

            for (var n = 0; n < actions_to_run.length; n++) {
                action_name = actions_to_run[n];
                var action = current_config.actions[action_name];
                var alt_re = new RegExp(action.find_regex[0],
                    action.find_regex[1]);
                var src_re;
                if (action.hasOwnProperty('img_find_regex')) {
                    src_re = new RegExp(action.img_find_regex[0],
                        action.img_find_regex[1]);
                } else {
                    src_re = new RegExp(action.find_regex[0], 'i');
                }

                if (!imgs) imgs = document.getElementsByTagName('img');
                for (var i = 0; i < imgs.length; i++) {
                    var img = imgs[i];
                    var one_of_ours = img.getAttribute('detrumpified');
                    if (one_of_ours) break;

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
                    } catch (w) {}

                    if (alt_match ||
                        src_match ||
                        sty_match ||
                        parent_link_match ||
                        false) {
                        var replsrc;
                        if (mode == 'div') {
                            var nd = makeImageReplacementDiv(img, action);
                            img.parentNode.replaceChild(nd, img);
                        } else if (mode == 'kittens') {
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

function filterListByWordCount(list, max_words) {
    var olist = [];
    for (var p = 0; p < list.length; p++) {
        var item = list[p];
        var word_count = item.split(/[\s\-]/).length;
        if ((max_words === 0) || (word_count <= max_words)) {
            olist.push(item);
        }
    }
    return olist;
}

function useIfElse(dict, name, deflt) {
    return dict.hasOwnProperty(name) ? dict[name] : deflt;
}

function determineBrackets(mode, action) {
    var brackets = ['', ''];
    if (action.hasOwnProperty('scarequote') && action.scarequote) {
        brackets = ['\u201c', '\u201d'];
    }
    if (action.hasOwnProperty('bracket') && (action.bracket.length >= 2)) {
        brackets = [action.bracket[0], action.bracket[1]];
    }
    switch (mode) {
        case 'curly':
            brackets = ['\u201c', '\u201d'];
            break;
        case 'square':
            brackets = ['[', ']'];
            break;
    }
    return brackets;
}

function switch_text(elements = null) {
    log('switch_text START, count:' + runInfo.runCount);

    if (current_config === null) {
        log("current_config is invalid");
        return;
    }


    var action_name;
    var n;

    var keys_we_need = ['stored_choices', 'enabled_actions',
        'brevity', 'brackets', 'rand_mode', 'use_matic',
        'replace_fraction'
    ];
    // log(keys_we_need);
    chrome.storage.local.get(keys_we_need, function(items) {
        var action_count = 0;
        var stored_choices = useIfElse(items, 'stored_choices', {});

        var actions_to_run = getRunnableActions(current_config.actions, items);
        log(actions_to_run);

        for (var n = 0; n < actions_to_run.length; n++) {
            action_name = actions_to_run[n];
            log('action_name: ' + action_name);
            var visit_attrib_name = '_dtv_' + action_name;
            var action = current_config.actions[action_name];
            // console.log(action);
            if (!action.hasOwnProperty('monikers')) {
                log("action is invalid");
                return;
            }

            var brevity = useIfElse(items, 'brevity', '0');
            var use_matic = useIfElse(items, 'use_matic', 'off');
            var rand_mode = useIfElse(items, 'rand_mode', 'always');
            var replace_percent = parseFloat(
                useIfElse(items, 'replace_fraction', '100')
            );

            // create a sublist of monikers that meet the brevity criteria
            var max_wordcount = parseInt(brevity);
            var monikers_to_use = filterListByWordCount(action.monikers, max_wordcount);

            var bracket_mode = useIfElse(items, 'brackets', 'off');
            var brackets = determineBrackets(bracket_mode, action);

            var search_regex = new RegExp(action.find_regex[0],
                action.find_regex[1]);
            if (!elements) elements = document.getElementsByTagName('*');

            if (!stored_choices.hasOwnProperty(action_name)) {
                stored_choices[action_name] = {};
                choose_now(use_matic, monikers_to_use, action, stored_choices[action_name]);
            }

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                try {
                    if (!element.hasAttribute(visit_attrib_name)) {
                        for (var j = 0; j < element.childNodes.length; j++) {
                            var node = element.childNodes[j];
                            if (node.nodeType === 3) {
                                var text = node.nodeValue;
                                broken_texts = find_match_nonmatch_chunks(text, search_regex);

                                if (broken_texts.length) {
                                    var rr = make_replacement_elems_array({
                                        action_name: action_name,
                                        action: action,
                                        rand_mode: rand_mode,
                                        broken_texts: broken_texts,
                                        use_matic: use_matic,
                                        replace_percent: replace_percent,
                                        monikers: monikers_to_use,
                                        brackets: brackets,
                                        node: node,
                                        choice: stored_choices[action_name]
                                    });

                                    if (rr.repl_count) {
                                        replace_elem_with_array_of_elems(node, rr.repl_array);
                                    }
                                    // regardless of weather we made a change or not,
                                    // we mark this element searched so that it does
                                    // not get replaced on a subsequent run.
                                    // This lets us 1) use insults that have the search
                                    // string in them and 2) not have insults skipped
                                    // purposely not be skipped on subsequent runs
                                    element.setAttribute(visit_attrib_name, '1');
                                }
                            }
                        }
                    }
                } catch (e) {
                    log('exception');
                    log(e);
                    log(element);
                }
            }

            if (action_count == (Object.keys(current_config.actions).length - 1)) {
                // console.log("iteration done; storing choices");
                chrome.storage.local.set({
                    'stored_choices': stored_choices
                }, function() {});

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
    for (var i = 0; i < current_config.whitelist.length; i++) {
        var item = current_config.whitelist[i];
        var re = new RegExp('https?://(\\w+\\.)?' + item);
        if (url.match(re)) {
            match = true;
            log("IS RUNNABLE: " + url);
            break;
        }
    }
    return match;
}


var observer = null;

function startMutationReplacements() {
    var target = document.getElementsByTagName('BODY')[0];
    observer = new MutationObserver(function(mutations) {
        var elems = [];
        var img_elems = [];
        mutations.forEach(function(mutation) {
            var more_elems = mutation.target.getElementsByTagName('*');
            var more_img_elems = mutation.target.getElementsByTagName('IMG');
            Array.prototype.push.apply(elems, more_elems);
            Array.prototype.push.apply(img_elems, more_img_elems);
            if (mutation.target.nodeName !== '#text') {
                elems.push(mutation.target);
            }
            if (mutation.target.nodeName === 'IMG') {
                img_elems.push(mutation.target);
            }
        });
        log('MUTATION BASED SWITCHING');
        runReplacementOnce(elems, img_elems);
    });
    observer.observe(target, {
        childList: true,
        characterData: true,
        subtree: true,
    });
}

function initReplacementStrategy(err, res) {
    log("initReplacementStrategy()");
    if (err === null) {
        current_config = res;

        if (isThisPageRunnable()) {
            if (runInfo.trackMutations) {
                runReplacementOnce();
                startMutationReplacements();
            } else {
                setTimeout(runPeriodicReplacement, runInfo.currTimeout);
                try {
                    runInfo.currTimeout = current_config.run_info.startTimeout;
                    runInfo.currTimeout *= current_config.run_info.timeMultiplier;
                    runInfo.runCount = current_config.run_info.count;
                } catch (e) {
                    log("config probably doesn't have run_info");
                }
            }
        } else {
            log("this page is not whitelisted");
        }
    } else {
        log("Skipping initReplacementStrategy due to ERROR");
        log(err);
        log(res);
    }
}

function init() {
    set_initial_url(function() {
        chrome.storage.local.get(['insult_style', 'run_anywhere', 'track_mutations'],
            function(items) {
                if (items.hasOwnProperty('run_anywhere')) {
                    run_anywhere = items.run_anywhere;
                }
                if (items.hasOwnProperty('track_mutations')) {
                    runInfo.trackMutations = items.track_mutations;
                }
                if (items.hasOwnProperty('insult_style')) {
                    createAndSetStyle(defaults.insult_cssname, items.insult_style);
                }
            });
        loadConfig(initReplacementStrategy);
    });
}

log("starting");
setTimeout(init, runInfo.currTimeout);
