#!/usr/bin/env python3

import os
import os.path
import re
import struct
import imghdr
import json
from PIL import Image
from shutil import copyfile
from math import sqrt

# cribbed from https://stackoverflow.com/questions/8032642/how-to-obtain-image-size-using-standard-python-class-without-using-external-lib

def get_image_size(fname):
    im = Image.open(fname)
    w,h = im.size
    ar = h/w
    sz = w*h
    return {'w': w, 'h': h, 'ar': ar, 'sz': sz }

def get_image_size_old(fname):
    '''Determine the image type of fhandle and return its size.
    from draco'''
    with open(fname, 'rb') as fhandle:
        head = fhandle.read(24)
        if len(head) != 24:
            return
        if imghdr.what(fname) == 'png':
            check = struct.unpack('>i', head[4:8])[0]
            if check != 0x0d0a1a0a:
                return
            width, height = struct.unpack('>ii', head[16:24])
        elif imghdr.what(fname) == 'gif':
            width, height = struct.unpack('<HH', head[6:10])
        elif imghdr.what(fname) == 'jpeg':
            try:
                fhandle.seek(0) # Read 0xff next
                size = 2
                ftype = 0
                while not 0xc0 <= ftype <= 0xcf:
                    fhandle.seek(size, 1)
                    byte = fhandle.read(1)
                    while ord(byte) == 0xff:
                        byte = fhandle.read(1)
                    ftype = ord(byte)
                    size = struct.unpack('>H', fhandle.read(2))[0] - 2
                # We are at a SOFn block
                fhandle.seek(1, 1)  # Skip `precision' byte.
                height, width = struct.unpack('>HH', fhandle.read(4))
            except Exception: #IGNORE:W0703
                return
        else:
            return
        return {'w': width, 'h': height, 'ar': height / width, 'sz': height * width }


def getList(d):
    jp = re.compile(r'\.jpe?g$',re.IGNORECASE)
    return [f for f in os.listdir(d) if (os.path.isfile(os.path.join(d,f)) and jp.search(f))]


def makeSmallers(fname):
    sizes = [500, 1000, 2000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000 ]
    im = Image.open(fname)
    ow,oh = im.size
    results = [{'im':im,'w':ow,'h':oh}]
    for reqsize in sizes:
        if reqsize < (ow*oh):
            ratio = sqrt(reqsize / (ow*oh));
            nsz = (int(ratio*ow),int(ratio*oh))
            nim = im.resize(nsz,Image.BICUBIC)
            results.append({'im':nim,'w':nsz[0],'h':nsz[1]})
    return results

if __name__ == '__main__':

    search_dir = './input/'
    out_dir = './output/'
    in_image_files = getList(search_dir)
    d = {} 
    i = 0;
    for ifn in in_image_files:
        print('input file: ' + ifn)
        apath = os.path.abspath(os.path.join(search_dir,ifn))
        new_imgs = makeSmallers(apath)
        j = 0
        for img in new_imgs:
            w  = img['w']
            h  = img['h']
            name = '_'.join([str(x) for x in [i,j,w,h]]) + '.jpg'
           
            d[name] = {'w':w,'h':h,'ar':h/w,'sz':h*w}
            img['im'].save(out_dir + name)
            j += 1
        i += 1

    with open(out_dir + 'img_list.json','w') as ofh:
        ofh.write(json.dumps(d, sort_keys=True, indent=2))

