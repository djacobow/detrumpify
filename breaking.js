
var cookHeadline = function(raw) {
    var vardata = calc_ttr();
    var chunks = raw.split(/(\$\w+)/);
    var os = '';
    chunks.forEach(function(chunk) {
        var m = chunk.match(/^\$(\w+)$/);
        if (m) {
            os += vardata[m[1]] || '__NOTFOUND__';
        } else {
            os += chunk;
        }
    });
     
    return os;
};

var makeBreaking = function(breakinglist,settings) {
    var breaking_fraction = settings.breaking_fract || 0;
    breaking_fraction /= 100;
    var do_breaking = breakinglist &&
                      Array.isArray(breakinglist) &&
                      (Math.random() <= breaking_fraction);

    function applyStyles(e,ss) {
        ss.forEach(function(s) {
            e.style[s[0]] = s[1];
        });
    }

    if (do_breaking) {
        var id = 'detrumpify_bdiv';
        var bdiv = document.getElementById(id);
        if (!bdiv) bdiv = document.createElement('div');
        while (bdiv.firstChild) bdiv.removeChild(bdiv.firstChild);
        applyStyles(bdiv,[
            // ['z-index',      -100],
            ['width',       '100%'],
            ['position',    'fixed'],
            ['padding',     0],
            ['top',         0],
            ['left',        0],
            ['font-family', [ 'Verdana', 'Arial', 'sans-serif']],
            ['background-color', 'red'],
            ['color',       'white'],
        ]);

        var raw_headline = breakinglist[Math.floor(Math.random() * breakinglist.length)];
        var headline = cookHeadline(raw_headline);

        bdiv.className = 'detrumpify_breaking';
        bdiv.id = id;
        bdiv.display = 'block';
        var tbl = document.createElement('table');
        tbl.width = '100%';
        var tr  = document.createElement('tr');
        tbl.appendChild(tr);
        var td0 = document.createElement('td');
        td0.width = "15%";
        var td1 = document.createElement('td');
        td1.style['text-align'] = 'center';
        td1.width = "70%";
        var td2 = document.createElement('td');
        td2.width = "15%";
        tr.appendChild(td0);
        tr.appendChild(td1);
        tr.appendChild(td2);
        sp0 = document.createElement('span');
        sp1 = document.createElement('span');
        sp2 = document.createElement('span');
        sp0.innerText = 'BREAKING: ';
        sp0.style['font-weight'] = 'bold';
        sp1.innerText = headline;
        sp2.style['font-size'] = '200%';
        sp2.style.transition = 'all 0.5s';
        sp2.addEventListener('mouseover', function() {
            sp2.style['font-size'] = '250%';
        });
        sp2.addEventListener('mouseout', function() {
            sp2.style['font-size'] = '200%';
        });
        td1.addEventListener('click', function() {
            document.documentElement.removeChild(bdiv);
            bdiv.innerText = '';
            bdiv.display = 'none';
            bdiv.visible = false;
            document.body.style.transform = 'translateY(0)';
        });
        sp2.innerText = ' \u2297'; // circle with an x in it
        sp1.setAttribute('_dtv_trump',1);
        td1.appendChild(sp0);
        td1.appendChild(sp1);
        td1.appendChild(sp2);
        bdiv.appendChild(tbl);
        document.documentElement.appendChild(bdiv);
        document.body.style.transform = 'translateY(' + bdiv.scrollHeight + 'px)';
    }
};


