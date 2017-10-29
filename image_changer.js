/* jshint esversion:6 */

var ImageChanger = function(config) {
    this.current_config = config;
};

// this routine starts with an element and tries to work up
// the hierarchy to see if it is enclosed anywhere by an 'a',
// and then if that a's link matches the regex supplies, we
// return true.
ImageChanger.prototype.findParentLinkMatch = function(elem, re) {
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
};

ImageChanger.prototype.makeImageReplacementDiv = function(img, action) {
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
};

ImageChanger.prototype.run = function(imgs = null) {
    log('switch_imgs()');

    // we do not need to do anything if we get a zero length list
    if (imgs && !imgs.length) return;

    var tthis = this;

    chrome.storage.local.get(['enabled_actions', 'imgreplsrc', 'imgrepldata'], function(items) {
        var action_count = 0;

        var imgreplsrc = useIfElse(items, 'imgreplsrc', '__off__');
        var src_not_url = imgreplsrc.match(/^__(\w+)__$/);
        var mode = 'off';
        if (src_not_url) {
            mode = src_not_url[1];
        }
        if (imgreplsrc.match(/^https?:/)) {
            mode = 'replcfg';
        }
         
        var picdb = null;
        if (mode == 'replcfg') {
            log('mode is replcfg');
            if (items.hasOwnProperty('imgrepldata')) {
                picdb = new PicDB();
                // log(items.imgrepldata);
                picdb.loadDirect(items.imgrepldata || []);
                picdb.processData(items.imgreplsrc + '/');
            } else {
                log('imgrepl won\'t work');
                mode = 'off';
            }
        }

        if (mode !== 'off') {
            var actions_to_run = getRunnableActions(tthis.current_config.actions, items);

            for (var n = 0; n < actions_to_run.length; n++) {
                action_name = actions_to_run[n];
                var action = tthis.current_config.actions[action_name];
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
                    if (one_of_ours) {
                        log('already detrumpified: ' + img.src);
                        break;
                    }

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
                        parent_link_match = tthis.findParentLinkMatch(img, src_re);
                    } catch (w) {}

                    if (alt_match || src_match || sty_match || parent_link_match) {
                        console.log('alt: ' + alt_match + ' src: ' + src_match + ' sty: ' + sty_match +
                                ' prnt: ' + parent_link_match);
                        var replsrc;
                        var ni = null;
                        log('looking to replace: ' + img.src);
                        var iw = img.clientWidth;
                        var ih = img.clientHeight;
                        if (mode == 'div') {
                            var nd = tthis.makeImageReplacementDiv(img, action);
                            img.parentNode.replaceChild(nd, img);
                        } else if ((mode == 'kittens') || (mode == 'blanks')) {
                            replsrc = (mode == 'kittens') ?
                                'https://placekitten.com/' :
                                'https://placehold.it/';
                            replsrc += iw.toString() + '/' + ih.toString();
                            if (img.src !== replsrc) {
                                log('[kitten/blank]: replacing ' + img.src + ' with ' + replsrc);
                                ni = document.createElement('img');
                                ni.src = replsrc;
                                img.parentNode.replaceChild(ni, img);
                            }
                        } else if (mode == 'replcfg') {
                            replsrc = picdb.selectImage(iw,ih);
                            if (replsrc) {
                                if (!img.getAttribute('replcfg_detrumpified')) {
                                    log('[replcfg]: replacing ' + img.src + ' with ' + replsrc);
                                    ni = document.createElement('img');
                                    ni.style.width = Math.floor(iw+0.5).toString() + 'px';
                                    ni.style.height = Math.floor(ih+0.5).toString() + 'px';
                                    ni.setAttribute('replcfg_detrumpified',true);
                                    ni.src = replsrc;
                                    img.parentNode.replaceChild(ni, img);
                                }
                            } else {
                                log('No appropriate replacement image for ' + img.src + ' (' + iw + ',' + ih + ')');
                            }
                        }
                    }
                }
            }
        }
    });
};

