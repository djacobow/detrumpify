var currTimeout = 1000;
var maxTimeout = 120000;
var count = 5;

function switchem() {
    // console.log("run : " + count.toString());
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var whichever = Math.floor(replacements.length * Math.random());
                var replacement = replacements[whichever];
                var replacedText = text.replace(/(Donald\s*(J\.?\s*)?)?Trump(?!\w)/g, replacement);
                if (replacedText !== text) {
                    // console.log("REPL: " + replacedText);
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
    count -= 1;
    if (count) {
        setTimeout(switchem,currTimeout);
        if (currTimeout < maxTimeout) currTimeout *= 2;
    }
}

setTimeout(switchem, currTimeout);
if (currTimeout < maxTimeout) currTimeout *= 2;
