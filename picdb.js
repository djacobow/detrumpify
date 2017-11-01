/* jshint esversion:6 */
var PicDB = function() {
    this.ar_categories = [
        0.01, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
        1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2,
        3, 4, 5, 6, 7, 8, 9, 10, 100,
    ];
    this.sz_categories = [
        100, 1000,
        10000, 25000, 50000,
        100000, 250000, 500000, 750000,
        1000000, 2000000, 3000000, 4000000, 5000000,
        6000000, 7000000, 8000000, 9000000, 10000000,
    ];
    this.raw_data = {};
    this.initDB();
};


PicDB.prototype.initDB = function() {
    this.db = {};
    for (var i = 0; i < this.ar_categories.length; i++) {
        this.db[this.ar_categories[i]] = {};
        for (var j = 0; j < this.sz_categories.length; j++) {
            this.db[this.ar_categories[i]][this.sz_categories[j]] = [];
        }
    }
};

PicDB.prototype.ChromeloadFromURL = function(src, cb) {
    var tthis = this;
    chrome.runtime.sendMessage(null, {
            cmd: 'get',
            'url': src
        }, null,
        function(resp) {
            tthis.parse(resp, cb);
        }
    );
};

PicDB.prototype.parse = function(resp, cb) {
    try {
        resp.text += "\n";
        this.raw_data = JSON.parse(resp.text);
    } catch (e) {
        return cb('could_not_parse', null);
    }
    return cb(null);
};


PicDB.prototype.loadDirect = function(id) {
    this.raw_data = id;
};

PicDB.prototype.processData = function(prefix = '') {
    this.initDB();
    var files = Object.keys(this.raw_data);
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var fdata = this.raw_data[file];
        var ar = fdata.ar;
        var sz = fdata.sz;
        for (var j = 0; j < this.ar_categories.length; j++) {
            var ar_cat = this.ar_categories[j];
            if (ar <= ar_cat) {
                for (var k = 0; k < this.sz_categories.length; k++) {
                    var sz_cat = this.sz_categories[k];
                    if (sz <= sz_cat) {
                        this.db[ar_cat][sz_cat].push(prefix + file);
                        break;
                    }
                }
                break;
            }
        }
    }
};


PicDB.prototype.selectImage = function(w, h) {
    var ar = h / w;
    var sz = h * w;
    var i, j;
    var ar_idx = -1;
    for (i = 0; i < this.ar_categories.length; i++) {
        if (ar <= this.ar_categories[i]) {
            ar_idx = i;
            break;
        }
    }
    var sz_idx = -1;
    for (j = 0; j < this.sz_categories.length; j++) {
        if (sz <= this.sz_categories[j]) {
            sz_idx = j;
            break;
        }
    }

    pic_options = [];
    var finished_ok = false;
    var exhausted = (ar_idx < 0) || (sz_idx < 0);

    while (!exhausted) {
        var ar_cat = this.ar_categories[ar_idx];
        var sz_cat = this.sz_categories[sz_idx];
        // log('ar_cat ' + ar_cat + ' sz_cat ' + sz_cat);
        pic_options = this.db[ar_cat][sz_cat];
        // log('pic_options', pic_options);
        if (pic_options && pic_options.length) {
            return pic_options[Math.floor(Math.random() * pic_options.length)];
        }
        sz_idx += 1;
        if (sz_idx >= this.sz_categories.length) {
            ar_idx += 1;
            if (ar_idx >= this.ar_categories.length) {
                exhausted = true;
            }
        }
    }

    return null;
};


if ((typeof require !== 'undefined') && (require.main === module)) {

    var log = function() {
        console.log(arguments);
    };

    var raw_data = require('./configs/v2/images/puppies/output/img_list.json');
    var pdb = new PicDB();
    pdb.loadDirect(raw_data);
    pdb.processData('file://');

    var tests = [
        [45, 45],
        [200, 200],
        [800, 600],
        [1204, 768],
        [1000, 1000]
    ];
    log(pdb.db);
    for (var i = 0; i < tests.length; i++) {
        var test = tests[i];
        var pic = pdb.selectImage(test[0], test[1]);
        log(test, pic);
    }
}
