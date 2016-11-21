#!/usr/bin/python
# -*- coding: utf-8 -*-

import copy
import json
import re

base = {
    'schema': 'InsultMarkupLanguage/0.1',
    'refresh_age': 604800000,
    'run_info': {
        'count': 15,
        'startTimeout': 1000,
        'maxTimeout': 30000,
        'timeMultiplier': 1.8,
    },
    'whitelist': [
        "www.foxnews.com", "cnn.com", "www.bbc.com/news",
        "www.bbc.co.uk/news", "www.theguardian.com", "www.theguardian.co.uk",
        "nytimes.com", "facebook.com", "washingtonpost.com", "salon.com",
        "slate.com", "buzzfeed.com", "vox.com", "huffingtonpost.com",
        "wsj.com", "economist.com", "latimes.com", "dallasnews.com",
        "usatoday.com", "denverpost.com", "insidedenver.com", "philly.com",
        "chron.com", "detroitnews.com", "freep.com", "boston.com",
        "newsday.com", "startribune.com", "nypost.com", "ajc.com", "nj.com",
        "sfgate.com", "sfchronicle.com", "azcentral.com", "chicagotribune.com",
        "cleveland.com", "oregonlive.com", "tampatribune.com",
        "signonsandiego.com", "mercurynews.com", "contracostatimes.com",
        "insidebayarea.com", "feedly.com", "reddit.com",
        "drudgereport.com", "theblaze.com", "breitbart.com","ijreview.com",
        "newsmax.com", "wnd.com", "dailycaller.com", "washingtontimes.com",
        "nationalreview.com", "townhall.com", "freerepublic.com",
        "pjmedia.com", "hotair.com", "cnsnews.com", "westernjournalism.com",
        "washingtonexaminer.com", "tpnn.com", "newsbusters.org",
        "twitchy.com",
    ],
    'actions': {
        'trump': {
            'find_regex': [
                "((Donald|DONALD)\\s*(J\\.?\\s*)?)?(Trump|TRUMP)(?!\\w)", "g"
            ],
            'randomize_mode': 'always',
        },
        'pence': {
            'find_regex': [
                "\\b((Mike|Michael)\\s*)?Pence(?!\\w)", "g"
            ],
            'randomize_mode': 'always',
        },
        'alt-right': {
            'find_regex': [
                "\\b(?!([Aa]|[Aa]n|[Tt]he)\\s)[Aa]lt[- ][Rr]ight(?!\\w)", "g",
            ],
            'randomize_mode': 'always',
        }
    }
}

monikers = {
  'trump': {
    'clean': [
      "Gaffe-Prone Lunatic",
      "Human-Toupee Hybrid",
      "Decomposing Jack-O-Lantern",
      "Angry Creamsicle",
      "The Kindest, Bravest, Warmest, Most Wonderful Human Being You'll Ever Know in Your Life",
      "Walking Faux Luxury Brand",
      "Real-Estate Tycoon with Simple, Stupid Plan to Defeat ISIS",
      "Self-Proclaimed Ponderer of Incest",
      "Wall Construction Expert",
      "Frequent Provider of Unsolicited Judgements Regarding Female Attractiveness",
      "Unrepentant Birther",
      "Serial Propogator of Demonstrable Falsehoods",
      "Harkener to Unspecified Moment of American Greatness",
      "Master of Zero-Sum Business Deals",
      "Purveyor of Lousy Steak",
      "Angrily Reanimated Christmas Ham",
      "Short-Findered Vulgarian",
      "Weirdly Authoritarian Gingerbread Man",
      "Traditional Values Adulterer with Two Ex-Wives",
      "Rage Tribble",
      "Unconvincing Presidential Simulation",
      "Scab You Wish You Hadn't Picked",
      "Idiot Media Savant",
      "Fiberglass-Topped Tantrum Thrower",
      "Used Q-tip",
      "Idiot Magnet",
      "Gender-Threatened Lead Paint Factory Explosion",
      "70's-Vintage Umber Shag Carpet",
      "Cheeto Jesus",
      "Bone-in Ham",
      "Four-Time Bankruptcy Filer and Seething Hernia Mass",
      "Sun-Dried Tomato",
      "Adult Blobfish",
      "Deflated Football",
      "Fart-Infused Lump of Raw Meat",
      "Melting Pig Carcass",
      "Disgraced Racist",
      "Talking Comb-Over",
      "Human Equivalent of Cargo Pants that Zip Away into Shorts",
      "Cheeto-Dusted Bloviator",
      "Fuzzy Meat-Wad",
      "Bag of Flour",
      "Man Who Cherishes Women",
      "Future Leader of the Free World",
      "Decomposing Ear of Corn",
      "Own Best Parody",
      "Rich Idiot Willing to Allow Garbage to Fall Out of His Mouth Without Batting a Single Golden Lash",
      "Pond Scum",
      "Noted Troll",
      "Class Clown that Everyone Wishes Would Be Quiet and Let The Class Learn",
      "Melting Businessman",
      "Wax Museum Figure on a Very Hot Day",
      "Soggy Burlap Sack",
      "Bag of Toxic Sludge",
      "President and Ruler for Life",
      "Brightly Burning Trash Fire",
      "Great Judgement-Haver",
      "Man-Sized Sebaceous Cyst",
      "Enlarged Pee-Splattered Sno Cone",
      "Empty Popcorn Bag Rotting in the Sun",
      "Man-Shaped Asbestos Insulation Board",
      "Hair Plug Swollen with Rancid Egg Whites",
      "Inside-Out Lower Intestine",
      "Dusty Barrel of Fermented Peepee",
      "Usually Reasonable Burlap Sack Full of Rancid Peeps",
      "Presidential Candidate and Bargain Bin Full of Yellowing Jean-Claude Van Damme Movies",
      "Hairpiece Come to Life",
      "Normal-Looking Human Man and Entirely Credible Choice as Future Leader of the Free World",
      "Decomposing Pumpkin Pie Inhabited by Vicious Albino Squirrels",
      "Dishrag that on Closer Inspection is Alive with Maggots",
      "Lead Paint Factory Explosion",
      "Candied Yam Riddled with Moldy Spider Carcasses",
      "Enraged Gak Spill",
      "Shriveled Pinto Bean You Had to Pluck out of Your Chipotle Burrito Basket",
      "Human-Sized Infectious Microbe",
      "Poorly-Trained Circus Organgutan",
      "Chester Cheetah Impersonator",
      "Lumbering Human-Life Tardigrade",
      "Tiny Piece of Dried Cat Poop that You Found in Your Rug",
      "Seagull Dipped in Tikka Masala",
      "Bursting Landfill of Municipal Solid Waste",
      "Mountain of Rotting Whale Blubber",
      "Sputum-Filled Orange Julius",
      "Gangrenous Gaping Wound",
      "Racist, Sexist Block of Aged Cheddar",
      "Oversized Wasp Exoskeleton Stuffed with Old Mustard",
      "Neo-Fascist Real Estate Golem",
      "Abandoned Roadside Ham Hock",
      "Bewildered, Golden-Helmeted Astronaut Who’s Just Landed on This Planet from a Distant Galaxy",
      "Monument to Human Hubris Crafted out of Rotting Spam",
      "Walking Pile of Reanimated Roadkill",
      "Heaving Carcass",
      "Stately Hot Dog Casing",
      "Flatulent Leather Couch",
      "Swollen Earthworm Gizzard",
      "Narcissistic Bowl of Rotten Gazpacho",
      "Yellowing Hunk of Masticated Gristle",
      "Human/Komodo Dragon Hybrid",
      "Blackening Scab Artfully Hiding in Your Raisin Bran",
      "“Taco truck”",
      "Man Who Could One Day Become the First Hobgoblin to Enter The White House",
      "Pair of Chapped Lips Superglued to a Hairball",
      "Horsehair Mattress Stuffed with Molding Copies of Hustler",
      "Malignant Corn Chip",
      "Human Kinder Egg Whose Inner Surprise is a Tiny Pebble of Rat Shit",
      "The Sculpture your Three-Year-Old Made but of Soggy Ground-Up Goldfish Snacks",
      "Man with the Hair of a Radioactive Skunk",
      "Roiling Cheez Whiz Mass",
      "Cryogenically Frozen Bog Man",
      "Glistening, Shouting Gristle Mass with a History of Saying Terrible and Stupid Things",
      "Screaming Giant Cheese Wedge",
      "250-pound Accumulation of Rancid Beef",
      "Day-Glo Roadside Billboard About Jock Itch",
      "Temperamental Gelatinous Sponge",
      "Sentient Hate-Balloon",
      "Rumpelstiltskin Inflated with a Bike Pump and Filled with Bacteria",
      "Self-Tanning Enthusiast",
      "Enraged, Bewigged Fetus Blown up to Nightmarish Size",
      "Parental Pile of Burnt Organic Material",
      "Human-Shaped Wad of Gak",
      "Walking Irradiated Tumor",
      "Uncooked Chicken Breast",
      "KKK Rally Port-a-Potty Holding Tank",
      "Neon-Tinted Hellion",
      "Plentiful Field of Dung Piled into the Shape of a President",
      "Malfunctioning Wind Turbine",
      "Seeping Fleabag",
      "Sloshing Styrofoam Takeout Container Filled with Three-Day-Old Mac and Cheese",
      "Sticky, Grabby, Cheeto-Hued Toddler with No Sense of Adult Deportment",
      "Figurative Rubber, and also Literal Rubber",
      "Carnivorous Plant Watered with Irradiated Bat Urine",
      "Sentient Waste Disposal Plant",
      "Disappointment",
      "Poorly-Drawn Fascist",
      "Racist Teratoma",
      "Lamprey Eel Spray-Painted Gold",
      "Hair That You Pluck, Causing a Cluster of Hairs to Sprout in Its Place",
      "Sunken, Corroding Soufflé",
      "Nacho Cheese Golem",
      "Undead Tangerine",
      "Cartoon Representation of Irritable Bowel Syndrome in a Pharmaceutical Ad",
      "Fossilized Meatball",
      "Horking Mole-Creature Suffering from Radioactive Spray-Tan",
      "Tattered Craigslist Sofa",
      "Full-Grown Monopoly Dog Carefully Balancing a Spongecake Atop His Head",
      "Play-Doh Factory Explosion",
      "New Superfood Made of Finely-Ground Clown Wigs",
      "Unkempt Troll Doll Found Floating Facedown in a Tub of Rancid Beluga Caviar",
      "Cheeto-Faced Ferret",
      "Orange Muppet",
      "Mangled Apricot Hellbeast",
      "Little Gloves",
      "Numpty",
      "Weapons-Grade Plum",
      "Hair Fuehrer",
      "Man-Baby",
      "Ambitious Corn Dog that Escaped from the Concession Stand at a Rural Alabama Fairground, Stole an Unattended Wig, Hopped a Freight Train to Atlantic City and Never Looked Back",
      "Ugly Racist",
      "Wealthy Inheritor Disguised as Successful Businessman",
      "National Embarrassment",
      "Wart We Can't Freeze Off Until November",
      "Microwaved Circus Peanut",
      "Talking Dingleberry",
      "Republican Babadook",
      "El Caudillo de Mar-a-Lago",
      "Shouting, Rotting Papaya",
      "Impotent Orangutan",
      "Famed Shouting Tycoon",
      "Mutant Carrot",
      "Spittle-Flecked Carrot",
      "Epic Fart that Just Won't Dissipate",
      "Gibberish Volcano",
      "Shaved Tribble",
      "Pile of Rotten Orange Peels in a Suit",
      "Rotting Pumpkin",
      "Deplorables Coach",
      "Putin Puppet",
      "Projector-in-Chief",
      "Soon-to-be-Fired Reality Show Contestant",
      "Unreliable Narrator of Awful Story",
      "Biff Tannen",
      "Swirling Black Hole that Eats Good Sense",
      "Self-Avowed Perpetrator of Sexual Assault",
      "President Worse than W, Despite How Improbable Used to Sound",
      "Sociopathic Operating System Installed on a Frightened Child",
      "Everything Wrong with America, Made into Living Flesh,"
      "Manchurian Combover",
      "Cheeto Benito",
      "Scammer-in-Chief",
    ],
    'dirty': [
      "Fuckface von Clownstick",
      "Billionaire and Person Who, Having Won the Fucking Presidency Without Any Qualifications, Inexplicably Believes the World is Set Against Him",
      "Political Ass Clown",
      "Vacuous Dipshit",
      "Degloved Zoo Penis",
      "Shithead",
      "Orange Asshat",
      "Idiot Cockwomble",
      "Ludicrous Tangerine Ballbag",
      "Incompressible Jizztrumpet",
      "Ferret-Wearing Shitgibbon",
      "Witless Fucking Cocksplat",
      "Buttplug Face",
      "Toupeed Fucktrumpet",
      "Human Turd",
      "High Oracle of Dipshittery",
      "Anus Lips",
    ],
  },
  'alt-right': {
    'clean': [
      "rebranded white nationalist",
      "hate filled",
      "white supremacist",
      "racist",
      "anti-semitic",
      "sexist",
    ],
    'dirty': [
    ],
  },
  'pence': {
    'clean': [
      "Dead-Ended Politician with Apparently Very Little to Lose",
      "Guy Who Probably Has Tried To Outlaw Dancing",
      "Champion of Homophobic Pizza Makers",
      "Numbnuts Sidekick",
      "Total Failure as a Congressman",
      "Emcee Pink",
      "I'm with Stupid",
      "Focus of Chris Christie's Unrelenting Jealous Rage",
      "Mini-Bigot",
      "Supposedly Solid, Solid Person",
      "Rush Limgaugh on Decaf, Except Never Funny",
      "Six Term Congressman with Perfect Record of Writing Zero Bills that Became Law",
      "Angry Second-Assistant High School Football Coach",
      "Person Correct About Global Warming, Probably, in Some Distant Parallel Universe",
      "Man to Be Remembered Primarily for His Willingness to Be Associated with Donald Trump",
      "Conservative-Looking Guy Sent from Central Casting",
    ],
    'dirty' : [
    ],
  },
}

url_base = 'http://toolsofourtools.org/detrumpify2/'

combos = {
    'disable.json': {
        'monikers': [],
        'button': {
            'name': 'Disable Detrumpify',
            'description': 'Temporarily disable Detrumpify',
        },
        'match_class': 'detrumpified',
    },
    'combined-scare.json': {
        'monikers': ['clean', 'dirty'],
        'bracket': [u'\u201c', u'\u201d'],
        'button': {
          'name': 'clean+NSFW | quoted | always changing',
          'description': 'Combined list of clean and dirty names, quoted. Changes with every mention.',
        },
        'match_class': 'detrumpified',
    },
    'clean-scare.json': {
        'monikers': ['clean', ],
        'bracket': [u'\u201c', u'\u201d'],
        'button': {
          'name': 'clean | quoted | always changing',
          'description': 'Clean names only, with scare quotes. Changes on every mention.',
        },
        'match_class': 'detrumpified',
    },
    'dirty-scare.json': {
        'monikers': ['dirty', ],
        'bracket': [u'\u201c', u'\u201d'],
        'button': {
          'name': 'NSFW | quoted | always changing',
          'description': 'Only curseword names, with scare quotes. Changes on every mention.',
        },
        'match_class': 'detrumpified',
    },
    'combined.json': {
        'monikers': ['clean', 'dirty'],
        'button': {
          'name': 'clean+NSFW | unquoted | always changing',
          'description': 'Combined list of clean and dirty names. Changes with every mention.',
        },
        'match_class': 'detrumpified',
    },
    'combined-daily.json': {
        'monikers': ['clean', 'dirty'],
        'randomize_mode': 'daily',
        'button': {
          'name': 'clean+NSFW | unquoted | changing daily',
          'description': 'Combined list of clean and dirty names. Changes daily.',
        },
        'match_class': 'detrumpified',
    },
    'clean-short.json': {
        'monikers': ['clean', ],
        'max_len': 3,
        'button': {
          'name': 'clean | unquoted | always changing | three words or fewer',
          'description': 'Short, clean names only. Change every mention.',
        },
        'match_class': 'detrumpified',
    },
    'combined-short.json': {
        'monikers': ['clean', 'dirty', ],
        'max_len': 3,
        'button': {
          'name': 'clean+NSFW | unquoted | always changing | three words or fewer',
          'description': 'Short, clean+NSFW names. Change every mention.',
        },
        'match_class': 'detrumpified',
    },
    'clean.json': {
        'monikers': ['clean', ],
        'button': {
          'name': 'clean | unquoted | always changing',
          'description': 'Clean names only. Changes with every mention.',
        },
        'match_class': 'detrumpified',
    },
    'dirty.json': {
        'monikers': ['dirty', ],
        'button': {
          'name': 'NSFW | unquoted | always changing',
          'description': 'Only curseword names. Changes with every mention.',
        },
        'match_class': 'detrumpified',
    },
    'clean-daily.json': {
        'monikers': ['clean', ],
        'randomize_mode': 'daily',
        'button': {
          'name': 'clean | unquoted | changing daily',
          'description': 'Clean names only. Changes only once a day.',
        },
        'match_class': 'detrumpified',
    },
    'clean-highlight.json': {
        'monikers': ['clean', ],
        'match_style': 'color: red;',
        'button': {
          'name': 'clean | highlight | always changing',
          'description': 'Clean names only. Highlight.',
        },
        'match_class': 'detrumpified',
    },
}

for comboname in combos:

    outdata = copy.deepcopy(base)
    empty_actions = []
    for person in monikers:
      outdata['actions'][person]['monikers'] = []
      for moniker_group in combos[comboname]['monikers']:
        for moniker in monikers[person][moniker_group]:
          max_len = combos[comboname].get('max_len',0)
          if max_len:
              act_len = len(re.split(r'[\s\-]',moniker))
              if act_len <= max_len:
                  outdata['actions'][person]['monikers'].append(moniker)
          else:
              outdata['actions'][person]['monikers'].append(moniker)

      for v in ['randomize_mode', 'match_style', 'match_class', 'bracket']:
        if v in combos[comboname]:
          outdata['actions'][person][v] = combos[comboname][v]

      if len(outdata['actions'][person]['monikers']) < 1:
        empty_actions.append(person)

    for action in empty_actions:
      outdata['actions'].pop(action,None)

    jsd = json.dumps(outdata)
    ofile = open(comboname, 'w')
    ofile.write(jsd)
    ofile.close()

ofile = open("insults.txt", "wb")
for moniker in sorted(monikers['trump']['clean']):
    ofile.write('"' + moniker + '",' + "\n")
ofile.close()


## button config file
bconfig = []
for comboname in combos:
  combos[comboname]['button']['url'] = url_base + comboname
  bconfig.append(combos[comboname]['button'])

bconfig.append({
  'name': 'Drumpf',
  'url': url_base + 'drumpf.json',
  'description': 'Always Drumpf (John Oliver mode)'
});

ofile = open('buttons_config.json',"w")
ofile.write(json.dumps(bconfig))
ofile.close()

