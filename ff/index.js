var self = require("sdk/self");
var pageMod = require("sdk/page-mod");

console.log("Starting index.js");

pageMod.PageMod({
  include: [ 
               /https?:\/\/(\w+\.)?nytimes.com\//,
               /https?:\/\/(\w+\.)?facebook.com\//,
               /https?:\/\/(\w+\.)?washingtonpost.com\//,
               /https?:\/\/(\w+\.)?salon.com\//,
               /https?:\/\/(\w+\.)?slate.com\//,
               /https?:\/\/(\w+\.)?buzzfeed.com\//,
               /https?:\/\/(\w+\.)?vox.com\//,
               /https?:\/\/(\w+\.)?huffingtonpost.com\//,
               /https?:\/\/(\w+\.)?wsj.com\//,
               /https?:\/\/(\w+\.)?economist.com\//,
               /https?:\/\/(\w+\.)?latimes.com\//,
               /https?:\/\/(\w+\.)?dallasnews.com\//,
               /https?:\/\/(\w+\.)?usatoday.com\//,
               /https?:\/\/(\w+\.)?denverpost.com\//,
               /https?:\/\/(\w+\.)?insidedenver.com\//,
               /https?:\/\/(\w+\.)?philly.com\//,
               /https?:\/\/(\w+\.)?chron.com\//,
               /https?:\/\/(\w+\.)?detnews.com\//,
               /https?:\/\/(\w+\.)?freep.com\//,
               /https?:\/\/(\w+\.)?boston.com\//,
               /https?:\/\/(\w+\.)?newsday.com\//,
               /https?:\/\/(\w+\.)?startribune.com\//,
               /https?:\/\/(\w+\.)?nypost.com\//,
               /https?:\/\/(\w+\.)?ajc.com\//,
               /https?:\/\/(\w+\.)?nj.com\//,
               /https?:\/\/(\w+\.)?sfchronicle.com\//,
               /https?:\/\/(\w+\.)?azcentral.com\//,
               /https?:\/\/(\w+\.)?chicagotribune.com\//,
               /https?:\/\/(\w+\.)?cleveland.com\//,
               /https?:\/\/(\w+\.)?oregonlive.com\//,
               /https?:\/\/(\w+\.)?tampatribune.com\//,
               /https?:\/\/(\w+\.)?signonsandiego.com\//,
               /https?:\/\/(\w+\.)?mercurynews.com\//,
               /https?:\/\/(\w+\.)?contracostatimes.com\//,
               /https?:\/\/(\w+\.)?insidebayarea.com\//,
               /https?:\/\/(\w+\.)?feedly.com\//,
           ],
  contentScriptFile: self.data.url("content.js")
});

