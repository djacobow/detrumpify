
//var url_base = 'http://localhost:8000/';
var url_base = 'http://toolsofourtools.org/detrumpify2/';

var defaults = {
  'config_source': url_base + "clean.json",
  'buttons': [
   [ 'NSFW+Clean quoted', url_base + 'combined-scare.json' ],
   [ 'NSFW quoted', url_base + 'dirty-scare.json' ],
   [ 'Clean quoted', url_base + 'clean-scare.json' ],
   [ 'NSFW+Clean unquoted', url_base + 'combined.json' ],
   [ 'NSFW unquoted', url_base + 'dirty.json' ],
   [ 'Clean unquoted', url_base + 'clean.json' ]
  ],
  // 'max_age': 7 * 24 * 60 * 60 * 1000
  'max_age': 180 * 1000
};


