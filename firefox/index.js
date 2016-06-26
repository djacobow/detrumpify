var self = require("sdk/self");
var pageMod = require("sdk/page-mod");
// console.log('index.js');

var websites = [
  'cnn.com',
  'bbc.com',
  'bbc.co.uk',
  'guardian.co.uk',
  'guardian.com',
  'nytimes.com',
  'facebook.com',
  'washingtonpost.com',
  'salon.com',
  'slate.com',
  'buzzfeed.com',
  'vox.com',
  'huffingtonpost.com',
  'wsj.com',
  'economist.com',
  'latimes.com',
  'dallasnews.com',
  'usatoday.com',
  'denverpost.com',
  'insidedenver.com',
  'philly.com',
  'chron.com',
  'detroitnews.com',
  'freep.com',
  'boston.com',
  'newsday.com',
  'startribune.com',
  'nypost.com',
  'ajc.com',
  'nj.com',
  'sfchronicle.com',
  'azcentral.com',
  'chicagotribune.com',
  'cleveland.com',
  'oregonlive.com',
  'tampatribune.com',
  'signonsandiego.com',
  'mercurynews.com',
  'contracostatimes.com',
  'insidebayarea.com',
  'feedly.com',
  'reddit.com',
];

var sformatted = websites.map(function(cv) { return '*.' + cv; });
// console.log(sformatted);

pageMod.PageMod({
  include: sformatted,
  contentScriptFile: self.data.url("content.js")
});

