/* jshint esversion:6 */

var TextChanger = function(settings, config) {
    this.current_settings = settings;
    this.current_config = config;
};

TextChanger.prototype.get_randomize_time = function(mode) {
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
};





// create a trump insult from raw ingredients
TextChanger.prototype.make_matic = function(action, recipe) {
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
};

// pick or generate a new insult immediately
TextChanger.prototype.choose_now = function(use_matic, moniker_list, action, choice) {
    var item = null;

    if ((use_matic !== "off") &&
        action.hasOwnProperty('matic')
    ) {
        recipe = use_matic.toLowerCase().split(/_/);
        log(recipe);
        item = this.make_matic(action, recipe);
    } else {
        var item_idx = Math.floor(moniker_list.length * Math.random());
        item = moniker_list[item_idx % moniker_list.length];
    }
    choice.last_chosen_item = item;
    choice.last_chosen_time = (new Date()).getTime();
};


// return the next insult -- may be the same as the last
// insult or a new one depending on time and user mode
TextChanger.prototype.choose = function(rand_mode, use_matic, moniker_list, action, choice) {
    var wait = this.get_randomize_time(rand_mode);
    var now = (new Date()).getTime();
    // log('choose wait: ' + wait + ' now: ' + now + ' last_chosen: ' + choice.last_chosen_time);
    if (!choice.hasOwnProperty('last_chosen_time') ||
        ((now - choice.last_chosen_time) >= wait)) {
        this.choose_now(use_matic, moniker_list, action, choice);
    }
    return choice;
};

// convert a text string into an array of
// elements that represent the bits and pieces
// that do and do not match the regex
TextChanger.prototype.find_match_nonmatch_chunks = function(text, re) {
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
    //   log(broken_texts);
    // }
    return broken_texts;
};

TextChanger.prototype.randomPercentTrue = function(perc) {
    var res = (Math.floor(Math.random() * 100) < perc);
    // log('repl_perc: ' + perc + ' res: ' + res);
    return res;
};

TextChanger.prototype.make_replacement_elems_array = function(args) {

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
        if (chunk.match && this.randomPercentTrue(repl_percent)) {
            this.choose(rand_mode, use_matic, moniker_list, action, choice);
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
};


TextChanger.prototype.filterListByWordCount = function(list, max_words) {
    var olist = [];
    for (var p = 0; p < list.length; p++) {
        var item = list[p];
        var word_count = item.split(/[\s\-]/).length;
        if ((max_words === 0) || (word_count <= max_words)) {
            olist.push(item);
        }
    }
    return olist;
};

TextChanger.prototype.determineBrackets = function(mode, action) {
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
};

TextChanger.prototype.run = function(elements = null) {
    log('switch_text START');

    if (this.current_config === null) {
        log("current_config is invalid");
        return;
    }

    // if we got a list, but it is an empty list, then we're done
    if (elements && !elements.length) return;

    var action_name;
    var n;

    var tthis = this;
    if (true) {
        var action_count = 0;
        var stored_choices = useIfElse(this.current_settings, 'stored_choices', {});
        // log('STORED CHOICES AT START');
        // log(JSON.stringify(stored_choices));
        var actions_to_run = getRunnableActions(tthis.current_config.actions, this.current_settings);

        for (n = 0; n < actions_to_run.length; n++) {
            action_name = actions_to_run[n];
            log('action_name: ' + action_name);
            var visit_attrib_name = '_dtv_' + action_name;
            var action = tthis.current_config.actions[action_name];
            // log(action);
            if (!action.hasOwnProperty('monikers')) {
                log("skipping action; no monikers");
                continue;
            }

            var brevity = useIfElse(this.current_settings, 'brevity', '0');
            var use_matic = useIfElse(this.current_settings, 'use_matic', 'off');
            var rand_mode = useIfElse(this.current_settings, 'rand_mode', 'always');
            var replace_percent = parseFloat(
                useIfElse(this.current_settings, 'replace_fraction', '100')
            );

            // create a sublist of monikers that meet the brevity criteria
            var max_wordcount = parseInt(brevity);
            var monikers_to_use = tthis.filterListByWordCount(action.monikers, max_wordcount);

            var bracket_mode = useIfElse(this.current_settings, 'brackets', 'off');
            var brackets = tthis.determineBrackets(bracket_mode, action);

            var search_regex = new RegExp(action.find_regex[0],
                action.find_regex[1]);
            if (!elements) elements = document.getElementsByTagName('*');

            if (!stored_choices.hasOwnProperty(action_name)) {
                stored_choices[action_name] = {};
                this.choose_now(use_matic, monikers_to_use, action, stored_choices[action_name]);
            }

            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                try {
                    if (!element.hasAttribute(visit_attrib_name)) {
                        for (var j = 0; j < element.childNodes.length; j++) {
                            var node = element.childNodes[j];
                            if (node.nodeType === 3) {
                                if ((node.parentElement !== undefined) &&
                                    (node.parentElement.nodeName == 'TITLE')) {
                                    continue;
                                }
                                var text = node.nodeValue;
                                broken_texts = tthis.find_match_nonmatch_chunks(text, search_regex);

                                if (broken_texts.length) {
                                    var rr = tthis.make_replacement_elems_array({
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
                                    // regardless of whether we made a change or not,
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
            log('action_done: ' + action_name);

            action_count += 1;
        }

        if (true) {
            // log("iteration done; storing choices");
            chrome.storage.local.set({
                'stored_choices': stored_choices
            }, function() {});
        }

    }
};

