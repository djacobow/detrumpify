
var ttr_options = {
    ref_date: 'inauguration',
    terms: '2',
};

var ttr_config = {
    // These dates are in GMT, hence the +4 hours
    // Based on EST (for Wash DC in Nov & Jan
    dates: {
        start: {
            inauguration: new Date('January 20, 2025 16:00:00Z'),
            election: new Date('November 5, 2024 04:00:00Z'),
        },
        end: {
            '2': {
                inauguration: new Date('January 20, 2029 16:00:00Z'),
                election: new Date('November 7, 2028 04:00:00Z'),
            },
        }
    },
    basic_intervals: {
        day: 1000 * 60 * 60 * 24,
        hour: 1000 * 60 * 60,
        minute: 1000 * 60,
        second: 1000,
    }
};

var ms_to_dhms = function(ms) {
    var rv = {};
    var iv_names = Object.keys(ttr_config.basic_intervals);
    for (var i=0; i<iv_names.length; i++) {
        var ivn = iv_names[i];
        var iv  = ttr_config.basic_intervals[ivn];
        var ivc = Math.floor(ms / iv);
        rv[ivn] = ivc;
        ms -= ivc * iv;
    }
    return rv;
};

var dhms_to_str = function(dhms) {
    var os = dhms.day.toString() +
             ' days ';
    var hstr = dhms.hour   < 10 ? '0' : '';
    var mstr = dhms.minute < 10 ? '0' : '';
    var sstr = dhms.second < 10 ? '0' : '';
    hstr += dhms.hour.toString();
    mstr += dhms.minute.toString();
    sstr += dhms.second.toString();

    os += hstr + ':' + mstr + ':' + sstr;
    return os;
};


var calc_ttr = function() {
    var now = new Date();
    var end = ttr_config.dates.end[ttr_options.terms][ttr_options.ref_date];
    var start = ttr_config.dates.start[ttr_options.ref_date];
    // console.log('ref_date: ' + ttr_options.ref_date);
    // console.log('start: '); console.log(start);
    // console.log('end: '); console.log(end);
    var total_presidency_ms = end - start;
    var total_elapsed_ms = now - start;
    var total_remaining_ms = end - now;

    var total_elapsed_dhms = ms_to_dhms(total_elapsed_ms);
    var total_remaining_dhms = ms_to_dhms(total_remaining_ms);
    var frac_elapsed = total_elapsed_ms / total_presidency_ms;
    var frac_remaining = total_remaining_ms / total_presidency_ms;

    return {
        days_elapsed: total_elapsed_dhms.day,
        days_remaining: total_remaining_dhms.day,
        perc_complete: (Math.floor(frac_elapsed * 10000) / 100).toString(),
        perc_remaining: (Math.floor(frac_remaining* 10000) / 100).toString(),
    };
};
