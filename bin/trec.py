#!/usr/bin/python
# -*- coding: utf-8 -*-

from html.parser import HTMLParser
import re

class TopicParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.topics = {}
        
    def handle_starttag(self, tag, attrs):
        if tag == "top":
            self.topic = {}
            self.field = None
        else:
            if self.field is not None:
                text = self.currentdata.strip()
                if self.field == "num": 
                    text = re.sub('^Number:\s+', '', text)
                if self.field == "title": 
                    text = re.sub('^Topic:\s+', '', text)
                elif self.field == "desc": 
                    text = re.sub('^Description:\s+', '', text)
                self.topic[self.field] = text
            self.field = tag
        self.currentdata = ""
            
    def handle_endtag(self, tag):
        if tag == "top":
            self.topics[self.topic["num"]] = self.topic
        
    def handle_data(self, data):
        self.currentdata = self.currentdata + data
        
    
class Topics:
    def __init__(self, fh):
        parser = TopicParser()
        parser.feed(fh.read())
        self.topics = parser.topics

    def items(self):
        return self.topics.items()