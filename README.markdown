# Introduction

This projects aims at grouping utilities to deal with the numerous and heterogenous information retrieval (IR) test collections, and to automate/standardize common operations like downloading topics, assessments or evaluating.

*Note that this is beta software*, in particular the XML format is still subject to change. Please contact me if you use the software so I can keep you in the loop when doing so.

## Concepts

- Each IR task has a unique identifier. For example, the ad-hoc track of TREC-1 has the identifier trec.1/adhoc;
- To each task is associated an XML description, composed of informations about the document collection, the topics and the assessments;
- A collection is made of a list of files that whose relative path is predefined in ir.collections.

## Example of a task description

The IR task trec.1/adhoc is associated with

    <task xmlns="http://ircollections.sourceforge.net">
      <documents path="/apath/data/irc.cols/trec.1.adhoc" type="trec" id="trec.1.adhoc"/>
      <topics path="/apath/data/trec/trec1/adhoc/trec1.topics.51-100" type="trec" id="trec.1.adhoc"/>
      <qrels path="/apath/data/trec/trec1/adhoc/qrels.51-100" type="trec.adhoc" id="trec.1.adhoc"/>
    </task>

# Installation

The code can accessed from https://github.com/bpiwowar/ircollections. You can either clone the git repository (useful to get fresh updates and to contribute).

You have then to customize the configuration file in `etc/local.xml` using the provided template `etc/local.xml.tpl`. This file can override any setting set in the `tasks.xml` 
file that should not be modified unless you want to add a new collection. To modify a definition, you can refer to the description of the XML format below

    <collections>

      <!-- Basepath for all collections -->
      <collection pattern=".*" basepath="/Volumes/storage/ir_collections/data"/>

      <!-- ClueWeb has been compressed -->
      <collection id="trec.clueweb09b" compression="block"/>
      
    </collections>

# Description of the XML format

## Compression formats

A compression format can be:

- none: No compression format (default)
- gzip: GZip files
- bgzip: [Block gzip](http://blastedbio.blogspot.fr/2011/11/bgzf-blocked-bigger-better-gzip.html)  

## Tasks

### Ad-hoc task

Composed of a `adhoc` element with three children: `collection`, `topics` and `qrels`

## Resources

### Documents

Attributes:

- path: The path to a file that contains a list of files (one per line)
- type: The type of file
- compression (_opt_): The compression mode for the files

### Topics

### Assessments

# Available collections

Below are listed all the configured collections, along with what can be automatically retrieved from internet.

## Adhoc

- TREC-1 to TREC-8 (Topics and Assesments)
- TREC Robust 2004 (Topics and Assesments)

# The commands

All the commands can be accessed through the ircollections python script:

    ircollections <command> <command arguments...>

The available commands `list`, `get`, `prepare`, and `evaluate`. In the following, ircollections is assumed to be within the executable path.

## List tasks

List all the available tasks

    ircollections <command> <command arguments...>


## Get and prepare

    ircollections get [options] ID [ID ...]
    ircollections prepare [options] ID [ID ...]

Get the XML definition of one or more tasks. This command takes one or more arguments which are the task IDs and outputs the different definitions. If more than one task is specified, the definitions are enclosed in an XML document.

The `prepare` command does one more thing: it downloads automatically topics and qrels (when available).

# Evaluate

    evaluate ID <run path>

Evaluate a run for a given task ID.
