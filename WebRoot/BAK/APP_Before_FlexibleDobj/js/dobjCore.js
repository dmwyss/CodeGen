// dobjCore.js

function writeTemplateSelector(){
	var areaSel = document.getElementById("dobj-templateSelector");
	var sOut = "<select>";
	var asEntityIds = entityManager.getAllIds();
	for ( var iEnt = 0; iEnt < asEntityIds.length; iEnt++) {
		sOut += "<option value=\"" + asEntityIds[iEnt] + "\">" + asEntityIds[iEnt] + "</option>";
	}
	sOut += "</select>";
	areaSel.innerHTML = sOut;
}

function refreshData(){
}

function startRefreshData(){
    httpxmlRequest = createXMLHttpRequest();
    var sXmlUrl = "data/dobjEntities.xml";
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
	}
}
function processXmlDoc(xmlDoc){
	var objOut = new Object();
	var nodliRoot = xmlDoc.getElementsByTagName("entities");
	var nodliEntityList = nodliRoot[0].getElementsByTagName("entity");
	for ( var iEntity = 0; iEntity < nodliEntityList.length; iEntity++) {
		var nodeEntity = nodliEntityList[iEntity];
		var entityTemp = new Entity();
		entityTemp.project = getAttributeSafe(nodeEntity, "project");
		entityTemp.entityName = getAttributeSafe(nodeEntity, "entityName");

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
	writeTemplateSelector();
	/*
    	var nodliRoot = xmlDoc.getElementsByTagName("valueObject");
    objOut.objectType = nodliRoot[0].getAttribute("objectType");
    objOut.status = nodliRoot[0].getAttribute("status");
	objOut.statusMessage = nodliRoot[0].getAttribute("statusMessage");

    var nodliMembers = nodliRoot[0].getElementsByTagName("member");
    for(var iR = 0; iR < nodliMembers.length; iR++){
        var nodliDatabaseDataTop = nodliMembers[iR];
        var sMemberName = nodliDatabaseDataTop.getAttribute("name");
        var sMemberDataType = nodliDatabaseDataTop.getAttribute("dataType");
        var sMemberValue = nodliDatabaseDataTop.childNodes[0].nodeValue;
        sOut += "\n" + sMemberName + "|" + sMemberDataType + "=" + sMemberValue;
        objOut[sMemberName] = (sMemberDataType == "int") ? parseInt(sMemberValue) : sMemberValue;
    }
    
    var selTrg = document.forms[0].agencyId;
	selTrg.options[selTrg.options.length] = new Option(objOut.agencyName, objOut.agencyId);
	selTrg.selectedIndex = (selTrg.options.length - 1);
	*/
}
var entityManager = new EntityManager;
function refreshDoj(){
	startRefreshData();
	//writeTemplateSelector();
}
