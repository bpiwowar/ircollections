(: Get a task :)


declare namespace functx = "http://www.functx.com"; 

declare variable $doc external;
declare variable $id external;

declare function functx:pad-string-to-length 
  ( $stringToPad as xs:string? ,
  $padChar as xs:string ,
  $length as xs:integer )  as xs:string {
    
    substring(
      string-join (
	($stringToPad, for $i in (1 to $length) return $padChar)
	,'')
	,1,$length)
  } ;
  
  (: Find the task element with a given id :)
  declare function local:find($el, $id) {
    if (empty($id)) then $el
  else local:find($el/task[@name eq $id[1]], $id[position() > 1])
};


(: Find the first element under $el or an ancestor :)
declare function local:searchElement($el, $id) {
  let $x := $el/*[name() eq  $id]
  return if (empty($x)) then 
  let $p := $el/..
  return if ($p eq $el) then error(QName("bpiwowar","error"),concat("Could not find element ",$id)) else local:searchElement($p, $id)
  else $x[1]
};

declare function local:getCollection($doc, $id) {
  let $el := $doc/tasks/collections/collection[@id eq $id]
  return if (empty($el)) then error(QName("bpiwowar","error"),concat("Could not find the collection ",$id))
  else if ($el/@alias) then let $el2 := local:getCollection($doc, $el/@alias) return <collection id="{$el/@alias}" aliased-from="{$id}">{$el2/node()}</collection>
  else $el
};     



if ($id eq "-") then (: we are listing the tasks :)
    string-join((
    for $task in $doc//task[not(@abstract) or @abstract ne "yes"]
    return string-join((functx:pad-string-to-length(concat(string-join(data($task/ancestor-or-self::task/@name),"/")," "),".",50), data($task/@description)), " "), "",""),"
")



else (: We are searching for a task :)
  let $e := local:find($doc/tasks, tokenize($id,'/'))
  return if (empty($e)) then error(QName("bpiwowar","error"),concat("Could not find task ",$id))
else 
  
  let 
    $collid := local:searchElement($e, "collection"),
    $topicsid:= local:searchElement($e, "topics"), 
    $qrels:= local:searchElement($e, "qrels"),
    $type := local:searchElement($e, "type"),
    $coll := local:getCollection($doc, $collid),
    $topics := $doc/tasks/topics-sets/topics[@id eq $topicsid]/text()
  return
    if (empty($coll) or empty($topics)) then error(QName("bpiwowar","error"),concat("Could not find the topics id: ",$topicsid))
  else
  <task id="{$id}">
    {$type}
    {$coll}
    <topics id="{$topicsid}">{$topics}</topics>
    {$qrels}
  </task>



