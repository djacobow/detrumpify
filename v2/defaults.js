
//var url_base = 'http://localhost:8000/';
var url_base = 'http://toolsofourtools.org/detrumpify2/';
// var url_base = 'https://www.dropbox.com/s/';

var defaults = {
  // 'config_source': url_base + 'xywl436wxlgquw1/clean.json',
  'config_source': url_base + 'clean.json',
  // 'max_age': 7 * 24 * 60 * 60 * 1000
  'max_age': 180 * 1000,
  'buttons': [
   [ 'clean+NSFW | quoted | always changing',
     // url_base + '7dr3nsqkprw7xk3/combined-scare.json',
     url_base + 'combined-scare.json',
     'Combined list of clean and dirty names, quoted. Changes with every mention.',
   ],

   [ 'NSFW | quoted | always changing',
     // url_base + 'kn0k0iv0vov3ez0/dirty-scare.json',
     url_base + 'dirty-scare.json',
     'Only curseword names, with scare quotes. Changes on every mention.',
   ],

   [ 'clean | quoted | always changing',
     // url_base + 'krzd11bin7skagw/clean-scare.json',
     url_base + 'clean-scare.json',
     'Clean names only, with scare quotes. Changes on every mention.',
   ],

   [ 'clean+NSFW | unquoted',
     // url_base + '68ffotpfvdzxtu3/combined.json',
     url_base + 'combined.json',
     'Combined list of clean and dirty names. Changes with every mention.',
   ],

   [ 'NSFW | unquoted',
     // url_base + 'utie738lu03j1a4/dirty.json',
     url_base + 'dirty.json',
     'Only curseword names list of clean and dirty names. Changes with every mention.',
   ],

   [ 'clean | unquoted',
     // url_base + 'xywl436wxlgquw1/clean.json',
     url_base + 'clean.json',
     'Clean names only. Changes with every mention.',
   ],

   [ 'clean | unquoted | daily',
     // url_base + '3qr1gr1hklloa42/clean-daily.json',
     url_base + 'clean-daily.json',
     'Clean names only. Changes only once a day.',
   ],
   [ 'clean | unquoted | highlight',
     // url_base + '9uqvrozh0jo65jj/clean-highlight.json',
     url_base + 'clean-highlight.json',
     'Clean names only. Highlight.',
   ],
   [ 'Drumpf',
     // url_base + 'yejjt5nsoc1ooqo/drumpf.json',
     url_base + 'drumpf.json',
     'Always Drumpf (John Oliver mode)',
   ],
  ],
};


