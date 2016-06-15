
var replacements = [
'Seagull dipped in tikka masala',
'Bursting landfill of municipal solid waste',
'Mountain of rotting whale blubber',
'Sputum-filled Orange Julius',
'Gangrenous gaping wound',
'Racist, sexist block of aged Cheddar',
'Oversized wasp exoskeleton stuffed with old mustard',
'Neo-fascist real estate golem',
'Abandoned roadside ham hock',
'Bewildered, golden-helmeted astronaut who’s just landed on this planet from a distant galaxy',
'Monument to human hubris crafted out of rotting Spam',
'A walking pile of reanimated roadkill',
'Heaving carcass',
'Stately hot dog casing',
'Flatulent leather couch',
'Swollen earthworm gizzard',
'Narcissistic bowl of rotten gazpacho',
'Yellowing hunk of masticated gristle',
'A human/Komodo dragon hybrid',
'Blackening scab artfully hiding in your Raisin Bran',
'“Taco truck”',
'A man who could one day become the first hobgoblin to enter the White House',
'A pair of chapped lips superglued to a hairball',
'Horsehair mattress stuffed with molding copies of Hustler',
'Malignant corn chip',
'Human Kinder Egg whose inner surprise is a tiny pebble of rat shit',
'The sculpture your three-year-old made out of soggy ground-up goldfish snacks',
'A man with the hair of a radioactive skunk',
'Roiling Cheez Whiz mass',
'Cryogenically frozen bog man',
'A glistening, shouting gristle mass with a history of saying terrible and stupid things',
'Screaming giant cheese wedge',
'Republican frontrunner and 250-pound accumulation of rancid beef',
'Day-Glo roadside billboard about jock itch',
'Temperamental gelatinous sponge',
'Sentient hate-balloon',
'A Rumpelstiltskin inflated with a bike pump and filled with bacteria',
'Sun-kissed ass plug',
'Self-tanning enthusiast',
'An enraged, bewigged fetus blown up to nightmarish size',
'Parental pile of burnt organic material',
'Human-shaped wad of Gak',
'Walking irradiated tumor',
'Uncooked chicken breast',
'KKK rally port-a-potty holding tank',
'Neon-tinted hellion',
'A plentiful field of dung piled into the shape of a presidential candidate',
'Malfunctioning wind turbine',
'Seeping fleabag',
'Sloshing styrofoam takeout container filled with three-day-old mac and cheese',
'A sticky, grabby, Cheeto-hued toddler with no sense of adult deportment',
'Figurative rubber, and also literal rubber',
'A carnivorous plant watered with irradiated bat urine',
'Sentient waste disposal plant',
'A disappointment',
'Poorly-drawn fascist',
'Racist teratoma',
'Lamprey eel spray-painted gold',
'A hair that you pluck, causing a cluster of hairs to sprout in its place',
'Sunken, corroding soufflé',
'Nacho cheese golem',
'Undead tangerine',
'A cartoon representation of Irritable Bowel Syndrome in a pharmaceutical ad',
'Fossilized meatball',
'Horking mole-creature suffering from radioactive spray-tan',
'Tattered Craigslist sofa',
'A full-grown Monopoly dog carefully balancing a spongecake atop his head',
'Play-Doh factory explosion',
'A new superfood made of finely-ground clown wigs',
'Unkempt troll doll found floating facedown in a tub of rancid Beluga caviar',
];

var count = 10;

function switchem() {
    console.log("run:" + count.toString());
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];

            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var whichever = Math.floor(replacements.length * Math.random());
                var replacement = replacements[whichever];
                var replacedText = text.replace(/(Donald\s*(J\.?\s*)?)?Trump/g, replacement);
                if (replacedText !== text) {
                    // console.log("REPL: " + replacedText);
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }
    count -= 1;
    if (count) {
        setTimeout(switchem,2000);
    }
}

setTimeout(switchem, 2000);

