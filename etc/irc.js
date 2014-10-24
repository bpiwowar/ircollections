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


// --- Get a task XML definition

function get_task(p) { 
	logger.info("IR task is [%s], restriction [%s]", $(p.id), $(p.restrict));

	args= [path(irc_bin), $(p.command), "--json", "--engine", $(p.engine)];
	if ($(p.restrict)) 
		args = args.concat("--restrict", $(p.restrict));
					
	// Run ircollections 
	var command = args.concat($(p.id));
	
	logger.debug("arguments are %s; output=", command.toString());

	output = xpm.evaluate(command);
	// Get the output
		
    logger.debug("Output is: %s", output);
	return JSON.parse(output.trim());	
}

tasks("irc:get-task") = {
    module: module_irc.id,
    
	// The description of this experiment
	description: "<p>Get the full description of an IR collection, including the list of files, the topics, and the qrels</p>",
    
    inputs: {
        command: { value: "xp:string", "default": "prepare"},
        id: { value: "xp:string", help: "The name of the IR task (e.g. trec.7/adhoc)" },
        restrict: { value: "xp:string", help: "Restrict to a subcollection", optional: true },
        engine: { value: "xp:string", help: "Transformation engine to use (none, indri)", default: "none" }
    },

    output: qname(irc, "task"),
    
    run: get_task
};




/**
 * Evaluate a run : hypotheses about evaluation are the same than
 * for adhoc runs - there are topics, evaluation metrics, a run file
 * and an assessmentr file
 */
var task_evaluate = {
	id: qname(irc, "evaluate"),

    module: module_irc.id,

	description: "<p>Evaluate a run</p>",

	inputs: {
	    "run": { json: "irc:run", help: "The path to the run file to evaluate" },
        "qrels": { json: "irc:qrels", help: "The relevance assessments" },
        "out": { value: "xp:file", help: "The output file", optional: true }
    },

	run: function(p) {
	   var outputPath = p.out ? $(p.out) : $(p.run.path).add_extension(".eval");
       logger.info("Output path: %s", outputPath);
		var command = [path(irc_bin), "evaluate", "--json", $(p.run.path), new ParameterFile("qrels", p.qrels.toSource())];
		
		var rsrc = xpm.command_line_job(outputPath, command,
			{ 
				lock: [[ $$(p.run), "READ_ACCESS" ]],
				stdout: outputPath,
			} 
		);

		// Run the evaluation
		var r = {
            $type: "irc:run",
            $resource: rsrc,
		    path: outputPath,
            run: p.run,
            qrels: p.qrels
		}
		
		return r;
	}
};


xpm.add_task_factory(task_evaluate);


/**
 * Evaluate a run : hypotheses about evaluation are the same than
 * for adhoc runs - there are topics, evaluation metrics, a run file
 * and an assessmentr file
 */
tasks("irc:get-topics") = {
    module: module_irc.id,
    inputs: {
        "topics": { json: "irc:topics", help: "The topics", copy: true },
        "format": { value: "xp:string", help: "The output format", copy: "$format" },
    },

    run: function(p) {
        var command = [path(irc_bin), "get-topics", "--format", $(p.format), new ParameterFile("topics", p.topics.toSource())];

        var output = xpm.evaluate(command);

        return {
            $type: "irc:topic-set",
            data: JSON.parse(output.trim())
        };
    }

};


