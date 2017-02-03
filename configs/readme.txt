The files in this folder are not distributed with the extension. Rather,
make_variations.py is used to generate an array of .json config files
that the extension fetches live from a server. This way, the insults 
in the extension can be updated without requiring that the extension
itself be updated. This is especially important for Firefox, where 
update approvals can take weeks.

This folder contains the files necessary to generate config files for
older versions of the extension.

The 'v2' subfolder contains a similar make_variations_v2.py that works
with the current extension. I maintain the original since there are a 
lot of people still running old versions of the extension.

