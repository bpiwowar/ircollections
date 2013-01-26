/*

	Experimaestro javascript code
	see http://experimaestro.sf.net

*/

var irc_dir = xpm.get_script_file().get_ancestor(2);
var logger = xpm.logger("net.sf.ircollections");

logger.info("IR collections directory is %s", irc_dir);

var irc_bin = irc_dir.path("bin", "ircollections");

var irc = new Namespace("http://ircollections.sourceforge.net");

xpm.set_property("namespace", irc);




var module_irc = {
	name: "Information Retrieval Collections",
	url: "http://ircollections.sourceforge.net",
	id: qname(irc, "main"),
	
	description: <p>
		This contains the task associated with the IR collections project, which aims at 
		providing an unique interface for running ad-hoc IR experiments.
	</p>
};

module = xpm.add_module(module_irc);
module.add_schema(irc_dir.path("etc","irc.rnc"));

// --- This task
var ircollections = {
	// The id
	id: qname(irc, "get-task"),
    
    module: module_irc.id,
    
	// The description of this experiment
	description: <>
        <p>Get the full description of an IR collection, including 
        the list of files, the topics, and the qrels</p>
    </>,
    
    inputs: <inputs>
    		   <value id="command" default="prepare" type="xs:string"/>
               <value id="id" type="xs:string" help="The name of the IR task (e.g. trec.7/adhoc)"/>               
               <value id="restrict" value-type="xs:string" help="Restrict to a subcollection" optional="true"/>
			</inputs>,

    output: qname(irc, "task"),
                           
    // Creates a new instance of this experiment
	run: function(inputs) { 
		var task_id = inputs.id.@value;
		logger.info("IR task is [%s]", task_id);

		args= [path(irc_bin), inputs.command.@value];
		if (inputs.restrict) 
			args = args.concat("--restrict", inputs.restrict.@value);
					
		// Run ircollections 
		var command = args.concat(task_id);
	
		logger.debug("arguments are %s; output=", command.toSource());

		output = xpm.evaluate(command);
		
		// Get the output
		if (output[0] != 0) 
			throw "Error while running get-task: error code is " 
				+ output[0] + ", command was [" + command.toString() + "]";
		

		r = new XML(output[1].trim());	
		logger.debug("Returning %s", r);
		
		return r;
	}
	
};

xpm.add_task_factory(ircollections);



/**
 * Evaluate a run : hypotheses about evaluation are the same than
 * for adhoc runs - there are topics, evaluation metrics, a run file
 * and an assessmentr file
 */
var task_evaluate = {
	id: qname(irc, "evaluate"),

    module: module_irc.id,

	description: <>
		<p>Evaluate a run</p>
	</>,

	inputs: <inputs xmlns:irc={irc}>
		<xml id="run" type="irc:run" help="The path to the run file to evaluate"/>
		<xml id="qrels" type="irc:qrels" help="The relevance assessments"/>
		<value id="out" type="xp:file" help="The output file" optional="true"/>
	</inputs>,
	

	run: function(o) {
	
		var outputPath = xpm.file(o.out ? o.out.@value : o.run.@value + ".eval");

		var command = [path(irc_bin), "evaluate", file(o.run.@xp::path), o.qrels.toSource()];
		
		var rsrc = xpm.command_line_job(outputPath, command,
			{ 
				lock: [[ o.run.@xp::resource, "READ_ACCESS" ]],
				stdout: outputPath,
				description: r 
			} 
		);

		// Run the evaluation
		var r = <evaluation xmlns={irc.uri} xmlns:xp={xp.uri} xp:path={outputPath} xp:resource={rsrc}>
				{o.qrels}
				{o.run}
			</evaluation>;

		
		return r;
	}
};


xpm.add_task_factory(task_evaluate);