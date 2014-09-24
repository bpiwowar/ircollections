#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import subprocess
from gzip import GzipFile
from bz2 import BZ2File
import sys
import atexit
import os
import signal
import argparse
import logging
import re
from utils import decode_json, collections

import trec_sgml
import wiki_simple

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('parse')

# --- Parameters


parser = argparse.ArgumentParser(description='Dep-parse tool')
parser.add_argument("--debug", action="store_true", default=False)

parser.add_argument(
    "--parser", default="mate-tools-depparse", help="Mate tools parser script")


parser.add_argument("--json", action="store_true", default=False, help="Collections are JSON files")
parser.add_argument("--restrict", default="", help="Mate tools parser script")


parser.add_argument("--outdir", default="out", help="Output directory")

parser.add_argument("collections", nargs="+", help="Collections to parse (or json file if --json flag is set)")

args = parser.parse_args()
if args.debug:
    logger.setLevel(logging.DEBUG)

# --- Parse


class Processor():

    P_RE = re.compile(r"[\r\n]{2,}")

    def __init__(self, depparse):
        self.p = subprocess.Popen(
            "%s --memory 4G --max-length 100" % depparse, stdin=subprocess.PIPE,
            stdout=subprocess.PIPE, shell=True, preexec_fn=os.setsid)
        self.stdin = self.p.stdin
        self.stdout = self.p.stdout

        def kill():
            os.killpg(self.p.pid, signal.SIGTERM)
            sys.stderr.write("Killed depparse process\n")
        atexit.register(kill)

    def process(self, fulltext):
        r = []
        current = None
        for text in Processor.P_RE.split(fulltext):
            # --- Send the text
            try:
                text = text.strip()
                if len(text) == 0:
                    continue
                self.stdin.write(text.encode("utf-8"))
                self.stdin.write("\n\n".encode("utf-8"))
                self.stdin.flush()

                if logger.isEnabledFor(logging.DEBUG):
                    logger.debug("Sent data [%s]..." % text)

                count = 0
                while True:
                    line = self.stdout.readline().decode("utf-8")
                    line = line.strip()
                    # sys.stderr.write("[%s] %s\n" % (line, current is None))
                    if line == "":
                        if current is None:
                            break
                        else:
                            r.append(current)
                            current = None
                    else:
                        count += 1
                        if current is None:
                            current = []
                        current.append(line)
                logger.debug("Answer received [%d tokens]", count)
            except Exception as e:
                logging.error("Error [%s] while parsing text [%s]", e, text)
                raise e

        return r


p = Processor(args.parser)


def is_int(a):
    """Returns true if a can be an integer"""
    try:
        int(a)
        return True
    except:
        return False


def process(tag, document, out):
    if tag in document:
        out.write("#TAG\t%s\n" % tag)
        for sentence in p.process(document[tag].textContent()):
            out.write("#SENTENCE\n")
            for word in sentence:
                out.write(word.encode('UTF-8'))
                out.write('\n')


def parse(path, out, outptr, processor, Reader, processed=set()):
    """Parse a collection"""
    logger.info("Looking at %s [pos=%d]" % (path, out.tell()))
    for document in processor(Reader(path, "r")):
        if document.get_id() in processed:
            logger.debug(
                "Skipping already processed document [%s]", document.get_id())
        else:
            logger.debug("Processing document [%s]", document.get_id())
            start = out.tell()
            out.write("#DOCUMENT\t%s\n" % (document.get_id()))
            process("HEAD", document, out)
            process("TEXT", document, out)
            #print(document["HEAD"].textContent(), document["TEXT"].textContent())
            outptr.write("%s\t%d\t%d\n" %
                         (document.get_id(), start, out.tell()))
            logger.debug("Processed document [%s]", document.get_id())


for collection in args.collections:
    l = collection.split("#")
    if args.json and os.path.exists(collection):
        s = open(collection).read()
        descriptions = decode_json(s)
    else:
        restrict = ""
        if len(l) == 1:
            pass
        elif len(l) == 2:
            restrict = l[1]
            collection = l[0]
        else:
            raise Exception("Cannot handle collection specification [%s]" % collection)
        descriptions = collections(collection, restrict)

    for description in descriptions:
        collection_id = description["id"]
        donefilepath = os.path.join(args.outdir, "%s.done" % collection_id)

        if os.path.exists(donefilepath):
            continue

        logger.info("Parsing collection %s", collection_id)

        outptr = open(
            os.path.join(args.outdir, "%s.ptr.dat" % collection_id), "a+")
        out = open(
            os.path.join(args.outdir, "%s.parsed.dat" % collection_id), "a+")

        out.seek(0, os.SEEK_END)
        size_out = out.tell()
        outptr.seek(0)

        # --- Handles recovery

        logger.info("Position %d / size %d", out.tell(), size_out)
        # Read the file
        last = 0
        last_pos = 0
        processed = set()
        while True:
            line = outptr.readline()
            if line is None:
                break
            fields = line.strip().split("\t")
            if len(fields) != 3 \
               or not is_int(fields[1]) or not is_int(fields[2]) \
               or int(fields[1]) >= int(fields[2]) \
               or int(fields[2]) > size_out:
                break
            last = outptr.tell()
            processed.add(fields[0])
            last_pos = int(fields[2])

        logger.info(
            "Last valid pointer: %d [at last_pos=%d / size=%d]", last, last_pos, size_out)

        out.seek(0)
        new_size = out.truncate(last_pos)
        if new_size is not None:
            logger.info("New output size: %d", new_size)
        out.seek(last_pos)

        outptr.seek(0)
        new_size = outptr.truncate(last)
        if new_size is not None:
            logger.info("New output pointer size: %d", new_size)
        outptr.seek(last)

        # --- Now parse
        if description["type"] == "trec":
            processor = trec_sgml.documents
            reader = GzipFile
        elif description["type"] == "wiki-simple":
            processor = wiki_simple.documents
            reader = BZ2File
        else:
            raise Exception("Cannot handle document type %s" % description["type"])

        count = 0
        logger.info("Looking at documents listed in %s" % description["path"])
        for line in open(description["path"]):
            path = line.strip()
            logger.info("Looking at %s" % path)
            parse(path, out, outptr, processor, reader, processed)

        logger.info("Finished working on collection %s", collection_id)
        out.close()
        outptr.close()

        f = open(donefilepath, "w")
        f.close()
