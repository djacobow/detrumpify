var replacements = [
    'Used Q-tip',
    '70s Vintage Shag Carpet',
    'Idiot Magnet',
    'Gender-Threatened Lead Paint Factory Explosion',
    'Cheeto Jesus',
    'Bone-in Ham',
    'Four-Time Bankruptcy Filer and Setthing Hernia Mass',
    'Sun-Dried Tomato',
    'Adult Blobfish',
    'Deflated Football',
    'Fart-Infused Lump of Raw Meat',
    'Melting Pig Carcass',
    'Disgraced Racist',
    'Talking Comb-Over',
    'Human Equivalent of Cargo Pants that Zip Away into Shorts',
    'Cheeto-Dusted Bloviator',
    'Fuzzy Meat-Wad',
    'Bag of Flour',
    'Man who Cherishes Women',
    'Futire Leader of the Free World',
    'Decomposing Ear of Corn',
    'Own Best Parody',
    'Rich Idiot Willing to Allow Garbage to Fall Out of His Mouth Without Batting a Single Golden Lash',
    'Pond Scum',
    'Noted Troll',
    'Class Clown that Everyone Wishes Would Be Quiet and Let The Class Learn',
    'Melting Businessman',
    'Wax Museum Figure on a Very Hot Day',
    'Soggy Burlap Sack',
    'Bag of Toxic Sludge',
    'Your Next President and Ruler for Life',
    'Brightly Burning Trash Fire',
    'Great Judgement-Haver',
    'Man-Sized Sebaceous Cyst',
    'Enlarged Pee-Splattered Sno Cone',
    'Empty Popcorn Bag Rotting in the Sun',
    'Man-Shaped Asbestos Insulation Board',
    'Hair Plug Swollen with Rancid Egg Whites',
    'Inside-Out Lower Intestine',
    'Dusty Barrel of Fermented Peepee',
    'Usually Reasonable Burlap Sack Full of Rancid Peeps',
    'Presidential Candidate and Bargain Bin Full of Yellowing Jean-Claude Van Damme Movies',
    'Hairpiece Come to Life',
    'Normal-Looking Human Man and Entirely Credible Choice as Future Leader of the Free World',
    'Decomposing Pumpkin Pie Inhabited by Viciious Albino Squirrels',
    'Dishrag that on Closer Inspection is Alive with Maggots',
    'Lead Paint Factory Explosion',
    'Candied Yam Riddled with Moldy Spider Carcasses',
    'Enraged Gak Spill',
    'Shriveled Pinto Bean You Had to Pluck out of Your Chipotle Burrito Basket',
    'Human-Sized Infectious Microbe',
    'Poorly-Trained Circus Organgutan',
    'Chester Cheetah Impersonator',
    'Lumbering Human-Life Tardigrade',
    'Tiny Piece of Dried Cat Poop that You Found in Your Rug',
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
    'Poorly-Drawn Fascist',
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
    'Cheeto-Faced Ferret',
    'Orange Muppet',
    'Mangled Apricot Hellbeast',
    'Little Gloves',
    'Numpty',
    'Weapons-Grade Plum',
    'Hair Furor',
    'Man-Baby',
];

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
        setTimeout(switchem,currTimeout);
        if (currTimeout < maxTimeout) currTimeout *= 2;
    }
}

setTimeout(switchem, currTimeout);
if (currTimeout < maxTimeout) currTimeout *= 2;
