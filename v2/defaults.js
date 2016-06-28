
//var url_base = 'http://localhost:8000/';
var url_base = 'http://toolsofourtools.org/detrumpify2/';

var defaults = {
  'config_source': url_base + "clean.json",
  // 'max_age': 7 * 24 * 60 * 60 * 1000
  'max_age': 180 * 1000,
  'buttons': [
   [ 'combined - quoted - always changing', 
     url_base + 'combined-scare.json',
     'Combined list of clean and dirty names, quoted. Changes with every mention.',
   ],

   [ 'dirty - quoted - always changing', 
     url_base + 'dirty-scare.json',
     'Only curseword names, with scare quotes. Changes on every mention.',
   ],

   [ 'clean - quoted - always changing', 
     url_base + 'clean-scare.json' ,
     'Clean names only, with scare quotes. Changes on every mention.',
   ],

   [ 'combined - unquoted', 
     url_base + 'combined.json' ,
     'Combined list of clean and dirty names. Changes with every mention.',
   ],

   [ 'dirty - unquoted', 
     url_base + 'dirty.json',
     'Only curseword names list of clean and dirty names. Changes with every mention.',
   ],

   [ 'clean - unquoted', 
     url_base + 'clean.json',
     'Clean names only. Changes with every mention.',
   ],

   [ 'clean - unquoted - daily', 
     url_base + 'clean-daily.json',
     'Clean names only. Changes only once a day.',
   ],
  ],
};


