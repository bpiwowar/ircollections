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
    
    input: <inputs>
               <input id="id" type="xs:string" help="The name of the IR task (e.g. trec.7/adhoc)"/>               
               <input id="restrict" type="xs:string" help="Restrict to a subcollection" optional="true"/>
			</inputs>,

    output: <>
			<output id="task" type={ircns("1.0","irtask")}/>
		</>,
                           
    // Creates a new instance of this experiment
	create: function() {
		
		// Running
		this.run = function() { 
			var inputs = this.inputs;
			var task_id = inputs.id.@xp::value;
			xpm.log("IR task is [%s]", task_id);

			args= [irc_bin.toString(), "get"];
			if (inputs.restrict) 
				args = args.concat("--restrict", inputs.restrict.@xp::value);
                        
            // Run ircollections 
            var command = args.concat(task_id);
			output = xpm.evaluate(command);
            
            
            // Get the output
            if (output[0] != 0) 
            	throw "Error while running get-task: error code is " 
            		+ output[0] + ", command was [" + command.toString() + "]";
            
            
			r = new XML(output[1]);
            
			/*
			 * Example of output: 
			 * <task xmlns="http://ircollections.sf.net" id="trec.6/adhoc">
			 *  <documents id="trec.6.adhoc" ref="cr1 fbis1 fr94 ft1 la8990" path="cols/trec6.col.files"/>
			 *  <topics id="trec.6.adhoc" path="trec/trec6/adhoc/trec6.topics.301-350"/>
			 *  <qrels id="trec.6.adhoc" path="trec/trec6/adhoc/trec6.qrels.301-350.all"/>
			 * </task>
			 */
                        
            // --- Set identifiers for experimaestro
            var topics = r.irc::topics;
            topics.@xp::id = "topics";
            topics.@xp::value = topics.@id;
            
            var docs = r.irc::documents;
            docs.@xp::id = "documents";
            docs.@xp::value = docs.@id;
            
			r.irc::qrels.@xp::id = "qrels";
			r.irc::qrels.@xp::value = r.irc::qrels.@id;
			
			return <outputs>
				{r}
			</outputs>;
		}
		
		return this;
	}
};

xpm.addTaskFactory(ircollections);



/**
 * Evaluate a run
 */
var task_evaluate = {
	id: xpm.qName(ircns(), "evaluate"),
	version: "1.0",

	description: <><p>Evaluate a run</p></>,

	input: <inputs xmlns:irc={irc}>
		<input id="run" type="irc:run" help="The run to evaluate"/>
		<input id="qrels" type="irc:qrels" help="The relevance assessments"/>
		<input id="out" type="xp:file"/>
	</inputs>,
	
	output: <></>,
	
	run: function(o) {
	
		var command = [irc_bin.toString(), "evaluate",
			o.qrels.@type,
			o.qrels.path,
			o.run.path,
			">", 
			o.out.@xp::value];
		
		// Run the evaluation - but wait first for the run resource to be generated
		xpm.addCommandLineJob(out, command, [ run.@xp::resource, "READ_ACCESS" ]);
		
		return <outputs>
			<evaluation xmlns={irc.uri}>
			</evaluation>
		</outputs>;
	}
};


xpm.addTaskFactory(task_evaluate);