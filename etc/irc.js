/*

	Experimaestro javascript code

*/

var irc_dir = java.io.File(xpm.getScriptPath()).getParentFile().getParentFile();
xpm.log("IR collections directory is %s", irc_dir);

var irc_bin = java.io.File(java.io.File(irc_dir,"bin"), "ircollections");


// ---	
// --- Get a collection definition
// ---

/**
 Gives a qualified names
 @param x URL part
 @param y Fragment identifier
*/
var ircns = function(x,y) { 
	return "http://ircollections.sf.net" + (x ?  "/" + x : "") + (y ? ":" + y : "" )
};

// --- This task
var ircollections = {
	// The id
	id: xpm.qName(ircns(), "get-task"),
    
    // Version of this task (to distinguish it from previous instances)
    version: "1",
	
	// The description of this experiment
	description: <>
        <p>Get the full description of an IR collection, including 
        the list of files, the topics, and the qrels</p>
    </>,
    
    input: <inputs xmlns:irc={ircns("1.0")}>
               <input id="id" type="xs:string" help="The name of the IR task (e.g. trec.7/adhoc)"/>               
               <input id="topics" type="irc:topics" help="Alternate topics" optional="true"/>
			</inputs>,

    output: <>
			<output id="task" type={ircns("1.0","irtask")}/>
		</>,
                           
    // Creates a new instance of this experiment
	create: function() {
		
		// Running
		this.run = function() { 
            // run now (lightweight process)
            xpm.log("Retrieving task with id %s (%s)", this.id, irc_bin.toString());
            
			java.lang.System.err.println(irc_bin.toString());
            java.lang.System.err.println(this.id);

			output = xpm.evaluate([irc_bin.toString(), "get", this.id]);
            
            
            // Get the output
            if (output[0] != 0) 
            	throw "Error while running get-task: error code is " + output[0];
            
			r = new XML(output[1]);
            xpm.log("Output is: %s", r);
            
			/*
			 * Example of output: 
			 * <task xmlns="http://ircollections.sf.net" id="trec.6/adhoc">
			 *  <documents id="trec.6.adhoc" ref="cr1 fbis1 fr94 ft1 la8990" path="cols/trec6.col.files"/>
			 *  <topics id="trec.6.adhoc" path="trec/trec6/adhoc/trec6.topics.301-350"/>
			 *  <qrels id=""><file>trec/trec6/adhoc/trec6.qrels.301-350.all<file></qrels>
			 * </task>
			 */
			
			// Redefine the topics
			if (this.topics != undefined)  {
				// Simply copy the definition
                r.topics = this.topics;
            }
            
            // Set identifiers for experimaestro
            r.topics.@xpm::id = "topics";
            r.topics.@xpm::value = r.topics.id;
            
            r.documents.@xpm::id = "documents";
            r.documents.* +=  <param xmlns={xpm.ns()} id="id">{r.@id}</param>;;
            
			r.qrels.@xpm::id = "qrels";
			r.qrels.@xpm::value = "";
			
			r.* += <param xmlns={xpm.ns()} id="task">r.@id</param>;
			

			return <outputs>
				{r}
			</outputs>;
		}
		
		return this;
	}
};

xpm.addTask(ircollections);
