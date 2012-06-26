// dobjCore.js

function writeEntitySelector(){
	var areaSel = document.getElementById("dobj-entitySelector");
	var sOut = "<select name=\"selDobjEntity\" id=\"selDobjEntity\">";
	var asEntityIds = entityManager.getAllIds();
	for ( var iEnt = 0; iEnt < asEntityIds.length; iEnt++) {
		sOut += "<option value=\"" + asEntityIds[iEnt] + "\">" + asEntityIds[iEnt] + "</option>";
	}
	sOut += "</select>";
	areaSel.innerHTML = sOut;
}

function writeTemplateSelector(){
	var areaSel = document.getElementById("dobj-templateSelector");
	var sOut = "<select name=\"selDobjTemplate\" id=\"selDobjTemplate\">";
	var asTemplateIds = templateManager.getAllIdTitlePairs();
	for ( var iEnt = 0; iEnt < asTemplateIds.length; iEnt++) {
		sOut += "<option value=\"" + asTemplateIds[iEnt][1] + "\">" + asTemplateIds[iEnt][0] + "</option>";
	}
	sOut += "</select>";
	areaSel.innerHTML = sOut;
}

function refreshData(){
}

function startRefreshData(sMode){
	httpxmlRequest = createXMLHttpRequest();
	var sXmlUrl = "data/dobjTemplates.xml";
	if(sMode == "entity"){
		sXmlUrl = "data/dobjEntities.xml";
	}
	startRequest(httpxmlRequest, sXmlUrl, handleStateChangeAjaxCall);
}

function EntityManager(){
	this.entityList = new Array();
	this.addEntity = function(entIn){
		this.entityList[this.entityList.length] = entIn;
	};
	this.getAllIds = function(){
		var asOut = new Array();
		for ( var iEnt = 0; iEnt < this.entityList.length; iEnt++) {
			asOut[asOut.length] = this.entityList[iEnt].getId();
		}
		return asOut;
	};
	this.getEntityById = function(sIdToFind){
		for ( var iEnt = 0; iEnt < this.entityList.length; iEnt++) {
			if(sIdToFind == this.entityList[iEnt].getId()){
				return this.entityList[iEnt];
			}
		}
		return this.entityList[0];
	};
	this.toString = function(){
		var sOut = "";
		for ( var iEnt = 0; iEnt < this.entityList.length; iEnt++) {
			sOut += this.entityList[iEnt].toString();
		}		
		return sOut;
	}
}
function Entity(){
	this.project = "";
	this.entityName = "";
	this.staticList = new Array();
	this.addStatic = function(asToAdd){
		this.staticList[this.staticList.length] = asToAdd;
	};
	this.getId = function(){
		return this.project + "." + this.entityName;
	};
	this.memberList = new Array();
	this.addMember = function(fldNew){
		this.memberList[this.memberList.length] = fldNew;
	}
	this.toString = function(){
		var sOut = "[id=" + this.getId();
		sOut += "]\n[proj=" + this.project;
		sOut += "]\n[entNam=" + this.entityName;
		sOut += "]";
		for ( var iSL = 0; iSL < this.staticList.length; iSL++) {
			sOut += "\n[static:" + iSL + ":" + this.staticList[iSL].join("=") + "]";
		}
		for ( var iSL = 0; iSL < this.memberList.length; iSL++) {
			sOut += "\n[member:" + iSL + ":";
			for ( var iMemAtt = 0; iMemAtt < this.memberList[iSL].length; iMemAtt++) {
				sOut += "(" + this.memberList[iSL][iMemAtt].join("-*-") + ")";
			}
		}
		sOut += "";
		sOut += "";
		sOut += "";
		return sOut;
	};
}
function writeDobjCode(){
	// Get the formatting text
	var selEntity = document.getElementById("dobj-entitySelector");
	//var selTemplate = get"dobj-templateSelector");
	var sRawTemplateText = templateManager.getTemplateById(getSelectValue("selDobjTemplate")).formula;
	var entityToConvert = entityManager.getEntityById(getSelectValue("selDobjEntity"));
	//var sRawTemplateText = getTextAreaValue("txaFuncFormat");
	// Replace tab markers with real tabs
	sRawTemplateText = replaceSubstring(sRawTemplateText, "^t", "\t");
	var sOutAll = "";
	var sValueSeparator = getValueSeparatorForFunctionize();
	var asSettings = getTextInsideMarkers(sRawTemplateText, "$SECTION{", "}");
	var asFormats = getTextOutsideMarkers(sRawTemplateText, "$SECTION{", "}");
	if(asFormats[0].length == 0){
		var asNew = new Array();
		for(var iSkip = 1; iSkip < asFormats.length; iSkip++){
			asNew[asNew.length] = asFormats[iSkip];
		}
		asFormats = asNew;
	} else if(asFormats.length > asSettings.length){
		var asNew = new Array();
		asNew[asNew.length] = "";
		for(var iAdder = 0; iAdder < asSettings.length; iAdder++){
			asNew[asNew.length] = asSettings[iAdder];
		}
		asSettings = asNew;
	}
	var sErrors = "";
	for(var iFormat = 0; iFormat < asFormats.length; iFormat++){
		var sOut = "";
		var sFormat = asFormats[iFormat];
		sFormat = trimReturns(sFormat);
		if (sFormat.split("\n").join("") == "") {
			continue;
		}
		//var sIn = getTextAreaValue("txaIn");
		var amemList = entityToConvert.memberList;
		//var asLinesWithDollarsIn_amemList = sIn.split("\n");
		// do cycle here
		resetCycles();
		sFormat = setCycleMarkers(sFormat);
		var sNL = "\n";
		var isShowNewLines = true;
		if((asSettings[iFormat].indexOf("noreturn") != -1) || (asSettings[iFormat].indexOf("nonewline") != -1)){
			sNL = "";
			isShowNewLines = false;
		}
		for ( var iFRPair = 0; iFRPair < entityToConvert.staticList.length; iFRPair++) {
			sFormat = replaceSubstring(sFormat, "${static." + entityToConvert.staticList[iFRPair][0] + "}", entityToConvert.staticList[iFRPair][1]);
		}

		for(var iMemberCounter = 0; iMemberCounter < amemList.length; iMemberCounter++){
			// Trim returnChars at end of lines.
			//if(asLinesWithDollarsIn_amemList[iMemberCounter].charAt(asLinesWithDollarsIn_amemList[iMemberCounter].length - 1) == "\r"){
			//	asLinesWithDollarsIn_amemList[iMemberCounter] = asLinesWithDollarsIn_amemList[iMemberCounter].substring(0, asLinesWithDollarsIn_amemList[iMemberCounter].length -1);
			//}
			//if(asLinesWithDollarsIn_amemList[iMemberCounter].length != 0){ // Ignore blank lines.
			//var asValuesFROMSIMPLESTRING = asLinesWithDollarsIn_amemList[iMemberCounter].split(sValueSeparator);
			var aasFindReplace = amemList[iMemberCounter];
			//a lert("asValues " + asValues);
			var sTemp = sFormat;
			var iBit = 0;
			var sCounterStartMarker = "$COUNTER{";
			var sCounterEndMarker = "}";
			if(sTemp.indexOf(sCounterStartMarker) != -1){
				sTemp = replaceSubstring(sTemp, sCounterStartMarker + sCounterEndMarker, "" + iMemberCounter);
				sTemp = replaceSubstring(sTemp, sCounterStartMarker + "0" + sCounterEndMarker, "" + iMemberCounter);
				var iCounterPos = sTemp.indexOf(sCounterStartMarker);
				while(iCounterPos != -1){
					var iBeginNr = iCounterPos + sCounterStartMarker.length;
					var iEndNr = sTemp.indexOf(sCounterEndMarker, iCounterPos);
					var sCounterValue = sTemp.substring(iBeginNr, iEndNr);
					var iCounterOffset = 0;
					try {
						iCounterOffset = parseInt(sCounterValue);
					} catch(e){}
					sTemp = sTemp.substring(0, iCounterPos) + (iMemberCounter + iCounterOffset) + sTemp.substring(iEndNr + sCounterEndMarker.length);
					iCounterPos = sTemp.indexOf(sCounterStartMarker);
				}
			}
			for ( var iFRPair = 0; iFRPair < aasFindReplace.length; iFRPair++) {
				sTemp = replaceSubstring(sTemp, "${" + aasFindReplace[iFRPair][0] + "}", aasFindReplace[iFRPair][1]);
			}
			if(iMemberCounter == 0){
				// Do work on $IFFIRST{};
				sTemp = processIsFirstLastMarkers(sTemp, "FIRST", true);
			} else {
				sTemp = processIsFirstLastMarkers(sTemp, "NOTFIRST", true);
			}
			if(iMemberCounter == (amemList.length - 1)){
				// Do work on $IFLAST{
				sTemp = processIsFirstLastMarkers(sTemp, "LAST", true);
			} else {
				sTemp = processIsFirstLastMarkers(sTemp, "NOTLAST", true);
			}
			// Remove first and lasts.
			sTemp = processIsFirstLastMarkers(sTemp, "FIRST", false);
			sTemp = processIsFirstLastMarkers(sTemp, "NOTFIRST", false);
			sTemp = processIsFirstLastMarkers(sTemp, "LAST", false);					
			sTemp = processIsFirstLastMarkers(sTemp, "NOTLAST", false);					
			
			/*
			for(; iBit < asValuesFROMSIMPLESTRING.length; iBit++){
				sTemp = replaceSubstring(sTemp, "${" + iBit + "}", asValuesFROMSIMPLESTRING[iBit]);
			}
			// Check if next value to look for is there...
			if(sTemp.indexOf("${" + iBit + "}") != -1){
				var sEss = (iBit > 1) ? "s" : "";
				sErrors += "Line " + (iLine + 1) + " only has " + (iBit) + " value" + sEss + ", is missing some values.\n";
			}
			*/
			for ( var iFindReplacePair = 0; iFindReplacePair < entityToConvert.staticList.length; iFindReplacePair++) {
				sTemp = replaceSubstring(sTemp, "${" + entityToConvert.staticList[iFindReplacePair][0] + "}", entityToConvert.staticList[iFindReplacePair][1]);
			}
			sOut += evaluateMod(sTemp) + sNL;
			
			if(asSettings[iFormat].indexOf("norepeat") != -1){
				break;
			}
		}

		if(!isShowNewLines){
			sOut = sOut.split("\r").join(" ").split("\n").join(" ");
		}
		sOut = replaceCycleMarkers(sOut);
		sOutAll += sOut;
	}
	if(sErrors.length > 0){
		alert(sErrors);
	}
	setTextAreaValue("txaOut", sOutAll);
}
	
function processIsFirstLastMarkers(sTemp, sFirstOrLast, isShow){
	if(sTemp.indexOf("$IF" + sFirstOrLast + "{") == -1){
		return sTemp;	
	}
	var asOutside = getTextOutsideMarkers(sTemp, "$IF" + sFirstOrLast + "{", "}");
	var asInside = getTextInsideMarkers(sTemp, "$IF" + sFirstOrLast + "{", "}");
	if(isShow){
		var sOut = "";
		for(var i = 0; i < asInside.length; i++){
			sOut += asOutside[i] + asInside[i];
		}
		sOut += asOutside[asOutside.length - 1];
		sTemp = sOut;
	} else {
		sTemp = asOutside.join("");
	}
	return sTemp;
}
		
function TemplateManager(){
	this.templateList = new Array();
	this.addTemplate = function(tplateNew){
		this.templateList[this.templateList.length] = tplateNew;
	};
	this.getTemplateById = function(sId){
		for ( var iTmplt = 0; iTmplt < this.templateList.length; iTmplt++) {
			if(this.templateList[iTmplt].getId() == sId){
				return this.templateList[iTmplt];
			}
		}
		return this.templateList[0];
	};
	this.getAllIdTitlePairs = function(){
		var aasOut = new Array();
		for ( var iTmplt = 0; iTmplt < this.templateList.length; iTmplt++) {
			aasOut[aasOut.length] = new Array(this.templateList[iTmplt].title, this.templateList[iTmplt].getId());
		}
		return aasOut;
	};
}
function Template(){
	this.id = "";
	this.getId = function(){
		return this.id;
	};
	this.title = "";
	this.formula = "";
}
function processXmlDoc(xmlDoc){
	var objOut = new Object();
	var nodliRoot = xmlDoc.getElementsByTagName("entities");
	if(nodliRoot.length > 0){
		var nodliEntityList = nodliRoot[0].getElementsByTagName("entity");
		entityManager.entityList = new Array();
		for ( var iEntity = 0; iEntity < nodliEntityList.length; iEntity++) {
			var nodeEntity = nodliEntityList[iEntity];
			var entityTemp = new Entity();
			entityTemp.project = getAttributeSafe(nodeEntity, "project");
			entityTemp.entityName = getAttributeSafe(nodeEntity, "entityName");
			entityTemp.addStatic(new Array("project", entityTemp.project));
			entityTemp.addStatic(new Array("entityName", entityTemp.entityName));
			// Get static list
			var nodliStaticList = nodeEntity.getElementsByTagName("static");
			for ( var iStatic = 0; iStatic < nodliStaticList.length; iStatic++) {
				var nodeStatic = nodliStaticList[iStatic];
				var namnodmapStatics = nodeStatic.attributes; // NamedNodeMap
				for ( var iNNM = 0; iNNM < namnodmapStatics.length; iNNM++) {
					entityTemp.addStatic(new Array(namnodmapStatics[iNNM].name, namnodmapStatics[iNNM].nodeValue));
				}
			}
	
			// Get static list
			var nodeMembers = nodeEntity.getElementsByTagName("members")[0];
			var nodliMemberList = nodeMembers.getElementsByTagName("member");
			for ( var iNodMemLst = 0; iNodMemLst < nodliMemberList.length; iNodMemLst++) {
				var nodeMember = nodliMemberList[iNodMemLst];
				var namnodmapMembers = nodeMember.attributes;
				var asMember = new Array();
				for ( var iNMem = 0; iNMem < namnodmapMembers.length; iNMem++) {
					asMember[asMember.length] = new Array(namnodmapMembers[iNMem].name, namnodmapMembers[iNMem].nodeValue);
				}
				entityTemp.addMember(asMember);
			}
			//a lert(entityTemp.toString());
			entityManager.addEntity(entityTemp);
		}
		//a lert(entityManager.toString());
		writeEntitySelector();
		return;
	}
	nodliRoot = xmlDoc.getElementsByTagName("templates");
	if(nodliRoot.length > 0){
		templateManager.templateList = new Array();
		var nodliTemplateList = nodliRoot[0].getElementsByTagName("template");
		for ( var iTemplate = 0; iTemplate < nodliTemplateList.length; iTemplate++) {
			var nodeTemplate = nodliTemplateList[iTemplate];
			var templateTemp = new Template();
			templateTemp.id = getAttributeSafe(nodeTemplate, "id");
			templateTemp.title = getAttributeSafe(nodeTemplate, "title");
			//var x = nodeTemplate.getElementsByTagName("formula");
			//var y = nodeTemplate.getElementsByTagName("formula")[0];
			//var z = nodeTemplate.getElementsByTagName("formula")[0].firstChild.nodeValue;
			templateTemp.formula = nodeTemplate.getElementsByTagName("formula")[0].firstChild.nodeValue;
			templateManager.addTemplate(templateTemp);
		}
		writeTemplateSelector();
		return;
	}
}

function runGenerateDataObject(){
	writeDobjCode();
}

var entityManager = new EntityManager;
var templateManager = new TemplateManager;
function refreshDobjEntities(){
	startRefreshData("entity");
}
function refreshDobjTemplates(){
	startRefreshData("template");
}
