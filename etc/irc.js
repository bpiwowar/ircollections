/*

	Experimaestro javascript code
	see http://experimaestro.sf.net

*/

var script_path = xpm.get_script_path();
var irc_dir = java.io.File(script_path).getParentFile().getParentFile();
xpm.log("IR collections directory is %s", irc_dir);

var irc_bin = java.io.File(java.io.File(irc_dir,"bin"), "ircollections");

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

xpm.add_module(module_irc);

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
		var task_id = inputs.id.@xp::value;
		xpm.log("IR task is [%s]", task_id);

		args= [path(irc_bin), inputs.command.@value];
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
		<value id="run" type="irc:run" help="The path to the run file to evaluate"/>
		<xml id="qrels" type="irc:qrels" help="The relevance assessments"/>
		<value id="out" type="xp:file" help="The output file" optional="true"/>
	</inputs>,
	

	run: function(o) {
	
		var outputPath = o.out ? o.out.@xp::value : o.run.@xp::value + ".eval";

		xpm.log(o.toSource())
		var command = [path(irc_bin), "evaluate", path(o.run.path), o.qrels.toSource()];
		
		// Run the evaluation
		var r = <evaluation xmlns={irc.uri} xmlns:xp={xp.uri}>
				<xp:path>{o.out.@value}</xp:path>
				{o.qrels}
				{o.run}
			</evaluation>;

		scheduler.command_line_job(outputPath, command,
			{ 
				lock: [[ o.run.@xp::value, "READ_ACCESS" ]],
				stdout: outputPath,
				description: r
			} 
		);
		
		return r;
	}
};


xpm.add_task_factory(task_evaluate);