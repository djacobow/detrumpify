var replacements = [
'Seagull Dipped in Tikka Masala',
'Bursting Landfill of Municipal Solid Waste',
'Mountain of Rotting Whale Blubber',
'Sputum-Filled Orange Julius',
'Gangrenous Gaping Wound',
'Racist, Sexist Block of Aged Cheddar',
'Oversized Wasp Exoskeleton Stuffed with Old Mustard',
'Neo-Fascist Real Estate Golem',
'Abandoned Roadside Ham Hock',
'Bewildered, Golden-Helmeted Astronaut Who’s Just Landed on This Planet from a Distant Galaxy',
'Monument to Human Hubris Crafted out of Rotting Spam',
'Walking Pile of Reanimated Roadkill',
'Heaving Carcass',
'Stately Hot Dog Casing',
'Flatulent Leather Couch',
'Swollen Earthworm Gizzard',
'Narcissistic Bowl of Rotten Gazpacho',
'Yellowing Hunk of Masticated Gristle',
'Human/Komodo Dragon Hybrid',
'Blackening Scab Artfully Hiding in Your Raisin Bran',
'“Taco truck”',
'Man Who Could One Day Become the First Hobgoblin to Enter The White House',
'Pair of Chapped Lips Superglued to a Hairball',
'Horsehair Mattress Stuffed with Molding Copies of Hustler',
'Malignant Corn Chip',
'Human Kinder Egg Whose Inner Surprise is a Tiny Pebble of Rat Shit',
'The Sculpture your Three-Year-Old Made but of Soggy Ground-Up Goldfish Snacks',
'Man with the Hair of a Radioactive Skunk',
'Roiling Cheez Whiz Mass',
'Cryogenically Frozen Bog Man',
'Glistening, Shouting Gristle Mass with a History of Saying Terrible and Stupid Things',
'Screaming Giant Cheese Wedge',
'Republican Frontrunner and 250-pound Accumulation of Rancid Beef',
'Day-Glo Roadside Billboard About Jock Itch',
'Temperamental Gelatinous Sponge',
'Sentient Hate-Balloon',
'Rumpelstiltskin Inflated with a Bike Pump and Filled with Bacteria',
'Sun-kissed Ass Plug',
'Self-Tanning Enthusiast',
'Enraged, Bewigged Fetus Blown up to Nightmarish Size',
'Parental Pile of Burnt Organic Material',
'Human-Shaped Wad of Gak',
'Walking Irradiated Tumor',
'Uncooked Chicken Breast',
'KKK Rally Port-a-Potty Holding Tank',
'Neon-Tinted Hellion',
'Plentiful Field of Dung Piled into the Shape of a Presidential Candidate',
'Malfunctioning Wind Turbine',
'Seeping Fleabag',
'Sloshing Styrofoam Takeout Container Filled with Three-Day-Old Mac and Cheese',
'Sticky, Grabby, Cheeto-Hued Toddler with No Sense of Adult Deportment',
'Figurative Rubber, and also Literal Rubber',
'Carnivorous Plant Watered with Irradiated Bat Urine',
'Sentient Waste Disposal Plant',
'Disappointment',
'Poorly-~rawn Fascist',
'Racist Teratoma',
'Lamprey Eel Spray-Painted Gold',
'Hair That You Pluck, Causing a Cluster of Hairs to Sprout in Its Place',
'Sunken, Corroding Soufflé',
'Nacho Cheese Golem',
'Undead Tangerine',
'Cartoon Representation of Irritable Bowel Syndrome in a Pharmaceutical Ad',
'Fossilized Meatball',
'Horking Mole-Creature Suffering from Radioactive Spray-Tan',
'Tattered Craigslist Sofa',
'full-Grown Monopoly Dog Carefully Balancing a Spongecake Atop His Head',
'Play-Doh Factory Explosion',
'New Superfood Made of Finely-Ground Clown Wigs',
'Unkempt Troll Doll Found Floating Facedown in a Tub of Rancid Beluga Caviar',
];

var count = 5;

function switchem() {
    console.log("run : " + count.toString());
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
        setTimeout(switchem,4000);
    }
}

setTimeout(switchem, 4000);

