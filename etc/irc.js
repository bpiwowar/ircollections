/*

	Experimaestro javascript code

*/

var script_path = xpm.getScriptPath();
var irc_dir = java.io.File(script_path).getParentFile().getParentFile();
xpm.log("IR collections directory is %s", irc_dir);

var irc_bin = java.io.File(java.io.File(irc_dir,"bin"), "ircollections");

var xpmns = new Namespace(xpm.ns());


// ---	
// --- Get a collection definition
// ---

/**
 Gives a qualified names
 @param x URL part
 @param y Fragment identifier
*/
var ircns = function(x,y) { 
	return "http://ircollections.sourceforge.net" + (x ?  "/" + x : "") + (y ? ":" + y : "" )
};

var irc = new Namespace(ircns());

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
			var inputs = this.inputs;
			xpm.log("IR task is [%s]", inputs.id);
			
            // run now (lightweight process)
            if (inputs.id == undefined) 
            	throw "Undefined id";
            
            xpm.log("Retrieving task with id %s (%s)", inputs.id, irc_bin.toString());
            
			xpm.log(irc_bin.toString());
            xpm.log(inputs.id);

			output = xpm.evaluate([irc_bin.toString(), "get", inputs.id]);
            
            
            // Get the output
            if (output[0] != 0) 
            	throw "Error while running get-task: error code is " + output[0] + ", command was " + [irc_bin.toString(), "get", inputs.id];
            
			r = new XML(output[1]);
            
			/*
			 * Example of output: 
			 * <task xmlns="http://ircollections.sf.net" id="trec.6/adhoc">
			 *  <documents id="trec.6.adhoc" ref="cr1 fbis1 fr94 ft1 la8990" path="cols/trec6.col.files"/>
			 *  <topics id="trec.6.adhoc" path="trec/trec6/adhoc/trec6.topics.301-350"/>
			 *  <qrels id=""><file>trec/trec6/adhoc/trec6.qrels.301-350.all<file></qrels>
			 * </task>
			 */
			
			// Redefine the topics
			if (inputs.topics != undefined)  {
				// Simply copy the definition
                r.topics = inputs.topics;
            }
                        
            // Set identifiers for experimaestro
            r.irc::topics.@xpmns::id = "topics";
            r.irc::topics.@xpmns::value = r.topics.id;
            
            r.irc::collection.@xpmns::id = "documents";
            r.irc::collection.* +=  <param xmlns={xpm.ns()} id="id">{r.@id}</param>;;
            
			r.irc::qrels.@xpmns::id = "qrels";
			r.qrels.@xpmns::value = "";
			
			r.* += <param xmlns={xpm.ns()} id="task">{r.@id}</param>;
			

			return <outputs>
				{r}
			</outputs>;
		}
		
		return this;
	}
};

xpm.addTaskFactory(ircollections);
