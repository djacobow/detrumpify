
// just a simple script to do an xhr, but on a background page,
// getting away from content page restrictions
chrome.runtime.onMessage.addListener(function(msg,sender,cb) {
 console.log(msg);
 var xhr = new XMLHttpRequest();
 xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
   text = xhr.responseText;
   rv = {};
   rv.text = xhr.responseText;
   rv.status = xhr.status;
   rv.err = ((xhr.status < 200) || (xhr.status >= 300)) ? 'not_200' : 'OK';;
   // console.log('got');
   // console.log(rv);
   cb(rv);
  };
 };
 if (msg.cmd == 'get') {
   // console.log("getting: " + msg.url);
   var source = msg.url;
   // extra weirdness to force dropbox to download rather than page,
   // and the date to force no cache
   source += '?dl=1&_=' + (new Date).getTime();
   xhr.open('GET',source,true);
   xhr.send();
 } else {
   cb({'status':0,'err':'not_a_get','text':''});
 }
 // to tell chrome to let us call the cb after
 // returning we must return true;
 return true;
});

