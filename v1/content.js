var replacements = [
"70s Vintage Shag Carpet",
"Abandoned Roadside Ham Hock",
"Adult Blobfish",
"Bag of Flour",
"Bag of Toxic Sludge",
"Bewildered, Golden-Helmeted Astronaut Who’s Just Landed on This Planet from a Distant Galaxy",
"Blackening Scab Artfully Hiding in Your Raisin Bran",
"Bone-in Ham",
"Brightly Burning Trash Fire",
"Bursting Landfill of Municipal Solid Waste",
"Candied Yam Riddled with Moldy Spider Carcasses",
"Carnivorous Plant Watered with Irradiated Bat Urine",
"Cartoon Representation of Irritable Bowel Syndrome in a Pharmaceutical Ad",
"Cheeto-Dusted Bloviator",
"Cheeto-Faced Ferret",
"Cheeto Jesus",
"Chester Cheetah Impersonator",
"Class Clown that Everyone Wishes Would Be Quiet and Let The Class Learn",
"Cryogenically Frozen Bog Man",
"Day-Glo Roadside Billboard About Jock Itch",
"Decomposing Ear of Corn",
"Decomposing Pumpkin Pie Inhabited by Viciious Albino Squirrels",
"Deflated Football",
"Disappointment",
"Disgraced Racist",
"Dishrag that on Closer Inspection is Alive with Maggots",
"Dusty Barrel of Fermented Peepee",
"Empty Popcorn Bag Rotting in the Sun",
"Enlarged Pee-Splattered Sno Cone",
"Enraged Gak Spill",
"Enraged, Bewigged Fetus Blown up to Nightmarish Size",
"Fart-Infused Lump of Raw Meat",
"Fiberglass-Topped Tantrum Thrower",
"Figurative Rubber, and also Literal Rubber",
"Flatulent Leather Couch",
"Fossilized Meatball",
"Four-Time Bankruptcy Filer and Setthing Hernia Mass",
"full-Grown Monopoly Dog Carefully Balancing a Spongecake Atop His Head",
"Futire Leader of the Free World",
"Fuzzy Meat-Wad",
"Gangrenous Gaping Wound",
"Gender-Threatened Lead Paint Factory Explosion",
"Glistening, Shouting Gristle Mass with a History of Saying Terrible and Stupid Things",
"Great Judgement-Haver",
"Hair Furor",
"Hair Plug Swollen with Rancid Egg Whites",
"Hair That You Pluck, Causing a Cluster of Hairs to Sprout in Its Place",
"Hairpiece Come to Life",
"Heaving Carcass",
"Horking Mole-Creature Suffering from Radioactive Spray-Tan",
"Horsehair Mattress Stuffed with Molding Copies of Hustler",
"Human-Shaped Wad of Gak",
"Human-Sized Infectious Microbe",
"Human Equivalent of Cargo Pants that Zip Away into Shorts",
"Human Kinder Egg Whose Inner Surprise is a Tiny Pebble of Rat Shit",
"Human/Komodo Dragon Hybrid",
"Idiot Magnet",
"Inside-Out Lower Intestine",
"KKK Rally Port-a-Potty Holding Tank",
"Lamprey Eel Spray-Painted Gold",
"Lead Paint Factory Explosion",
"Little Gloves",
"Lumbering Human-Life Tardigrade",
"Malfunctioning Wind Turbine",
"Malignant Corn Chip",
"Man-Baby",
"Man-Shaped Asbestos Insulation Board",
"Man-Sized Sebaceous Cyst",
"Man who Cherishes Women",
"Man Who Could One Day Become the First Hobgoblin to Enter The White House",
"Man with the Hair of a Radioactive Skunk",
"Mangled Apricot Hellbeast",
"Melting Businessman",
"Melting Pig Carcass",
"Monument to Human Hubris Crafted out of Rotting Spam",
"Mountain of Rotting Whale Blubber",
"Nacho Cheese Golem",
"Narcissistic Bowl of Rotten Gazpacho",
"Neo-Fascist Real Estate Golem",
"Neon-Tinted Hellion",
"New Superfood Made of Finely-Ground Clown Wigs",
"Normal-Looking Human Man and Entirely Credible Choice as Future Leader of the Free World",
"Noted Troll",
"Numpty",
"Orange Muppet",
"Oversized Wasp Exoskeleton Stuffed with Old Mustard",
"Own Best Parody",
"Pair of Chapped Lips Superglued to a Hairball",
"Parental Pile of Burnt Organic Material",
"Play-Doh Factory Explosion",
"Plentiful Field of Dung Piled into the Shape of a Presidential Candidate",
"Pond Scum",
"Poorly-Drawn Fascist",
"Poorly-Trained Circus Organgutan",
"Presidential Candidate and Bargain Bin Full of Yellowing Jean-Claude Van Damme Movies",
"Racist Teratoma",
"Racist, Sexist Block of Aged Cheddar",
"Republican Frontrunner and 250-pound Accumulation of Rancid Beef",
"Rich Idiot Willing to Allow Garbage to Fall Out of His Mouth Without Batting a Single Golden Lash",
"Roiling Cheez Whiz Mass",
"Rumpelstiltskin Inflated with a Bike Pump and Filled with Bacteria",
"Scab You Wish You Hadn\"t Picked",
"Screaming Giant Cheese Wedge",
"Seagull Dipped in Tikka Masala",
"Seeping Fleabag",
"Self-Tanning Enthusiast",
"Sentient Hate-Balloon",
"Sentient Waste Disposal Plant",
"Shriveled Pinto Bean You Had to Pluck out of Your Chipotle Burrito Basket",
"Sloshing Styrofoam Takeout Container Filled with Three-Day-Old Mac and Cheese",
"Soggy Burlap Sack",
"Sputum-Filled Orange Julius",
"Stately Hot Dog Casing",
"Sticky, Grabby, Cheeto-Hued Toddler with No Sense of Adult Deportment",
"Sun-Dried Tomato",
"Sunken, Corroding Soufflé",
"Swollen Earthworm Gizzard",
"Talking Comb-Over",
"Tattered Craigslist Sofa",
"Temperamental Gelatinous Sponge",
"The Sculpture your Three-Year-Old Made but of Soggy Ground-Up Goldfish Snacks",
"Tiny Piece of Dried Cat Poop that You Found in Your Rug",
"Unconvincing Presidential Simulation",
"Uncooked Chicken Breast",
"Undead Tangerine",
"Unkempt Troll Doll Found Floating Facedown in a Tub of Rancid Beluga Caviar",
"Used Q-tip",
"Usually Reasonable Burlap Sack Full of Rancid Peeps",
"Walking Irradiated Tumor",
"Walking Pile of Reanimated Roadkill",
"Wax Museum Figure on a Very Hot Day",
"Weapons-Grade Plum",
"Yellowing Hunk of Masticated Gristle",
"Your Next President and Ruler for Life",
"“Taco truck”",
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
