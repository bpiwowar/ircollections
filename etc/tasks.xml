<tasks>

  <!--
  

           TREC  

  -->

  <collections>
    <!-- Sub-collections used in TREC -->
    <collection id="ap88" description="Associated Press (1988)">cols/ap88.col.files</collection>
    <collection id="ap8889" description="Associated Press (1988-89)">cols/ap8889.col.files</collection>
    <collection id="ap8890" description="Associated Press (1988-90)">cols/ap8890.col.files</collection>
    <collection id="clueweb09b" type="warc.bgz" description="ClueWeb09 Subset B">cols/clueweb09b.col.files</collection>
    <collection id="cr1">cols/cr1.col.files</collection>
    <collection id="doe1">cols/doe1.col.files</collection>
    <collection id="fbis1">cols/fbis1.col.files</collection>
    <collection id="fr88">cols/fr88.col.files</collection>
    <collection id="fr8889">cols/fr8889.col.files</collection>
    <collection id="fr8894">cols/fr8894.col.files</collection>
    <collection id="fr94">cols/fr94.col.files</collection>
    <collection id="ft1">cols/ft1.col.files</collection>
    <collection id="la8990">cols/la8990.col.files</collection>
    <collection id="sjm1">cols/sjm1.col.files</collection>
    <collection id="usp93">cols/usp93.col.files</collection>
    <collection id="wsj8792">cols/wsj8792.col.files</collection>
    <collection id="wsj9092">cols/wsj9092.col.files</collection>
    <collection id="ziff12">cols/ziff12.col.files</collection>
    <collection id="ziff2">cols/ziff2.col.files</collection>
    <collection id="ziff23">cols/ziff23.col.files</collection>
    <collection id="wt10g">cols/wt10g.col.files</collection>


    <collection id="trec.1.adhoc" ref="ap8889 doe1 fr8889 wsj8792 ziff12">cols/trec1.col.files</collection>
    <collection id="trec.2.adhoc" alias="trec.1.adhoc"/>
    <collection id="trec.3.adhoc" alias="trec.1.adhoc"/>
    <collection id="trec.4.adhoc" ref="ap8890 fr88 sjm1 usp93 wsj9092 ziff23">cols/trec4.col.files</collection>
    <collection id="trec.5.adhoc" ref="ap88 cr1 fr8894 ft1 wsj9092 ziff2">cols/trec5.col.files</collection>
    <collection id="trec.6.adhoc" ref="cr1 fbis1 fr94 ft1 la8990">cols/trec6.col.files</collection>
    <collection id="trec.7.adhoc" ref="fbis1 fr94 ft1 la8990">cols/trec7.col.files</collection>
    <collection id="trec.8.adhoc" alias="trec.7.adhoc"/>

    <collection id="trec.dotgov">cols/dotgov.col.files</collection>
    <collection id="trec.dotgov2">cols/dotgov2.col.files</collection>
    <collection id="trec.aquaint">cols/aquaint.col.files</collection>
  </collections>

  <topics-sets>
    <topics id="trec.1.adhoc">trec/trec1/adhoc/trec1.topics.51-100</topics>
    <topics id="trec.2.adhoc">trec/trec2/adhoc/trec2.topics.101-150</topics>
    <topics id="trec.3.adhoc">trec/trec3/adhoc/trec3.topics.151-200</topics>
    <topics id="trec.4.adhoc">trec/trec4/adhoc/trec4.topics.201-250</topics>
    <topics id="trec.5.adhoc">trec/trec5/adhoc/trec5.topics.251-300</topics>
    <topics id="trec.6.adhoc">trec/trec6/adhoc/trec6.topics.301-350</topics>
    <topics id="trec.7.adhoc">trec/trec7/adhoc/trec7.topics.351-400</topics>
    <topics id="trec.8.adhoc" comma-separated-phrases="true">trec/trec8/adhoc/trec8.topics.401-450</topics>

    <topics id="trec.9.web">trec/trec9/web/trec9.topics.web</topics>

    <topics id="trec.2001.web">trec/trec2001/web/trec2001.topics.web</topics>

    <topics id="trec.2003.web">trec/trec2003/web/trec2003.web.topics</topics>
    <topics id="trec.2003.web.distillation">trec/trec2003/web/trec2003.web.distillation.topics</topics>

    <topics id="trec.2004.web">trec/trec2004/web/trec2004.web.topics</topics>
    <topics id="trec.2004.robust">trec/trec2004/robust/trec2004.robust.topics</topics>

    <topics id="trec.2005.robust">trec/trec2005/robust/trec2005.robust.topics</topics>

    <topics id="trec.2006.terabyte">trec/trec2006/terabyte/trec2006.topics.terabyte-701-850</topics>

    <topics id="trec.2009.web" type="trec.2009.web">trec/trec2009/web/trec2009.web.topics</topics>

    <topics id="trec.2010.session" type="trec10session">trec/trec2010/session/st10.topics.queries.only.txt</topics>

    <topics id="trec.678.interactive">trec/trec678.interactive/trec678.interactive.topics</topics>

  </topics-sets>


  <!-- trec1 -->
  <task abstract="yes" name="trec.1">
    <type>TREC</type>
    <task description="Ad-hoc task of trec1" name="adhoc">
      <collection>trec.1.adhoc</collection>
      <topics>trec.1.adhoc</topics>
      <qrels>trec/trec1/adhoc/trec1.adhoc.trec1.qrels</qrels>
    </task>
  </task>


  <!-- trec2 -->
  <task abstract="yes" name="trec.2">
    <type>TREC</type>
    <task description="Ad-hoc task of trec2" name="adhoc">
      <collection>trec.2.adhoc</collection>
      <topics>trec.2.adhoc</topics>
      <qrels>trec/trec2/adhoc/trec2.qrels.101-150.all</qrels>
    </task>
  </task>


  <!-- trec3 -->
  <task abstract="yes" name="trec.3">
    <type>TREC</type>
    <task description="Ad-hoc task of trec3" name="adhoc">
      <collection>trec.3.adhoc</collection>
      <topics>trec.3.adhoc</topics>
      <qrels>trec/trec3/adhoc/trec3.qrels.151-200.all</qrels>
    </task>
  </task>


  <!-- trec4 -->
  <task abstract="yes" name="trec.4">
    <type>TREC</type>
    <task description="Ad-hoc task of trec4" name="adhoc">
      <collection>trec.4.adhoc</collection>
      <topics>trec.4.adhoc</topics>
      <qrels>trec/trec4/adhoc/trec4.qrels.201-250.all</qrels>
    </task>
  </task>


  <!-- trec5 -->
  <task abstract="yes" name="trec.5">
    <type>TREC</type>
    <task description="Ad-hoc task of trec5" name="adhoc">
      <collection>trec.5.adhoc</collection>
      <topics>trec.5.adhoc</topics>
      <qrels>trec/trec5/adhoc/trec5.qrels.251-300.all</qrels>
    </task>
  </task>


  <!-- trec6 -->
  <task abstract="yes" name="trec.6">
    <type>TREC</type>
    <task description="Ad-hoc task of trec6" name="adhoc">
      <collection>trec.6.adhoc</collection>
      <topics>trec.6.adhoc</topics>
      <qrels>trec/trec6/adhoc/trec6.qrels.301-350.all</qrels>
    </task>
  </task>

  <!-- trec7 -->
  <task abstract="yes" name="trec.7">
    <type>TREC</type>
    <task description="Ad-hoc task of trec7" name="adhoc">
      <collection>trec.7.adhoc</collection>
      <topics>trec.7.adhoc</topics>
      <qrels>trec/trec7/adhoc/trec7.qrels.351-400.all</qrels>
    </task>
  </task>


  <!-- TREC 8 -->
  <task name="trec.8" abstract="yes">
    <type>TREC</type>
    <task name="adhoc" description="Ad-hoc task of TREC-8">
      <collection>trec.8.adhoc</collection>
      <topics>trec.8.adhoc</topics>
      <qrels type="trec.adhoc">trec/trec8/adhoc/trec8.qrels.401-450.all</qrels>      
    </task>
  </task>

  <!-- Interactive TREC 678 -->
  <task name="trec.678" abstract="yes">
   <task name="interactive">
    <type>TREC</type>
    <collection>ft1</collection>
    <topics>trec.678.interactive</topics>
    <qrels type="trec.aspects">trec/trec678.interactive/trec678.interactive.qrels</qrels>
  </task>
  </task>

  <!-- TREC 9 -->
  <task name="trec.9" abstract="yes">
    <type>TREC</type>
    <task name="web" description="Web task TREC-9">
      <collection>wt10g</collection>
      <topics>trec.9.web</topics>
      <qrels type="trec.adhoc">trec/trec9/web/trec9.web.qrels</qrels>      
    </task>
  </task>

  <!-- TREC 9 -->
  <task name="trec.2001" abstract="yes">
    <type>TREC</type>
    <task name="web" description="Web task TREC-2001">
      <collection>wt10g</collection>
      <topics>trec.2001.web</topics>
      <qrels type="trec.adhoc">trec/trec2001/web/trec2001.web.qrels</qrels>      
    </task>
  </task>


  <!-- TREC 2003 -->
  <task name="trec.2003" abstract="yes">
    <type>TREC</type>
    <task name="web"  description="Web task of TREC-2003 (distillation + named page)">
      <collection>trec.dotgov</collection>
      <topics>trec.2003.web</topics>
      <qrels>trec/trec2003/web/trec2003.web.qrels</qrels>
      
      <task name="distillation" description="Web distillation (TREC-2003)">
	<topics>trec.2003.web.distillation</topics>
	<qrels>trec/trec2003/web/trec2003.web.qrels</qrels>
      </task>

    </task>

  </task>

  <!-- TREC 2004 -->
  <task name="trec.2004" abstract="yes">
    <type>TREC</type>

    <task name="robust" description="Robust task of TREC 2004">
      <collection>trec.8.adhoc</collection>
      <topics>trec.2004.robust</topics>
      <qrels>trec/trec2004/robust/robust04.qrels.all</qrels>      
    </task>

    <task name="web" description="Web task of TREC 2004">
      <collection>trec.dotgov</collection>
      <topics>trec.2004.web</topics>
      <qrels>trec/trec2004/web/trec2004.web.qrels</qrels>      
    </task>

  </task>

  <!-- TREC 2004 -->
  <task name="trec.2005" abstract="yes">
    <type>TREC</type>

    <task name="robust" description="Robust task of TREC 2005">
      <collection>trec.aquaint</collection>
      <topics>trec.2005.robust</topics>
      <qrels>trec/trec2005/robust/robust05.qrels.all</qrels>      
    </task>

    
  </task>
  

  <!-- TREC 2006 -->
  <task name="trec.2006" abstract="yes">
    <type>TREC</type>

    <task name="terabyte" description="Robust task of TREC 2005">
      <collection>trec.dotgov2</collection>
      <topics>trec.2006.terabyte</topics>
      <qrels>trec/trec2006/terabyte/trec2006.terabyte.701-850.qrels</qrels>      
    </task>
  </task>

  <!-- TREC 2009 -->
  <task name="trec.2009" abstract="yes">

    <task name="web" abstract="yes">
      <task name="diversity" description="Web diversity track for TREC 2010" abstract="yes">
	<type>TREC</type>
	<task name="clueweb09b" description="Web diversity track for TREC 2009 (ClueWeb-B data collection)">
	  <collection>clueweb09b</collection>
	  <qrels type="trec.aspects">trec/trec2009/web/trec2009.web.diversity.qrels</qrels>
	</task>
      </task>
      <task name="adhoc" description="Web adhoc track for TREC 2009">
	 <collection>clueweb09b</collection>
	 <qrels>trec/trec2009/web/trec2009.web.adhoc.prels</qrels>
      </task>
      <topics>trec.2009.web</topics>
    </task>
  </task>

  <!-- TREC 2010 -->
  <task name="trec.2010" abstract="yes">
    <type>TREC</type>
    <task name="session" description="Session track of TREC 2010" abstract="yes">
	<task name="clueweb09b" description="Session track of TREC 2010 using ClueWeb09B">
     	  <collection>clueweb09b</collection>
      	  <topics>trec.2010.session</topics>
          <qrels></qrels>
	</task>
    </task>
 </task>
  


  <!--
  

           INEX


  -->

  <collections>
    <collection id="inex.ieee-1.9" description="IEEE (1999-2002) used in INEX 2003-05 ">cols/ieee-1.9.col.files</collection>
  </collections>

  <topics-sets>
    <topics id="inex.2005.adhoc.co" type="directory">inex/inex2005/adhoc/topics-v3</topics>
    <topics id="inex.2005.adhoc.cas" type="directory">inex/inex2005/adhoc/topics-cas-v3</topics>
 </topics-sets>

  <task abstract="yes" name="inex.2005">
    <type>INEX</type>

    <task abstract="yes" name="adhoc">
      <collection>inex.ieee-1.9</collection>
          <task name="co" description="Ad-hoc/content-only task of INEX 2005">
	    <topics>inex.2005.adhoc.co</topics>
	    <qrels>inex/inex2005/adhoc/qrels/official/CO+S</qrels>
	  </task>
    </task>
  </task>

</tasks>

