#!/usr/bin/python
# -*- coding: utf-8 -*-

from html.parser import HTMLParser
import re
import json

class TopicParser(HTMLParser):

    def __init__(self):
        HTMLParser.__init__(self)
        self.topics = {}

    def flush(self):
        if self.field is not None:
            text = self.currentdata.strip()
            if self.field == "num":
                text = re.sub('^Number:\s+', '', text)
            if self.field == "title":
                text = re.sub('^Topic:\s+', '', text)
            elif self.field == "desc":
                text = re.sub('^Description:\s*', '', text)
            elif self.field == "con":
                text = re.sub('^Concept\(s\):\s+', '', text)
            elif self.field == "smry":
                text = re.sub('^Summary:\s+', '', text)
            elif self.field == "dom":
                text = re.sub('^Domain:\s+', '', text)
            elif self.field == "fac":
                text = re.sub('^Factor\(s\):\s*', '', text)
            elif self.field == "def":
                text = re.sub('^Definition\(s\):\s*', '', text)
            self.topic[self.field] = text
            self.currentdata = ""

    def handle_starttag(self, tag, attrs):
        if tag == "top":
            self.topic = {}
            self.field = None
        else:
            self.flush()
            self.field = tag
        self.currentdata = ""

    def handle_endtag(self, tag):
        self.flush()
        if tag == "top":
            self.topics[self.topic["num"]] = self.topic

    def handle_data(self, data):
        # import sys
        # sys.stderr.write(">>> %s\n" % data)
        self.currentdata = self.currentdata + data

class Topics:

    def __init__(self, fh):
        parser = TopicParser()
        parser.feed(fh.read())
        self.topics = parser.topics

    def items(self):
        return self.topics.items()

    def transform_json(self, out):
        out.write(json.dumps(self.topics))

    def transform_indri(self, out):
        out.write('<parameters>\n')
        for num, topic in topics.items():
            title = topic["title"]
            out.write("<query><number>%s</number><text>%s</text></query>\n" %
                    (num, re.sub('\W', " ", title)))
            # print(topic)
        out.write('</parameters>\n')
