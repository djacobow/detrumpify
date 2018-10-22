/* jshint esversion: 6 */

var ControlTimers = function(callback) {
    this.runInfo = {
        trackMutations: false,
        currTimeout: 1000,
        maxTimeout: 120000,
        runCount: 5
    };
    this.cb = callback;
    this.use_blacklist = false;
    this.run_again = false;
    this.stop_completely = false;
};

ControlTimers.prototype.preconfig_init = function(storeddata) {

    // Extra complexity to deal with the old "run_anywhere" variable
    // that the user may have set and we want to make sure it carried
    // forward to user doesn't have to set it again.
    if (storeddata.hasOwnProperty('site_filter')) {
        this.use_blacklist = (storeddata.site_filter == 'use_blacklist');
    } else if (storeddata.hasOwnProperty('run_anywhere')) {
        this.use_blacklist = storeddata.run_anywhere;
        chrome.storage.local.set({
            'site_filter': storeddata.run_anywhere ? 'use_blacklist' : 'use_whitelist',
        }, () => {});
    }

    if (storeddata.hasOwnProperty('track_mutations')) {
        this.runInfo.trackMutations = storeddata.track_mutations;
    }
    if (storeddata.hasOwnProperty('user_blacklist')) {
        this.user_blacklist = storeddata.user_blacklist;
    }
    if (storeddata.hasOwnProperty('user_whitelist')) {
        this.user_whitelist = storeddata.user_whitelist;
    }
};

ControlTimers.prototype.isThisPageRunnable = function() {
    if (this.use_blacklist) {
        return !this.isThisPageBlackListed();
    } else {
        return this.isThisPageWhiteListed();
    }
};

ControlTimers.prototype.matchesList = function(lstr) {
    var url = document.location.href;
    if (lstr && lstr.length) {
        var list = lstr.split(/[^\w\.-]+/)
            .map((x) => { return x.trim(); })
            .filter((x) => { return x.length;});
        // log(list);
        for (var i=0; i< list.length; i++) {
            var l = list[i];
            var re = new RegExp('https?://(\\w+\\.)?' + l + '\\b');
            if (url.match(re)) {
                log('list match because ' + l);
                return true;
            }
        }
    }
    return false;
};

ControlTimers.prototype.isThisPageBlackListed = function() {
    log('isThisPageBlackListed');
    return this.matchesList(this.user_blacklist);
};

ControlTimers.prototype.isThisPageWhiteListed = function() {
    log('isThisPageWhiteListed');
    return this.matchesList(this.user_whitelist);
};

ControlTimers.prototype.postconfig_init = function(current_config, current_settings) {
    log("postconfig_init()");
    this.config = current_config;


    // User's can generate their own whitelists now, but until version 1.2.9,
    // the whitelist was backed into the config. This code allows a smooth
    // transition for users upgrading from old version without user 
    // whitelist, whereby the whitelist from the config is stored to the 
    // user's whitelist.
    if (!this.hasOwnProperty('user_whitelist')) {
        var lstr = null;
        if (this.config.whitelist) {
            lstr = this.config.whitelist.join(' ');
        } else if (defaults.user_whitelist) {
            lstr = defaults.user_whitelist;
        }
        if (lstr !== null) {
            this.user_whitelist = lstr;
            chrome.storage.local.set({
                'user_whitelist': this.user_whitelist
            }, () => {
                log('Stored whitelist from config to user data.');
                log(this.user_whitelist);
            });
        }
    }

    if (this.isThisPageRunnable()) {
        if (this.runInfo.trackMutations) {
            this.startMutationTracking();
            this.run_again = true; // force one run through no matter what
        } else {
            this.runInfo.currTimeout = this.config.run_info.startTimeout;
            this.runInfo.maxTimeout = this.config.run_info.maxTimeout;
            this.runInfo.runCount = this.config.run_info.count;
            this.backoffTimer();
        }
        window.setTimeout(function() {
            makeBreaking(current_config.breaking,current_settings);
        },2000);
        this.tick();
    }
};


ControlTimers.prototype.startMutationTracking = function() {
    var tthis = this;
    var target = document.getElementsByTagName('BODY')[0];
    this.observer = new MutationObserver(function(mutations) {
        tthis.run_again = true;
    });
    this.observer.observe(target, {
        childList: true,
        characterData: true,
        subtree: true,
    });
};


ControlTimers.prototype.tick = function() {
    log('tick()');
    if (this.run_again) {
        this.run_again = false;
        try {
            this.cb();
        } catch (e) {
            log(e);
        }
    }
    if (this.stop_completely) {
        log('stopping completely');
    } else {
        setTimeout(this.tick.bind(this), 2000);
    }
};

ControlTimers.prototype.backoffTimer = function() {
    log('backoffTimer()');
    this.run_again = true;
    this.runInfo.currTimeout *= this.config.run_info.timeMultiplier;
    if (this.runInfo.currTimeout > this.runInfo.maxTimeout) {
        this.runInfo.currTimeout = this.runInfo.maxTimeout;
    }
    if (this.runInfo.runCount) {
        this.runInfo.runCount -= 1;
        setTimeout(this.backoffTimer.bind(this), this.runInfo.currTimeout);
    } else {
        this.stop_completely = true;
    }
    log(this.runInfo);
};
