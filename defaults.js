var url_base = 'https://toolsofourtools.org/detrumpify2/v2/';
// var url_base = 'http://localhost:8000/';
// var url_base = 'https://www.dropbox.com/s/';

var defaults = {
    // 'config_source': url_base + 'xywl436wxlgquw1/clean.json',
    config_source: url_base + 'clean.json',
    // 'max_age': 7 * 24 * 60 * 60 * 1000
    max_age: 180 * 1000,
    buttons_fetch_url: url_base + 'buttons_config.json',

    // default blanket style for all insults
    insult_style: '',

    // default brevity. 0 == any length. Note that it is a string,
    // since html form will also return string
    brevity: "0",

    // default brackets: none
    brackets: 'none',

    // classname for all insult styles
    insult_cssname: 'span.detrumpified',
    insult_classname: 'detrumpified',

    // how often to change insults on page
    rand_mode: 'always',

    // should I replace images with kittens
    imgrepls_fetch_url: url_base + 'imgrepls_config.json',
    imgreplsrc: '__off__',

    // fire up the mock-o-matic?
    use_matic: 'off',

    // fraction of found instances to actually change
    replace_fraction: '100',

    // how often to put up a breaking headline
    breaking_fract: 0,

    // run on any page or just whitelist
    site_filter: 'use_whitelist',

    // use the mutation approach or timer approach
    track_mutations: false,

    // some pages never to run on
    user_blacklist: "mail.google.com mail.yahoo.com",

    // some pages to run on
    user_whitelist: [
        "www.foxnews.com", "cnn.com", "www.bbc.com/news",
        "www.bbc.co.uk/news", "www.theguardian.com", "www.theguardian.co.uk",
        "nytimes.com", "facebook.com", "washingtonpost.com", "salon.com",
        "slate.com", "buzzfeed.com", "vox.com", "huffpost.com", "huffingtonpost.com",
        "wsj.com", "economist.com", "latimes.com", "dallasnews.com",
        "usatoday.com", "denverpost.com", "insidedenver.com", "philly.com",
        "chron.com", "detroitnews.com", "freep.com", "boston.com",
        "newsday.com", "startribune.com", "nypost.com", "ajc.com", "nj.com",
        "sfgate.com", "sfchronicle.com", "azcentral.com", "chicagotribune.com",
        "cleveland.com", "oregonlive.com", "tampatribune.com",
        "signonsandiego.com", "mercurynews.com", "contracostatimes.com",
        "insidebayarea.com", "feedly.com", "reddit.com",
        "drudgereport.com", "theblaze.com", "breitbart.com","ijreview.com",
        "newsmax.com", "wnd.com", "dailycaller.com", "washingtontimes.com",
        "nationalreview.com", "townhall.com", "freerepublic.com",
        "pjmedia.com", "hotair.com", "cnsnews.com", "westernjournalism.com",
        "washingtonexaminer.com", "tpnn.com", "newsbusters.org",
        "twitchy.com", "news.google.com", "npr.org", "cnbc.com", "reuters.com",
        "thehill.com", "mediaite.com"
    ].join(' '),
};
