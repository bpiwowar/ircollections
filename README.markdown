# Introduction

This projects aims at grouping utilities to deal with the numerous and heterogenous information retrieval (IR) test collections, and to automate/standardize common operations like downloading topics, assessments or evaluating.

- Each task is uniquely identified by an ID, e.g. `ir/trec/2009/web/adhoc`
- Each task is associated to a definition containing all the necessary information; tasks can be output in JSON or XML
- Resources (e.g. assessments or topics, when available online) can be automatically processed
- Resources can be transformed before being fed to a particular software (e.g. [Indri](http://www.lemurproject.org/indri/))
- Integrates with [experimaestro](http://experimaestro.sf.net) 

*Note that this is beta software*, in particular the XML format is still subject to change. Please contact me if you use the software so I can keep you in the loop when doing so.


## Example of a task description

The IR task trec/1992/adhoc is associated with the following XML description

    <?xml version='1.0' encoding='utf-8'?>
    <task xmlns:xp="http://experimaestro.lip6.fr" xmlns="http://ircollections.sourceforge.net">
      <documents id="trec.1.adhoc" type="trec" xp:path="IRCOLLECTIONS_DIR/irc.cols/trec.1.adhoc" compression="gzip">
        <documents id="trec.ap8889" type="trec" xp:path="IRCOLLECTIONS_DIR/irc.cols/trec.ap8889" compression="gzip"/>
        <documents id="trec.doe1" type="trec" xp:path="IRCOLLECTIONS_DIR/irc.cols/trec.doe1" compression="gzip"/>
        <documents id="trec.fr8889" type="trec" xp:path="IRCOLLECTIONS_DIR/irc.cols/trec.fr8889" compression="gzip"/>
        <documents id="trec.wsj8792" type="trec" xp:path="IRCOLLECTIONS_DIR/irc.cols/trec.wsj8792" compression="gzip"/>
        <documents id="trec.ziff12" type="trec" xp:path="IRCOLLECTIONS_DIR/irc.cols/trec.ziff12" compression="gzip"/>
      </documents>
      <topics id="trec.1.adhoc" type="trec" xp:path="IRCOLLECTIONS_DIR/trec/trec1/adhoc/trec1.topics.51-100"/>
      <qrels id="trec.1.adhoc" type="trec" xp:path="IRCOLLECTIONS_DIR/trec/trec1/adhoc/qrels.51-100"/>
    </task>

The description defines three resources:

1. The document collection (`@path` gives the path to a file containing the list of documents that compose the collection). Files are in TREC standard format and sub-collections
1. The topics (in TREC standard format)
1. The assessments (in TREC standard format)

# Installation

The code can accessed from https://github.com/bpiwowar/ircollections. You can either clone the git repository (useful to get fresh updates and to contribute).

You have then to customize the configuration file in `etc/local.xml` using the provided template `etc/local.xml.tpl`. This file can override any setting set in the `tasks.xml` 
file. The `tasks.xml` should not be modified unless you want to add a new collection. 
To modify a definition, you can refer to the description of the XML format below

    <collections>

      <!-- Basepath for all collections -->
      <collection pattern=".*" basepath="/Volumes/storage/ir_collections/data"/>

      <!-- ClueWeb has been compressed -->
      <collection id="trec.clueweb09b" compression="bgzip"/>
      
    </collections>

# Description of the XML format


## Compression formats
<a id="compression"></a>

A compression format can be:

- none: No compression format (default)
- gzip: GZip files
- bgzip: [Block gzip](http://blastedbio.blogspot.fr/2011/11/bgzf-blocked-bigger-better-gzip.html) are gzip-compatible but have a constant random access time (at the cost of compression ratio)

## Tasks

### Ad-hoc task

Composed of an `adhoc` element with three children: `collection`, `topics` and `qrels`

## Resources

### Documents

Attributes:

- path: The path to a file that contains a list of files (one per line)
- type: The type of file
   - trec: Standard trec format
   - warc/0.18
- compression (_opt_): The compression mode for the files (see [the compression formats](#compression))

### Topics

### Assessments

# Available collections

Below are listed all the configured collections, along with what can be automatically retrieved from internet.

## Adhoc

- TREC-1 to TREC-8 (Topics and Assesments)
- TREC Robust 2003-2005 (Topics and Assesments)
- TREC Web 2009

# The commands

All the commands can be accessed through the ircollections python script:

    ircollections <global options> <command> <command arguments...>

The available commands `list`, `get`, `prepare`, and `evaluate`. In the following, `ircollections` is assumed to be within the executable path.

## List tasks

List all the available tasks

    ircollections <command> <command arguments...>


## Get and prepare

    ircollections get [options] ID [options]
    ircollections prepare [options] ID [options]

Get the XML definition of one or more tasks. This command takes one or more arguments which are the task IDs and outputs the different definitions. If more than one task is specified, the definitions are enclosed in an XML document.

The `prepare` command does one more thing: it *automatically* downloads topics and assessments (when available online).

# Evaluate

    evaluate ID <run path>

Evaluate a run for a given task ID.
