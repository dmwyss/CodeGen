var g_aimp = new Array();

var iLobSummaryLength = 50;

var sAutoGen = "Auto generated code 20060727";
var sAutoGenCommentBigStart = "\t// " + sAutoGen + " start";
var sAutoGenCommentBigEnd = "\n\t// " + sAutoGen + " end";
var sAutoGenCommentSmall = "\t// " + sAutoGen + "";

function Imp(sCode, sName, sDescription){
	this.code = sCode;
	this.name = sName;
	this.description = sDescription;
}

function newImp(sCode, sName, sDescription){
	g_aimp[g_aimp.length] = new Imp(sCode, sName, sDescription);
}

function getImp(sType){
	if(sType == g_aimp[0].code){
		return getImpDOFields();
	} else if(sType == g_aimp[1].code){
		return getImpSMFFMF();
	} else if(sType == g_aimp[2].code){
		return getImpDBTS("main");
	} else if(sType == g_aimp[3].code){
		return getImpDBTS("audit");
	} else if(sType == g_aimp[4].code){
		return getImpHIBMAP();
	} else {
		return "ERR01: Check the file type has a getter implementation";
	}
}

function getImpDOFields(){
	var sOut = "";
	sOut += sAutoGenCommentBigStart;
	sOut += "\n\t/* Object Form data */";
	for(var i = 0; i < g_afld.length; i++){
		var fldThis = g_afld[i];
		if(!fldThis.isSystemField){
			var sName = fldThis.name;
			var sType = fldThis.type;
			var sNameIC = fldThis.nameInnerCaps;
			var sJavaType = fldThis.javaType;
			sOut += "\n\tprivate " + sJavaType + " " + sNameIC + "" + "; // Field " + getAsWords(sName) + " (id:" + fldThis.id + ")";
		}
	}
	sOut += "\n";
	for(var i = 0; i < g_afld.length; i++){
		var fldThis = g_afld[i];
		if(!fldThis.isSystemField){
			var sName = fldThis.name;
			var sType = fldThis.type;
			var sNameIC = fldThis.nameInnerCaps;
			var sJavaType = fldThis.javaType;
			//sOut += "\n\tpublic " + sJavaType + " get" + getFirstCap(sNameIC) + "" + "; // Field " + getAsWords(sName) + " (id:" + fldThis.id + ")";
			sOut += "\n\t/" + "**";
			sOut += "\n\t * Get " + getAsWords(sName) + " - (id:" + fldThis.id + ")." ;
			sOut += "\n\t * @return " + getAsWords(sName) + " in " + sJavaType + " format.";
			sOut += "\n\t *" + "/";
			sOut += "\n\tpublic " + sJavaType + " get" + getFirstCap(sNameIC) + "() {";
			sOut += "\n\t\treturn this." + sNameIC + ";";
			sOut += "\n\t}";
			sOut += "\n\t/" + "**";
			sOut += "\n\t * Set " + getAsWords(sName) + " - (id:" + fldThis.id + ")." ;
			sOut += "\n\t *" + "/";
			sOut += "\n\tpublic void set" + getFirstCap(sNameIC) + "(" + sJavaType + " _" + sNameIC + ") {";
			sOut += "\n\t\tthis." + sNameIC + " = _" + sNameIC + ";";
			sOut += "\n\t}";
		}
	}
	sOut += "\n\n\tpublic String toString(){";
	sOut += "\n\t\tStringBuffer sbOut = new StringBuffer();";
	for(var i = 0; i < g_afld.length; i++){
		var fldThis = g_afld[i];
		var sName = fldThis.name;
		var sType = fldThis.type;
		var sNameIC = fldThis.nameInnerCaps;
		var sJavaType = fldThis.javaType;
		if((sType == "BLOB") || (sType == "CLOB")){
			sOut += "\n\t\tbyte[] ab" + getFirstCap(sNameIC) + " = get" + getFirstCap(sNameIC) + "();";
			sOut += "\n\t\tString s" + getFirstCap(sNameIC) + " = \"\";";
			sOut += "\n\t\tif(ab" + getFirstCap(sNameIC) + " == null){";
			sOut += "\n\t\t\ts" + getFirstCap(sNameIC) + " = \"\";";
			sOut += "\n\t\t} else {";
			sOut += "\n\t\t\ts" + getFirstCap(sNameIC) + " = new String(ab" + getFirstCap(sNameIC) + ");";


//			sOut += "\n\t\t\ts" + getFirstCap(sNameIC) + " = \"\";";
			sOut += "\n\t\t\tif(s" + getFirstCap(sNameIC) + ".length() > " + iLobSummaryLength + "){";
			sOut += "\n\t\t\t\ts" + getFirstCap(sNameIC) + " = s" + getFirstCap(sNameIC) + ".substring(0, " + (iLobSummaryLength - 1) + ").replace(\'\\n\', \' \') + \"...(length:\" + s" + getFirstCap(sNameIC) + ".length() + \")\";";
			sOut += "\n\t\t\t}";
			sOut += "\n\t\t}";
			sOut += "\n\t\tsbOut.append(\"\\n" + sNameIC + " [\")" + ".append(";
			sOut += "s" + getFirstCap(sNameIC) + "";
			sOut += ")";
		} else {
			sOut += "\n\t\tsbOut.append(\"\\n" + sNameIC + " [\")" + ".append(";
			sOut += "get" + getFirstCap(sNameIC) + "()";
			sOut += ")";
		}
		sOut += ".append(\"]\")" + ";";
	}
	sOut += "\n\t\treturn sbOut.toString();\n\t}";
	sOut += sAutoGenCommentBigEnd;
	return sOut;
}

function getImpSMFFMF(){
	var sOut = "";
	sOut += sAutoGenCommentBigStart;
	sOut += "\n\t\t// Set the fields";
	for(var i = 0; i < g_afld.length; i++){
		var fldThis = g_afld[i];
		if(!fldThis.isSystemField){
			var sName = fldThis.name;
			var sType = fldThis.type;
			var sNameIC = fldThis.nameInnerCaps;
			var sJavaType = fldThis.javaType;
			sOut += "\n\tdata.set" + getFirstCap(sNameIC) + "(); // Set " + getAsWords(sName) + " - (id:" + fldThis.id + ").";
		}
	}
	sOut += sAutoGenCommentBigEnd;
	sOut += "\n";
	return sOut;
}

function get2Digits(sIn){
	sIn = "00" + sIn;
	return sIn.substring(sIn.length - 2, sIn.length)
}

function getImpDBTS(sType){
	var dtNow = new Date();
	var sNow = dtNow.getFullYear() + "-" + dtNow.getMonth() + "-" + dtNow.getDate() + " " + dtNow.getHours() + ":" + get2Digits(dtNow.getMinutes());
	sDbLoc = "sduat";
	sTableName = "client_rule_definitions";
	sTableAuditName = sTableName + "_audit";
	//var sSuperUser = "sddev_appluser";
	//var sMainUser = "icdev_appluser";
	var asSuperUsers = new Array("sddev_appluser", "icdev_appluser");
	var sArchiveUser = "<irdev_archive>";
	var sPreSect = "\n-- ---------------------------------------------------------------------------\n";

	// Begin rendering.
	var sOut = "";
	if(sType == "main"){
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableName.toUpperCase() + " Start DDL.";
		sOut += "\n-- Generated " + sNow + " from CADEV_DAU@DEVOLT.WORLD";
	
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableName.toUpperCase() + " CREATE TABLE.";
		sOut += "\n\nCREATE TABLE " + sDbLoc + "." + sTableName;
		sOut += " (";
		for(var i = 0; i < g_afld.length; i++){
			var fldThis = g_afld[i];
			var sName = fldThis.name;
			var sType = fldThis.type;
			var sJavaType = fldThis.javaType;
			sOut += "\n\t" + sName.toLowerCase();
			if(sName.length < 10){
				sOut += "\t";
			}
			//sOut += "\n\tdata.set" + getFirstCap(sNameIC) + "(); // Set " + getAsWords(sName) + " - (id:" + fldThis.id + ").";
			sOut += "\t" + fldThis.type;
			if((fldThis.type == "DATE") || (fldThis.type == "CLOB") || (fldThis.type == "BLOB")){
				// Dont add any refinements.
			} else {
				sOut += "(" + fldThis.length;
				if(fldThis.type == "NUMBER"){
					sOut += "," + fldThis.lengthAfterPoint;
				}
				sOut += ")";
			}
			if(fldThis.isMandatory){
				sOut += " NOT NULL";
			}
			if(i + 1 < g_afld.length){
				sOut += ",";
			}
		}
		sOut += "\n)";
		sOut += "\nPCTFREE     10";
		sOut += "\nPCTUSED     40";
		sOut += "\nINITRANS    1";
		sOut += "\nMAXTRANS    255";
		sOut += "\nTABLESPACE  sd_data";
		sOut += "\nSTORAGE   (";
		sOut += "\n	INITIAL     40960";
		sOut += "\n	MINEXTENTS  1";
		sOut += "\n	MAXEXTENTS  2147483645";
		sOut += "\n)";
		sOut += "\nLOB (file_content) STORE AS SYS_LOB0000068363C00014$$ (";
		sOut += "\n	TABLESPACE  sd_data";
		sOut += "\n	STORAGE   (";
		sOut += "\n		INITIAL     40960";
		sOut += "\n		MINEXTENTS  1";
		sOut += "\n		MAXEXTENTS  2147483645";
		sOut += "\n	)";
		sOut += "\n	NOCACHE LOGGING";
		sOut += "\n	CHUNK 8192";
		sOut += "\n	PCTVERSION 10";
		sOut += "\n)";
		sOut += "\n/";

	
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableName.toUpperCase() + " CREATE TRIGGERS.";
		sOut += "\n";
		sOut += "\nCREATE OR REPLACE TRIGGER " + sDbLoc + "." + sTableName;
		sOut += "\nBEFORE";
		sOut += "\nINSERT OR UPDATE";
		sOut += "\nON " + sDbLoc+ "." + sTableName;
		sOut += "\nREFERENCING NEW AS NEW OLD AS OLD";
		sOut += "\nFOR EACH ROW";
		sOut += "\nDECLARE";
		sOut += "\nBEGIN";
		sOut += "\n";
		sOut += "\n-- update the table's audit fields...";
		for(var iSysFld = 0; iSysFld < g_afld.length; iSysFld++){
			var fldThis = g_afld[iSysFld];
			if(fldThis.isSystemField){
				if(fldThis.name == "UPDATE_COUNT"){
					sOut += "\n\t:NEW." + fldThis.name.toLowerCase() + " := NVL(:old." + fldThis.name.toLowerCase() + ", 0) + 1;         -- increment by +1";
				} else if(fldThis.name == "UPDATE_MODULE_ID") {
					sOut += "\n\t:NEW." + fldThis.name.toLowerCase() + " := Current_User.gsGet_Application;    -- current NCS userid (default --     =   Oracle userid)";
				} else if(fldThis.name == "UPDATE_USER_ID") {
					sOut += "\n\t:NEW." + fldThis.name.toLowerCase() + " := Current_User.gsGet_UserID;           -- current NCS application  (default = 'UNKNOWN')";
				} else if(fldThis.name == "UPDATE_DATETIME") {
					sOut += "\n\t:NEW." + fldThis.name.toLowerCase() + " := SYSDATE;                            -- current date + time";
				} else {
					sOut += "\n\t-- !Fail: " + fldThis.name + " was not added to triggers.";
				}
			}
		}
		sOut += "\n";
		sOut += "\nEND;";
		sOut += "\n/";
		sOut += "\n";
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableName.toUpperCase() + " CREATE GRANTS.";
		for(var iU = 0; iU < asSuperUsers.length; iU++){
			sOut += "\nGRANT DELETE,INSERT,SELECT,UPDATE ON " + sDbLoc.toLowerCase() + "." + sTableName.toLowerCase() + " TO " + asSuperUsers[iU] + " WITH GRANT OPTION";
			sOut += "\n/";
		}
		//sOut += "\nGRANT SELECT, UPDATE, DELETE ON " + sDbLoc.toLowerCase() + "." + sTableName.toLowerCase() + " TO " + sArchiveUser + " WITH GRANT OPTION";
		//sOut += "\n/";
		sOut += "\n";
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableName.toUpperCase() + " CREATE CONSTRAINTS.";
		sOut += "\nALTER TABLE " + sTableName.toLowerCase();
		sOut += "\nADD CONSTRAINT " + sTableName.toLowerCase() + "_pk PRIMARY KEY (";
		var asSysFlds = new Array();
		for(var iSysFld = 0; iSysFld < g_afld.length; iSysFld++){
			var fldThis = g_afld[iSysFld];
			if(fldThis.isKey){
				asSysFlds[asSysFlds.length] = fldThis.name;
			}
		}
		sOut += "\n\t" + asSysFlds.join(",\n\t");
		sOut += "\n)";
		sOut += "\nUSING INDEX";
		sOut += "\n\tPCTFREE\t10";
		sOut += "\n\tINITRANS\t2";
		sOut += "\n\tMAXTRANS\t255";
		sOut += "\n\tTABLESPACE\tsd_index";
		sOut += "\n\tSTORAGE\t(";
		sOut += "\n\t\tINITIAL\t65536";
		sOut += "\n\t\tMINEXTENTS\t1";
		sOut += "\n\t\tMAXEXTENTS\t2147483645";
		sOut += "\n\t)";
		sOut += "\n/";
		sOut += "\n";
		sOut += "\n";
		sOut += "\n";
	} else {
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableAuditName.toUpperCase() + " Start DDL.";
		sOut += "\n-- Generated " + sNow + " from CADEV_DAU@DEVOLT.WORLD";
	
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableAuditName.toUpperCase() + " CREATE TABLE.";
		sOut += "\nCREATE TABLE " + sDbLoc + "." + sTableAuditName;
		sOut += " (";
		sOut += "\n\taudit_action \tVARCHAR2(32) NOT NULL, -- This field is not in original table";
		sOut += "\n\taudit_sequence \tNUMBER(6,0) NOT NULL, -- This field is not in original table";
		for(var i = 0; i < g_afld.length; i++){
			var fldThis = g_afld[i];
			var sName = fldThis.name;
			var sType = fldThis.type;
			var sJavaType = fldThis.javaType;
			sOut += "\n\t" + sName.toLowerCase();
			if(sName.length < 10){
				sOut += "\t";
			}
			//sOut += "\n\tdata.set" + getFirstCap(sNameIC) + "(); // Set " + getAsWords(sName) + " - (id:" + fldThis.id + ").";
			sOut += "\t" + fldThis.type;
			if((fldThis.type == "DATE") || (fldThis.type == "CLOB") || (fldThis.type == "BLOB")){
				// Dont add any refinements.
			} else {
				sOut += "(" + fldThis.length;
				if(fldThis.type == "NUMBER"){
					sOut += "," + fldThis.lengthAfterPoint;
				}
				sOut += ")";
			}
			if(fldThis.isMandatory){
				sOut += " NOT NULL";
			}
			if(i + 1 < g_afld.length){
				sOut += ",";
			}
		}
		sOut += "\n)\n";
	
	
		sOut += "\n";
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableAuditName.toUpperCase() + " CREATE GRANTS.";
//		sOut += "\nGRANT DELETE,INSERT,SELECT,UPDATE ON " + sDbLoc.toLowerCase() + "." + sTableAuditName.toLowerCase() + " TO " + sMainUser + " WITH GRANT OPTION";
//		sOut += "\n/";
//		sOut += "\nGRANT SELECT, UPDATE, DELETE ON " + sDbLoc.toLowerCase() + "." + sTableAuditName.toLowerCase() + " TO " + sArchiveUser + " WITH GRANT OPTION";
//		sOut += "\n/";
		for(var iU = 0; iU < asSuperUsers.length; iU++){
			sOut += "\nGRANT DELETE,INSERT,SELECT,UPDATE ON " + sDbLoc.toLowerCase() + "." + sTableAuditName.toLowerCase() + " TO " + asSuperUsers[iU] + " WITH GRANT OPTION";
			sOut += "\n/";
		}
		sOut += "\n";
	
		sOut += sPreSect + "-- " + sDbLoc.toUpperCase() + "." + sTableAuditName.toUpperCase() + " CREATE TRIGGERS.";
		sOut += "\nCREATE OR REPLACE TRIGGER " + sTableName + "_tr1";
		sOut += "\nAFTER";
		sOut += "\nDELETE OR UPDATE";
		sOut += "\nON " + sTableName + "";
		sOut += "\nREFERENCING NEW AS NEW OLD AS OLD";
		sOut += "\nFOR EACH ROW";
		sOut += "\nDeclare";
		sOut += "\n\tv_action_id NUMBER(8);";
		sOut += "\n\tv_audit_action VARCHAR2(3);";
		sOut += "\n\tv_audit_sequence NUMBER(8);";
		sOut += "\n";
		sOut += "\nBegin";
		sOut += "\n\t-- ** THIS TRIGGER AUDITs THE xml_action TABLE";
		sOut += "\n\t-- ** NOTE; creates 'UPD' audit AFTER update (using OLD values)";
		sOut += "\n\t-- ** NOTE; creates 'DEL' audit AFTER delete (using OLD values)";
		sOut += "\n\t-- ** NOTE; does NOT create INS audit";
		sOut += "\n\t-- (the reason for this approach is that the :NEW.translation_xml CLOB value was always BLANK)";
		sOut += "\n\t";
		sOut += "\n\t-- obtain xml_action primary key (action_id)";
		sOut += "\n\t";
		sOut += "\n\tIF UPDATING THEN";
		sOut += "\n\t\tv_action_id := :OLD.action_id;";
		sOut += "\n\t\tv_audit_action := 'UPD';";
		sOut += "\n\tELSIF INSERTING THEN";
		sOut += "\n\t\tv_action_id := :NEW.action_id;";
		sOut += "\n\t\tv_audit_action := 'INS';"
		sOut += "\n\tELSE    -- ie. deleting";
		sOut += "\n\t\tv_action_id := :OLD.action_id;";
		sOut += "\n\t\tv_audit_action := 'DEL';";
		sOut += "\n\tEND IF;";
		sOut += "\n";
		sOut += "\n\t-- determine audit sequence";
		sOut += "\n\t";
		sOut += "\n\tSELECT (NVL(MAX(audit_sequence),0) + 1) INTO v_audit_sequence";
		sOut += "\n\tFROM " + sTableAuditName + " a";
		sOut += "\n\tWHERE a.action_id = v_action_id;";
		sOut += "\n";
		sOut += "\n\t-- audit changes (nb: primary key cannot change)";
		sOut += "\n\t-- updating/deleting - audit using OLD values and current datetime";
		sOut += "\n\t";
		sOut += "\n\tINSERT INTO " + sTableAuditName + " a";
		sOut += "\n\t\t(";
		sOut += "\n\t\ta.audit_action,";
		sOut += "\n\t\ta.audit_sequence,";
		for(var iSysFld = 0; iSysFld < g_afld.length; iSysFld++){
			var fldThis = g_afld[iSysFld];
			sOut += "\n\t\ta." + fldThis.name.toLowerCase() + ",";
		}
		sOut += "\n\t\t)";
		sOut += "\n\tValues";
		sOut += "\n\t\t(";
		sOut += "\n\t\tv_audit_action,";
		sOut += "\n\t\tv_audit_sequence,";
		for(var iSysFld = 0; iSysFld < g_afld.length; iSysFld++){
			var fldThis = g_afld[iSysFld];
			if(!fldThis.isSystemField || (fldThis.name.toLowerCase() == "update_count")){
				sOut += "\n\t\t:OLD." + fldThis.name.toLowerCase() + ",";
			}
		}
		sOut += "\n\t\tCurrent_User.gsGet_UserID,";
		sOut += "\n\t\tCurrent_User.gsGet_Application,";
		sOut += "\n\t\tSYSDATE";
		sOut += "\n\t\t)";
		sOut += "\nEnd;"
		sOut += "\n/"
	}
	return sOut;
}

function getImpHIBMAP(){
	var sTable = g_sTableName;
	if(sTable == undefined){ alert("table name not defined");}
	var sOut = "";
	sOut += sAutoGenCommentBigStart;
	sOut += "\n\t\t// Set the fields";

	var iIdFields = 0;
	var iIdFieldLast = 0;
	for(var i = 0; i < g_afld.length; i++){
		var fldThis = g_afld[i];
		if(fldThis.isKey){
			iIdFields++;
			iIdFieldLast = i;
			var sName = fldThis.name;
			var sNameIC = fldThis.nameInnerCaps;
			sOut += "\n<key-property name=\"" + sNameIC + "\" column=\"" + sName + "\"/>";
		}
	}
	if(iIdFields > 1){
		sOut = "<composite-id name=\"id\" class=\"national.gss.vctr.route.model.MYCLASSNAME\">" + sOut;
		sOut += "</composite-id>";
	} else {
		sOut = "";
		sOut += "\n<id name=\"id\" column=\"" + g_afld[iIdFieldLast].name + "\"/>";
	}
	for(var i = 0; i < g_afld.length; i++){
		var fldThis = g_afld[i];
		if(!fldThis.isSystemField){
			var sName = fldThis.name;
			var sType = fldThis.type;
			var sNameIC = fldThis.nameInnerCaps;
			var sJavaType = fldThis.javaType;
			//sOut += "\n\tdata.set" + getFirstCap(sNameIC) + "(); // Set " + getAsWords(sName) + " - (id:" + fldThis.id + ").";
			sOut += "\n<property name=\"" + sNameIC + "\" column=\"" + sName + "\"/>";
		}
	}
	sOut += sAutoGenCommentBigEnd;
	sOut += "\n";
	return sOut;
}

newImp("DOFields", "POJO Content", "");
newImp("SMFFMF", "SetFieldsFromMessageFile", "Set the fields From the MessageFile class");
newImp("DBTS", "DatabaseTableScript", "Set the columns in a database");
newImp("DBTSA", "DatabaseTableScriptAudit", "Set the columns in a database for Auditing");
newImp("HIBMAP", "HibernateMapping", "Mapping for a Hibernate object");
