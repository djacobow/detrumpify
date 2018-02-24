var ControlTimers = function(callback) {
    this.runInfo = {
        trackMutations: false,
        currTimeout: 1000,
        maxTimeout: 120000,
        runCount: 5
    };
    this.cb = callback;
    this.run_anywhere = false;
    this.run_again = false;
    this.stop_completely = false;
};

ControlTimers.prototype.preconfig_init = function(storeddata) {
    if (storeddata.hasOwnProperty('run_anywhere')) {
        this.run_anywhere = storeddata.run_anywhere;
    }
    if (storeddata.hasOwnProperty('track_mutations')) {
        this.runInfo.trackMutations = storeddata.track_mutations;
    }
};

ControlTimers.prototype.isThisPageRunnable = function(storeddata) {
    if (this.run_anywhere) return true;
    log('isThisPageRunnable');
    var url = document.location.href;
    var match = false;
    for (var i = 0; i < this.config.whitelist.length; i++) {
        var item = this.config.whitelist[i];
        var re = new RegExp('https?://(\\w+\\.)?' + item);
        if (url.match(re)) {
            match = true;
            log("IS RUNNABLE: " + url);
            break;
        }
    }
    return match;
};

ControlTimers.prototype.postconfig_init = function(current_config, current_settings) {
    log("psotconfig_init()");
    this.config = current_config;
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
