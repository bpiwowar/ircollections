/*

	Experimaestro javascript code

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
               <value id="id" type="xs:string" help="The name of the IR task (e.g. trec.7/adhoc)"/>               
               <value id="restrict" value-type="xs:string" help="Restrict to a subcollection" optional="true"/>
			</inputs>,

    output: qname(irc, "task"),
                           
    // Creates a new instance of this experiment
	run: function(inputs) { 
		var task_id = inputs.id.@xp::value;
		xpm.log("IR task is [%s]", task_id);

		args= [irc_bin.toString(), "prepare"];
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
		
		return r;
	}
	
};

xpm.add_task_factory(ircollections);



/**
 * Evaluate a run
 */
var task_evaluate = {
	id: qname(irc, "evaluate"),
	version: "1.0",

    module: module_irc.id,

	description: <><p>Evaluate a run</p></>,

	inputs: <inputs xmlns:irc={irc}>
		<value id="run" type="irc:run" help="The run to evaluate"/>
		<value id="qrels" type="irc:qrels" help="The relevance assessments"/>
		<value id="out" type="xp:file"/>
	</inputs>,
	

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


xpm.add_task_factory(task_evaluate);