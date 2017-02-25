
//var url_base = 'http://localhost:8000/';
var url_base = 'http://toolsofourtools.org/detrumpify2/v2/';
// var url_base = 'https://www.dropbox.com/s/';

var defaults = {
  // 'config_source': url_base + 'xywl436wxlgquw1/clean.json',
  'config_source': url_base + 'clean.json',
  // 'max_age': 7 * 24 * 60 * 60 * 1000
  'max_age': 180 * 1000,
  'buttons_fetch_url': url_base + 'buttons_config.json',

  // default blanket style for all insults
  'insult_style': '',

  // default brevity. 0 == any length. Note that it is a string,
  // since html form will also return string
  'brevity': "0",

  // default brackets: none
  'brackets': 'none',

  // classname for all insult styles
  'insult_cssname': 'span.detrumpified',
  'insult_classname': 'detrumpified',

  // how often to change insults on page
  'rand_mode': 'always', 

  // should I replace images with kittens
  'kittenize': 'off',

  // fire up the mock-o-matic?
  'use_matic': 'off',

  // fraction of found instances to actually change
  'replace_fraction': '100',

  // run on any page or just whitelist
  'run_anywhere': false,
};
