
var g_asDataTypes = 	   new Array("-", "int", "String", "Integer", "Date", "Timestamp", "Email", "Password", "byte", "short", "boolean");
var g_asDataTypeDefaults = new Array("-", "0", "", "new Integer(0)", "new java.util.Date()", "new java.util.Date()", "", "", "0", "0", "false");
var g_asRelationTypes = new Array("-", "key", "fkey", "fkey-nullable", "notnull", "unique");

function runConvertFromSqlDescriptionToFields(){
	//txtDobj_className
	var txaFields = document.forms[0].txaIn;
	var sT = txaFields.value;
	if((sT.indexOf("VARCHAR") != -1) || (sT.indexOf("DATE") != -1) || (sT.indexOf("NUMBER") != -1)){
		sT = sT.toLowerCase();
		sT = recursiveReplaceSubstring(sT, "not null", "$");
		sT = recursiveReplaceSubstring(sT, "\t", "$");
		sT = recursiveReplaceSubstring(sT, " ", "$");
		sT = recursiveReplaceSubstring(sT, "$$", "$");
		sT = replaceSubstring(sT, "varchar2(", "String$");
		sT = replaceSubstring(sT, "varchar(", "String$");
		sT = replaceSubstring(sT, "number(", "int$");
		sT = replaceSubstring(sT, "$byte", "");
		sT = replaceSubstring(sT, ")", "");
		sT = replaceSubstring(sT, "$\n", "\n");
		sT = replaceSubstring(sT, ",0", "");
		var asT = sT.split("\n");
		for(var i = 0; i < asT.length; i++){
			var asR = asT[i].split("\r").join("").split("\n").join("").split("$");
			if((asR.length == 3) && (!isNaN(asR[2]))){
				asT[i] = asR[0] + "$" + asR[1] + "$" + asR[2] + "$0";
			}
		}
		txaFields.value = asT.join("\n");
	}
}

function runConvertFromDollarSeparatedToFields(){
	//a lert(document.forms[0].txtDobj_className.value);
	var txaFields = document.forms[0].txaIn;
	if((!getHasFields()) || confirm("Overwrite existing fields?")){
		showHideDataGrid();
	}
}


function getHasFields(){
	var aelementsAll = document.forms[0].elements;
	for(var iE = 0; iE < aelementsAll.length; iE++){
		var elemTemp = aelementsAll[iE];
		if(elemTemp.name.indexOf("clsMemVar_") == 0){
			return true;
		}
	}
	return false;
}

function runGenerateDataObject(){

	if(!getHasFields()){
		alert("No fields rendered into grid.\n\nPlease convert from data");
		return;
	}



	showDataGridValuesAsLines();
	convertTextToClassVarArray(getTextAreaValue("txaIn"));

	var f = document.forms[0];
	var sClassName = f.txtDobj_className.value;
	var sTableName = f.txtDobj_tableName.value;
	var sProjectName = f.txtDobj_projectName.value;
	if(sClassName.length == 0){
		sClassName = "MyClass";
	}
	var sClassNameUnderscore = getAsUnderscore(sClassName);
	var aTextLine = f.txaIn.value.split("\n");
	var adatafield = new Array();
	for(var i = 0; i < aTextLine.length; i++){
		aTextLine[i] = trim(aTextLine[i]);
		if(aTextLine[i].length != 0){
			adatafield[adatafield.length] = new DataField(aTextLine[i]);
		}
	}
	var sOut = "";
	if(f.txtDobj_createJavaStrutsForm.checked){
		// Write the Form Class
		sOut += "public class " + sClassName + "Form {\n\n";
		// Write the private fields.
		sOut += "\tprivate " + sClassName + "VO datavo = new " + sClassName + "VO(); // Data to hold the " + sClassName + " values.\n";
		sOut += "\tprivate static final int TYPE_STRING = 0;\n";
		sOut += "\tprivate static final int TYPE_INT = 1;\n";
		sOut += "\tprivate static final int TYPE_DATE = 2;\n";
		// Write the getters and setters.
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += "\n\t/**\n\t * " + row.description + "\n\t */\n";
			if(row.type == "String"){
				sOut += "\tpublic " + row.type + " get" + toLeadUpperCase(row.name) + "(){\n";
				sOut += "\t\treturn this.datavo.get" + toLeadUpperCase(row.name) + "();\n";
				sOut += "\t}\n";
				sOut += "\n\t/**\n\t * " + row.description + ".\n\t */\n";
				sOut += "\tpublic void set" + toLeadUpperCase(row.name) + "(" + row.type + " sValToSet){\n";
				sOut += "\t\tsValToSet = runValidation(\"" + row.name + "\", sValToSet, TYPE_" + row.type.toUpperCase() + ", " + row.minLength + ", " + row.maxLength + ");\n";
				sOut += "\t\tthis.datavo.set" + toLeadUpperCase(row.name) + "(sValToSet);\n";
				sOut += "\t}\n";
			} else if(row.type == "int") {
				sOut += "\tpublic String get" + toLeadUpperCase(row.name) + "(){\n";
				sOut += "\t\treturn new Integer(this.datavo.get" + toLeadUpperCase(row.name) + "()).toString();\n";
				sOut += "\t}\n";
				sOut += "\n\t/**\n\t * " + row.description + ".\n\t */\n";
				sOut += "\tpublic void set" + toLeadUpperCase(row.name) + "(String sValToSet){\n";
				sOut += "\t\tint iValToSet = 0;\n";
				sOut += "\t\ttry {\n";
				sOut += "\t\t\tsValToSet = runValidation(\"" + row.name + "\", sValToSet, TYPE_" + row.type.toUpperCase() + ", " + row.minLength + ", " + row.maxLength + ");\n";
				sOut += "\t\t\tiValToSet = Integer.parseInt(sValToSet);\n";
				sOut += "\t\t} catch (Exception e){}\n";
				sOut += "\t\tthis.datavo.set" + toLeadUpperCase(row.name) + "(iValToSet);\n";
				sOut += "\t}\n";
			} else {
				sOut += "\tpublic String get" + toLeadUpperCase(row.name) + "(){\n";
				sOut += "\t\treturn this.datavo.get" + toLeadUpperCase(row.name) + "().toString();\n";
				sOut += "\t}\n";
				sOut += "\n\t/**\n\t * " + row.description + ".\n\t */\n";
				sOut += "\tpublic void set" + toLeadUpperCase(row.name) + "(String sValToSet){\n";
				sOut += "\t\tint iValToSet = 0;\n";
				sOut += "\t\ttry {\n";
				sOut += "\t\t\tsValToSet = runValidation(\"" + row.name + "\", sValToSet, TYPE_" + row.type.toUpperCase() + ", " + row.minLength + ", " + row.maxLength + ");\n";
				sOut += "\t\t\tiValToSet = " + row.type + ".parseInt(sValToSet);\n";
				sOut += "\t\t} catch (Exception e){}\n";
				sOut += "\t\tthis.datavo.set" + toLeadUpperCase(row.name) + "(iValToSet);\n";
				sOut += "\t}\n";
			}
		}
		sOut += "\n";

		// Return the toString method.
		sOut += "\n\t/**\n\t * Return the object in a format that can be easily read.\n\t */\n";
		sOut += "\tpublic String toString(){\n";
		sOut += "\t\treturn this.datavo.toString();\n";
		sOut += "\t}\n";

		// Return the reset method.
		sOut += "\n\t/**\n\t * Reset the data to the original state.\n\t */\n";
		sOut += "\tpublic String reset(){\n";
		sOut += "\t\treturn this.datavo.reset();\n";
		sOut += "\t}\n";

		sOut += "\n\t/**\n\t * Validate each field according to its settings.\n\t */\n";
		sOut += "\tprivate String runValidation(String sFieldName, String sToTest, int iType, int iMinLen, int iMaxLen){\n";
		sOut += "\t\tif(sToTest == null){\n";
		sOut += "\t\t\tsToTest = \"\";\n";
		sOut += "\t\t}\n";
		sOut += "\t\tif(sToTest.length() < iMinLen){\n";
		sOut += "\t\t\t//saveError(sFieldName, sToTest, \"Value too short\")\";\n";
		sOut += "\t\t}\n";
		sOut += "\t\tif(sToTest.length() > iMaxLen){\n";
		sOut += "\t\t\t//saveError(sFieldName, sToTest, \"Value too long\")\";\n";
		sOut += "\t\t}\n";
		sOut += "\t\tif(iType == TYPE_INT){\n";
		sOut += "\t\t\tif(sToTest.length() == 0){\n";
		sOut += "\t\t\t\tsToTest = \"0\";\n";
		sOut += "\t\t\t} else {\n";
		sOut += "\t\t\t\ttry {\n";
		sOut += "\t\t\t\t\tInteger.parseInt(sToTest);\n";
		sOut += "\t\t\t\t} catch (Exception e) {\n";
		sOut += "\t\t\t\t\t//saveError(sFieldName, sToTest, \"Not a number\")\";\n";
		sOut += "\t\t\t\t}\n";
		sOut += "\t\t\t}\n";
		sOut += "\t\t} else if(iType == TYPE_DATE){\n";
		sOut += "\t\t} else {\n";
		sOut += "\t\t}\n";
		sOut += "\t\treturn sToTest;\n";
		sOut += "\t}\n";
		sOut += "}\n";
	}
	if(f.txtDobj_createJavaVO.checked){
		// WRITE THE VO CLASS ===========================================================
		var isIntAsInteger = document.forms[0].txtDobj_setting_intAsInteger.checked;
		//a lert(isIntAsInteger);
		sOut += "\n/**\n * " + sClassName + " Value Object.\n */\n";
		sOut += "public class " + sClassName + "VO {\n\n";
		// Write the private fields.
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += "\tprivate " + row.type + " " + row.name + " = " + row.defaultValue;
			sOut += "; // " + row.description + ".\n";
		}
		// Write the getters and setters.
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += "\n\t/**\n\t * " + row.description + ".\n\t */\n";
			sOut += "\tpublic ";
			if((row.type == "int") && (isIntAsInteger)){
				sOut += "Integer";
			} else {
				sOut += row.type;
			}
			sOut += " get" + toLeadUpperCase(row.name) + "(){\n";

			if((row.type == "int") && (isIntAsInteger)){
				sOut += "\t\treturn new Integer(this." + row.name + ");\n";
			} else {
				sOut += "\t\treturn this." + row.name + ";\n";
			}


			sOut += "\t}\n";
			sOut += "\n\t/**\n\t * " + row.description + ".\n";
			sOut += "\t * @param valToSet The " + row.description + " value.\n";
			sOut += "\t */\n";
			sOut += "\tpublic void set" + toLeadUpperCase(row.name) + "(";
			if((row.type == "int") && (isIntAsInteger)){
				sOut += "Integer";
			} else {
				sOut += row.type;
			}
			sOut += " valToSet){\n";


			if((row.type == "int") && (isIntAsInteger)){
				sOut += "\t\tif(valToSet == null){\n";
				sOut += "\t\t\tthis." + row.name + " = 0;\n";
				sOut += "\t\t} else {\n";
				sOut += "\t\t\tthis." + row.name + " = Integer.valueOf(valToSet);\n";
				sOut += "\t\t}\n";
			} else {
				sOut += "\t\tthis." + row.name + " = valToSet;\n";
			}




			sOut += "\t}\n";
		}

		// Write the toString Method
		sOut += "\n\t/**\n\t * Convert the object to an easily readble string.\n\t */";
		sOut += "\n\tpublic String toString(){\n";
		sOut += "\t\treturn \"" + sClassName + ":\"";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += "\n\t\t+ \"[" + row.name + ":\" + this." + row.name + " + \"]\"";
		}
		sOut += ";\n";
		sOut += "\t}\n";


		// Write the reset Method
		sOut += "\n\t/**\n\t * Reset all the values in the object.\n\t */";
		sOut += "\n\tpublic void reset(){\n";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += "\t\tthis." + row.name + " = " + row.defaultValue + ";\n";
		}
		sOut += "\t}\n";

		sOut += "}";
	}
	if(f.txtDobj_createSqlCreateTable.checked){
		
		var sTableNameSuffix = "_t";
		var sTableNamePrefix = "rf_";

		var isOracle = false;
		if(isOracle){
			// Create SQL to get the data.
			var sObjectName = f.txtDobj_className.value;
			//var sTableName = f.txtDobj_tableName.value;
			sOut += "create table " + sTableNamePrefix + sTableName + sTableNameSuffix + "\n(";
			var sConstraint = "";
			var sUnique = "";
			var sTriggers = "";
			for(var i = 0; i < atablecols.length; i++){
				var row = atablecols[i];
				sOut += "\n\t" + row.name + " ";
				//"int", "String", "Date", "Email", "Password", "byte", "short", "boolean");
				if(",int,short,byte,boolean,".indexOf("," + row.type + ",") != -1){
					sOut += "number(" + row.lenMax + ",0)";
				} else if(",String,Email,Password,".indexOf("," + row.type + ",") != -1){
					sOut += "varchar2(" + row.lenMax + " byte)";
				} else {
					sOut += row.type.toLowerCase();
				}
				if(row.defaultValue != ""){
					sOut += " default ";
					if(",String,Email,Password,".indexOf("," + row.type + ",") != -1){
						sOut += "\'" + row.defaultValue + "\'";
					} else {
						sOut += row.defaultValue;
					}
				}
				if(row.relation != ""){
					if(row.relation == "key"){
						sOut += " not null";
						sConstraint += "\n\t,\n\tconstraint " + sTableNamePrefix + sTableName + sTableNameSuffix + "_pk primary key (" + row.name + ")"
						+ "\n\t   using index pctfree 10 initrans 2 maxtrans 255 compute statistics"
						+ "\n\t   storage(initial 1000 next 1001 minextents 1 maxextents 2147483645"
						+ "\n\t   pctincrease 0 freelists 1 freelist groups 1 buffer_pool default)"
	
						sTriggers += "\n\tif (inserting) then"
						+ "\n\t\tif (:new." + row.name + ") is null then"
						+ "\n\t\t\tselect " + sTableNamePrefix + sTableName + "_seq.nextval"
						+ "\n\t\t\tinto :new." + row.name + ""
						+ "\n\t\t\tfrom dual;"
						+ "\n\t\tend if;"
						+ "\n\tend if;"
					} else if(row.relation == "fkey"){
						sOut += " not null";
					} else if(row.relation == "unique"){
						sUnique += "\n\t,\n\tconstraint " + sTableNamePrefix + sTableName + "__" + row.name + " unique (" + row.name + ") enable";
					}
				}
				//sOut += ((i < (atablecols.length - 1)) ? "," : "");
				sOut += ",";
			}
			sOut += "\n\taudit_dtime date default sysdate";
			sOut += sConstraint;
			sOut += sUnique;
			sOut += "\n)";
			sOut += "\n;";
			sOut += "\n";
			sOut += "\ncreate or replace trigger " + sTableNamePrefix + sTableName + "_biur";
			sOut += "\nbefore insert or update";
			sOut += "\non " + sTableNamePrefix + sTableName + sTableNameSuffix;
			sOut += "\nfor each row";
			sOut += "\nbegin";
			sOut += sTriggers;
			sOut += "\n\tif (updating) then";
			sOut += "\n\t\t:new.audit_dtime := sysdate;";
			sOut += "\n\tend if;";
			sOut += "\nend " + sTableNamePrefix + sTableName + "_biur;";
			sOut += "\n/";
			sOut += "\nalter trigger " + sTableNamePrefix + sTableName + "_biur enable";
			sOut += "\n;";
			sOut += "\ncreate sequence " + sTableNamePrefix + sTableName + "_seq";
			sOut += "\n   minvalue 1 maxvalue 999999999999999999999999999";
			sOut += "\n   increment by 1 start with 1000 nocache noorder nocycle";
			sOut += "\n;";
		
		
		} else {
		
		// ????????????????????????????????????????????????????????????????????
		
		
			
			//sOut = "";
			sOut += "\n\n-- HSQLDB\n";
			sOut += "create text table " + sTableName + sTableNameSuffix + "\n(";
			var sConstraint = "";
			var sUnique = "";
			var sTriggers = "";
			for(var i = 0; i < atablecols.length; i++){
				var row = atablecols[i];
				sOut += "\n\t";
				if(i != 0){
					sOut += ", ";
				}
				sOut += row.name + " ";
					
				if(row.relation != "key"){
					//"int", "String", "Date", "Email", "Password", "byte", "short", "boolean");
					if(",int,short,byte,".indexOf("," + row.type + ",") != -1){
						sOut += "integer";
					} else if(",String,Email,Password,boolean,".indexOf("," + row.type + ",") != -1){
						sOut += "varchar";
					} else if(",Date,Timestamp,".indexOf("," + row.type + ",") != -1){
						sOut += "timestamp";
					} else {
						sOut += row.type.toLowerCase();
					}
					if(row.defaultValue != ""){
						sOut += " default ";
						if(",String,Email,Password,boolean,".indexOf("," + row.type + ",") != -1){
							sOut += "\'" + row.defaultValue + "\'";
						} else {
							sOut += row.defaultValue;
						}
					}
				}
				if(row.relation != ""){
					if(row.relation == "key"){
						sOut += "integer generated by default as identity(start with 1) not null primary key";
					} else if(row.relation == "fkey"){
						sOut += " not null";
					} else if(row.relation == "unique"){
						sUnique += "\n\t,\n\tconstraint " + sTableNamePrefix + sTableName + "__" + row.name + " unique (" + row.name + ") enable";
					}
				}
				//sOut += ((i < (atablecols.length - 1)) ? "," : "");
			}
			//sOut += "\n\taudit_dtime date default sysdate";
			sOut += "\n)";
			sOut += "\n-- Set the source";
			sOut += "\nSET TABLE " + sTableName + sTableNameSuffix + " SOURCE \"" + sProjectName + "\\" + sTableName + sTableNameSuffix + ".data\"";
		}
	}
	if(f.txtDobj_createSqlSelect.checked){
		// Create SQL to get the data.
		sOut += "select ";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			if(row.dbColumn == "id"){
				sOut += ((i == 0) ? "\t" : "\t, ") + row.dbColumn + " as " + sClassName.toLowerCase() + "_id\n";
			} else {
				sOut += ((i == 0) ? "\t" : "\t, ") + row.dbColumn + "\n";
			}
		}
		sOut += "from " + sClassName.toLowerCase() + "_t\n";
		sOut += "where " + sClassName.toLowerCase() + "_id = <param input=\"" + sClassName.toLowerCase() + "_id\"/>\n";
	}
	if(f.txtDobj_createSqlInsert.checked){

		var sObjectName = f.txtDobj_className.value;
		var sTableName = f.txtDobj_tableName.value;
		var sTableNamePrefix = "rf_";
		var sTableNameSuffix = "_t";
		var sValues = "";
		sOut += "\n\ninsert into " + sTableName + sTableNameSuffix + "\n(";
		for(var i = 0; i < atablecols.length; i++){
			var row = atablecols[i];
			sOut += "\n\t";
			if(i != 0){
				sOut += ", ";				
			}
			sOut += row.name;
			/*
			if(",int,short,byte,".indexOf("," + row.type + ",") != -1){
				sOut += "integer";
			} else if(",String,Email,Password,boolean,".indexOf("," + row.type + ",") != -1){
				sOut += "varchar";
			} else {
				sOut += row.type.toLowerCase();
			}
			*/
			sValues += "\n\t";
			if(i != 0){
				sValues += ", ";				
			}
			if(",String,Email,Password,boolean,".indexOf("," + row.type + ",") != -1){
				sValues += "\'";
				if(row.defaultValue != ""){
					sValues += row.defaultValue;
				}
				sValues += "\'";
			} else {
				if(row.defaultValue != ""){
					sValues += row.defaultValue;
				} else {
					sValues += "0";
				}
			}
			sValues += "\t-- " + row.name;
			/*
			if(row.relation != ""){
				if(row.relation == "key"){
					sOut += " not null";
					sConstraint += "\n\t,\n\tconstraint " + sTableNamePrefix + sTableName + sTableNameSuffix + "_pk primary key (" + row.name + ")"
					+ "\n\t   using index pctfree 10 initrans 2 maxtrans 255 compute statistics"
					+ "\n\t   storage(initial 1000 next 1001 minextents 1 maxextents 2147483645"
					+ "\n\t   pctincrease 0 freelists 1 freelist groups 1 buffer_pool default)"
					sTriggers += "\n\tif (inserting) then"
					+ "\n\t\tif (:new." + row.name + ") is null then"
					+ "\n\t\t\tselect " + sTableNamePrefix + sTableName + "_seq.nextval"
					+ "\n\t\t\tinto :new." + row.name + ""
					+ "\n\t\t\tfrom dual;"
					+ "\n\t\tend if;"
					+ "\n\tend if;"
				} else if(row.relation == "fkey"){
					sOut += " not null";
				} else if(row.relation == "unique"){
					sUnique += "\n\t,\n\tconstraint " + sTableNamePrefix + sTableName + "__" + row.name + " unique (" + row.name + ") enable";
				}
			}
			 */
			//sOut += ((i < (atablecols.length - 1)) ? "," : "");
		}
		sOut += "\n) values (";
		sOut += sValues; // + "\n\tsysdate";
		sOut += "\n)";

	}
	if(f.txtDobj_createHtmlForm.checked){
		sOut += "\t<table cellpadding=\"0\" cellspacing=\"0\" class=\"table-form\">\n";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += "\t\t<tr>\n";
			sOut += "\t\t\t<td class=\"td-formLabel\">" + row.description + ":</td>\n";
			sOut += "\t\t\t<td class=\"td-formValue\"><input type=\"text\" name=\"" + row.name + "\" maxlength=\"" + row.maxLength + "\" class=\"textInput-default\"/></td>\n";
			sOut += "\t\t</tr>\n";
		}
		sOut += "\t</table>\n";
	}
	if(f.txtDobj_createChampionBean.checked){
		sOut += "\n\t\tIManager manager = ManagerBroker.getManager();";
		sOut += "\n\t\tQueryInfo qi = new QueryInfo(sSqlBeanToUse);";
		sOut += "\n\t\tqi.set(\"" + sClassName.toLowerCase() + "_id\", i" + sClassName + "Id);";
		sOut += "\n\t\tlog.trace(\"[conferenceId:\" + i" + sClassName + "Id + \"]\");";
		sOut += "\n\t\tlog.trace(manager.getQuery(qi));";
		sOut += "\n\t\tChampionBean cbRawFetch = manager.fetch(qi);";
		sOut += "\n\t\t// Option 1";
		sOut += "\n\t\tArrayList<String[]> alOut = new ArrayList<String[]>();";
		sOut += "\n\t\t// Option 2";
		sOut += "\n\t\tArrayList<" + sClassName + "VO> alOut = new ArrayList<" + sClassName + "VO>();";
		sOut += "\n\t\tfor(int iCB = 0; iCB < cbRawFetch.size(); iCB++){";
		sOut += "\n\t\t\tChampionBean cbTemp = cbRawFetch.getBean(iCB);";

		sOut += "\n\t\t\t// Option 1\n/*";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			if(row.type == "String"){
				sOut += "\n\t\t\tString s" + toLeadUpperCase(row.name) + " = cbTemp.stringValue(\"" + row.dbColumn + "\", " + row.defaultValue + ");";
			} else if(row.type == "int"){
				sOut += "\n\t\t\tString s" + toLeadUpperCase(row.name) + " = Integer.toString(cbTemp.intValue(\"" + row.dbColumn + "\", " + row.defaultValue + "));";
			} else {
				sOut += "\n\t\t\tString s" + toLeadUpperCase(row.name) + " = cbTemp.stringValue(\"" + row.dbColumn + "\", " + row.defaultValue + ");";
			}
		}

		sOut += "\n\t\t\talOut.add(new String[]{";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += ((i == 0) ? "" : ", ") + "s" + toLeadUpperCase(row.name) + "";
		}
		sOut += "});\n*/";



		sOut += "\n\t\t\t// Option 222222222222222";
		sOut += "\n\t\t\t" + sClassName + "VO " + sClassName.toLowerCase() + "voTemp = new " + sClassName + "VO();";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += "\n\t\t\t" + sClassName.toLowerCase() + "voTemp.set" + toLeadUpperCase(row.name) + "(cbTemp." + row.type.toLowerCase() + "Value(\"" + row.dbColumn + "\", " + row.defaultValue + "));";
		}

		sOut += "\n\t\t\talOut.add(" + sClassName.toLowerCase() + "voTemp);";


		sOut += "\n\t\t}";
		sOut += "\n\n\n<" + "!" + "-- For XML file --" + ">";
		
		
		
		
		
		
		
		// Create SQL to get the data.
		sOut += "\n\n\t<!--\n";
		sOut += "\tGet the " + sClassName + ".\n";
		sOut += "\t-->\n";
		sOut += "\t<bean type=\"Matchup_" + sClassName + "_Retrieve\">\n";
		sOut += "\t\t<selection attribute=\"" + sClassName.toLowerCase() + "_id\"/>\n";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			if(row.dbColumn != "id"){
				sOut += "\t\t<selection attribute=\"" + row.dbColumn + "\"/>\n";
			}
		}
		sOut += "\t\t<cachequery>\n";
		sOut += "\t\t\t<query>\n";
		sOut += "\t\t\t\tselect ";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			if(row.dbColumn != "id"){
				sOut += ((i == 0) ? "" : "\t\t\t\t, ") + row.dbColumn + "\n";
			} else {
				sOut += ((i == 0) ? "" : "\t\t\t\t, ") + row.dbColumn + " as " + sClassName.toLowerCase() + "_id\n";
			}
		}
		sOut += "\t\t\t\tfrom " + sClassName.toLowerCase() + "_t\n";
		sOut += "\t\t\t\twhere " + sClassName.toLowerCase() + "_id = <param input=\"" + sClassName.toLowerCase() + "_id\"/>\n";
		sOut += "\t\t\t</query>\n";
		sOut += "\t\t</cachequery>\n";
		sOut += "\t</bean>\n";
		sOut += "\n\t<!-- Attributes for " + sClassName + " -->\n";
		sOut += "\t<attribute name=\"" + sClassName.toLowerCase() + "_id\" type=\"int\"/>\n";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			if(row.dbColumn != "id"){
				sOut += "\t<attribute name=\"" + row.dbColumn + "\" type=\"" + ((row.type.indexOf("java.util") != -1) ? "date" : row.type) + "\"/>\n";
			}
		}

	}
	if(f.txtDobj_createHibernateMapping.checked){

		sOut += "\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		sOut += "\n<!DOCTYPE hibernate-mapping PUBLIC \"-//Hibernate/Hibernate Mapping DTD 3.0//EN\" \"http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd\">";
		sOut += "\n<hibernate-mapping>";
		sOut += "\n\t<class name=\"au.com." + sClassName + "VO\" table=\"" + sClassNameUnderscore.toLowerCase() + "_t\">";
		sOut += "\n\t\t<id name=\"id\" column=\"id\" />";
		for(var i = 0; i < adatafield.length; i++){
			var row = adatafield[i];
			sOut += "\n\t\t<property name=\"" + row.name + "\" column=\"" + row.dbColumn + "\"/>";
		}
		sOut += "\n\t</class>";
		sOut += "\n</hibernate-mapping>";

	}
	if(sOut.length == 0){
		sOut = "No templates selected.";
	}
	f.txaOut.value = sOut;
}

//name="txtDobj_setting_intAsInteger" onchange="doOnChangeTxtDobjSetting()"

var g_asTxtDobjFieldsCookieName = "txtDobjChecked";
var g_asTxtDobjSettingFieldsCookieName = "txtDobjSettingChecked";

var g_asTxtDobjFields = new Array("createJavaStrutsForm", "createJavaVO"
	, "createSqlSelect", "createSqlInsert", "createSqlCreateTable"
	, "createHtmlForm", "createChampionBean"
	, "createHibernateMapping");
var g_asTxtDobjSettingFields = new Array("intAsInteger");

function doOnChangeTxtDobj(){
	var sOffOn = "";
	for(var i = 0; i < g_asTxtDobjFields.length; i++){
		if(i != 0){
			sOffOn += ",";
		}
		sOffOn += ((document.forms[0]["txtDobj_" + g_asTxtDobjFields[i]].checked) ? "Y" : "N");
	}
	setCookie(g_asTxtDobjFieldsCookieName, sOffOn);
}

function doOnChangeTxtDobjSetting(){
	var sOffOn = "";
	for(var i = 0; i < g_asTxtDobjSettingFields.length; i++){
		if(i != 0){
			sOffOn += ",";
		}
		sOffOn += ((document.forms[0]["txtDobj_setting_" + g_asTxtDobjSettingFields[i]].checked) ? "Y" : "N");
	}
	setCookie(g_asTxtDobjSettingFieldsCookieName, sOffOn);
}

function resumeCheckedTxtDobj(){
	var sOffOn = getCookie(g_asTxtDobjFieldsCookieName);
	var asOffOn = sOffOn.split(",");
	for(var i = 0; i < g_asTxtDobjFields.length; i++){
		//a lert(document.forms[0]["txtDobj_" + g_asTxtDobjFields[i]].checked);
		document.forms[0]["txtDobj_" + g_asTxtDobjFields[i]].checked = (asOffOn[i] == "Y");
	}
	//a lert(sOffOn);
}

function resumeCheckedTxtDobjSetting(){
	var sOffOn = getCookie(g_asTxtDobjSettingFieldsCookieName);
	var asOffOn = sOffOn.split(",");
	for(var i = 0; i < g_asTxtDobjSettingFields.length; i++){
		document.forms[0]["txtDobj_setting_" + g_asTxtDobjSettingFields[i]].checked = (asOffOn[i] == "Y");
	}
}

function DataField(sIn){
	var aRaw = (sIn.split("\r").join("").split("\n").join("") + "$$$$$").split("$");
	this.dbColumn = aRaw[0];
	this.type = aRaw[1];

	this.minLength = 0;
	var sMinLength = aRaw[2];
	if(sMinLength.length > 0){
		sMinLength = (sMinLength + ",").split(",")[0];
		this.minLength = parseInt(sMinLength);
	}

	this.maxLength = 500;
	var sMaxLength = aRaw[2];
	if(sMaxLength.length > 0){
		sMaxLength = (sMaxLength + ",").split(",")[0];
		this.maxLength = parseInt(sMaxLength);
	}

	this.defaultValue = "\"\"";
	if(this.type.toLowerCase() == "string"){
		this.type = "String";
	} else if(this.type == "int"){
		this.defaultValue = "0";
	} else if(this.type == "Integer"){
		this.defaultValue = "new Integer(0)";
	} else if(this.type == "byte"){
		this.defaultValue = "0";
	} else if(this.type == "short"){
		this.defaultValue = "0";
	} else if(this.type == "boolean"){
		this.defaultValue = "false";
	} else if(this.type.toLowerCase() == "date"){
		this.type = "java.util.Date";
		this.defaultValue = "new java.util.Date()";
	} else if(this.type.toLowerCase() == "timestamp"){
		this.type = "java.util.Date";
		this.defaultValue = "new java.util.Date()";
	} else {
		this.defaultValue = "new " + this.type + "()";
	}
	this.name = getAsInnerCaps(this.dbColumn);
	this.description = aRaw[6];
	if(this.description == ""){
		this.description = toLeadUpperCase(this.dbColumn.split("_").join(" "));
	}
}
var isDataGridOpen = false;
var atablecols = new Array();
function convertTextToClassVarArray(sFields){
	atablecols = new Array();
	var asFields = sFields.split("\n");
	//asFields[asFields.length] = "$$0$0$$$$$";
	for(var iF = 0; iF < asFields.length; iF++) {
		if(asFields[iF].indexOf("$") == -1){
			continue;
		}
		asVals = (asFields[iF] + "$$$$$$$").split("$");
		var iLenMax = safeGetInt(asVals[2], -1);
		var sLenMax = ((iLenMax == -1) ? "" : "" + iLenMax);
		var iLenMin = safeGetInt(asVals[3], -1);
		var sLenMin = ((iLenMin == -1) ? "" : "" + iLenMin);
		atablecols[atablecols.length] = new TableRow(asVals[0], asVals[1], sLenMax, sLenMin, asVals[4], asVals[5], asVals[6]);
	}
}

function showHideDataGrid(){
	var dg = document.getElementById("dataGrid");
	var sTd = "</td><td>";
	var sOut = "<table cellpadding=\"0\" cellpadding=\"0\" border=\"0\">";
	sOut += "<tr><td>Name" + sTd + "Type" + sTd + "Max" + sTd + "Min" + sTd + "Default <div class=\"txt-small\" style=\"color:#888D8C;\">sysdate</div>" + sTd + "Relation" + sTd + "Description" + sTd + "Move" + sTd + "Status" + "</td></tr>";
	dg.innerHTML = sOut;
	isDataGridOpen = !isDataGridOpen;
	convertTextToClassVarArray(getTextAreaValue("txaIn"));
	//asFields[asFields.length] = "$$0$0$$$$$";
	var asF = new Array("<input type=\"text\" name=\"clsMemVar_", "\" value=\"", "\" class=\"", "\" tabindex=\"", "\">");
	var iTabIndex = 1;
	for(var iF = 0; iF < atablecols.length; iF++) {
		var cv = atablecols[iF];
		sOut += "<tr><td>";
		sOut += asF[0] + iF + "_name" + asF[1] + cv.name + asF[2] + "thinBorder\" maxlength=\"32\" onblur=\"guessOtherValues(this)" + asF[3] + (iTabIndex++) + asF[4];
		sOut += sTd;
		sOut += getAsSelect("clsMemVar_" + iF + "_type", cv.type, g_asDataTypes, (iTabIndex++));
		sOut += sTd;
		sOut += asF[0] + iF + "_lenMax" + asF[1] + cv.lenMax + asF[2] + "inputNarrow thinBorder" + asF[3] + (iTabIndex++) + asF[4];
		sOut += sTd;
		sOut += asF[0] + iF + "_lenMin" + asF[1] + cv.lenMin + asF[2] + "inputNarrow thinBorder" + asF[3] + (iTabIndex++) + asF[4];
		sOut += sTd;
		sOut += asF[0] + iF + "_defaultValue" + asF[1] + cv.defaultValue + asF[2] + "inputMedium thinBorder" + asF[3] + (iTabIndex++) + asF[4];
		sOut += sTd;
		sOut += getAsSelect("clsMemVar_" + iF + "_relation", cv.relation, g_asRelationTypes, (iTabIndex++));
		sOut += sTd;
		sOut += asF[0] + iF + "_description" + asF[1] + cv.getDescription() + asF[2] + "thinBorder" + asF[3] + (iTabIndex++) + asF[4];
		sOut += sTd;
		if(iF != 0){
			sOut += "<input type=\"button\" onclick=\"moveField(" + iF + ", -1)\" value=\"Up\" class=\"button-default\" style=\"width:40px;\">";
		} else {
			sOut += "<input type=\"button\" value=\"Up\" class=\"button-default\" style=\"color:#C8CDBC; width:40px;\">";
		}
		if(iF < (atablecols.length - 1)){
			sOut += "<input type=\"button\" onclick=\"moveField(" + iF + ", 1)\" value=\"Down\" class=\"button-default\" style=\"width:40px;\">";
		} else {
			sOut += "<input type=\"button\" value=\"Down\" class=\"button-default\" style=\"color:#C8CDBC; width:40px;\">";
		}
		sOut += sTd;
		sOut += "<span id=\"fieldStatus" + iF + "\"></span><br/>";
		sOut += "</td></tr>";
	}
	sOut += "</table>";
	sOut += "<input type=\"button\" class=\"button-default\" onclick=\"newDataObjectField();\" value=\"New Field\">";
	sOut += "<input type=\"button\" class=\"button-default\" onclick=\"showDataGridValuesAsLines();\" value=\"To Text\">";
	sOut += "<input type=\"button\" class=\"button-default\" onclick=\"serializeDataObject();\" value=\"Serialize\">";
	dg.innerHTML = sOut;
}

function convertDataGridToValues(){
	var sOut = "";
	var sLastIx = "-1";
	var aelementsAll = document.forms[0].elements;
	var asOut = new Array();
	for(var iE = 0; iE < aelementsAll.length; iE++){
		var elemTemp = aelementsAll[iE];
		if(elemTemp.name.indexOf("clsMemVar_") == 0){
			var as = elemTemp.name.split("_");
			if(as[1] != sLastIx){
				sOut += ((sOut.length > 0) ? "\n" : "");
				sLastIx = as[1];
			} else {
				if(document.forms[0]["clsMemVar_" + as[1] + "_name"].value != ""){
					sOut += "$";
				}
			}
			if(document.forms[0]["clsMemVar_" + as[1] + "_name"].value != ""){
				sOut += elemTemp.value + "";
			}
			//sOut += elemTemp.name + "\n";
		}
	}
	return sOut;
}

function showDataGridValuesAsLines(){
	setTextAreaValue("txaIn", convertDataGridToValues());
}

function TableRow(sName, sType, iLenMax, iLenMin, sDefaultValue, sRelation, sDescription){
	this.name = sName;
	this.type = sType;
	this.lenMax = iLenMax;
	this.lenMin = iLenMin;
	this.defaultValue = sDefaultValue;
	this.relation = sRelation;
	this.description = sDescription;
	this.computeDefaultValue = function(){
		for(var i = 0; i < g_asDataTypes.length; i++) {
			if (this.type == g_asDataTypes[i]) {
				this.defaultValue = g_asDataTypeDefaults[i];
				return this.defaultValue;
			}
		}
		return "";
	};
	this.getDescription = function(){
		if(this.description != ""){
			return this.description;
		}
		var sOut = "";
		if(this.name == ""){
			return "";
		}
		sOut += toLeadUpperCase(this.name.toLowerCase()).split("_").join(" ");
		var sClassNameTemp = document.forms[0].txtDobj_className.value.split("_").join(" ");
		var sTableNameTemp = document.forms[0].txtDobj_tableName.value.split("_").join(" ");
		if(sTableNameTemp != ""){
			sOut += " for a " + sTableNameTemp;
		}
		return sOut;
	}
	this.toString = function(){
		return "TableRow[name:" + this.name
		+ "][type:" + this.type
		+ "][lenMax:" + this.lenMax
		+ "][lenMin:" + this.lenMin + "]";
	}
}

function getAsSelect(sFieldName, sType, asTypes, iTabIndex){
	var sOut = "<select name=\"" + sFieldName + "\" class=\"thinBorder\" tabindex=\"" + iTabIndex + "\">";
	for(var iOpt = 0; iOpt < asTypes.length; iOpt++) {
		sOut += "<option value=\"" + ((asTypes[iOpt] == "-") ? "" : asTypes[iOpt]) + "\"" + ((sType == asTypes[iOpt]) ? " selected" : "") + ">" + asTypes[iOpt] + "</option>";
	}
	sOut += "</select>";
	return sOut;
}

function setClassNameSelect(){
	var selTrg = document.forms[0].txtDobj_classNameSelect;
	//selTrg.options[selTrg.options.length] = new Option("New Class", "new");
	for(var iD = 0; iD < aserializedClassDefs.length; iD++){
		selTrg.options[selTrg.options.length] = new Option(aserializedClassDefs[iD].name, iD);
	}
}

function doOnChangeDobjClassNameSelect(selTrg){
	var sTableNameTempNew = "";
	//if((selTrg[selTrg.selectedIndex].value != "") && confirm("Overwrite existing fields?")){
	if(selTrg[selTrg.selectedIndex].value != ""){
		/*
		if(false && selTrg.value == "0"){
			while(sTableNameTempNew == ""){
				var sTableNameTempNew = prompt("Please name the class", "");
				if(sTableNameTempNew == null){
					return;
				}
			}
			var iIx = parseInt(selTrg[selTrg.selectedIndex].value);
			selTrg.selectedIndex = 0;
		} else {
		*/
		var iIx = parseInt(selTrg[selTrg.selectedIndex].value);
		sTableNameTempNew = aserializedClassDefs[iIx].name;
		/*}*/
		document.forms[0].txtDobj_projectName.value = aserializedClassDefs[iIx].project;
		document.forms[0].txtDobj_className.value = toLeadUpperCase(getAsInnerCaps(sTableNameTempNew));
		document.forms[0].txtDobj_tableName.value = sTableNameTempNew;
		setTextAreaValue("txaIn", aserializedClassDefs[iIx].fields.split("#").join("\n"));
		showHideDataGrid();
	}
}

function serializeDataObject(){
	var sProjectNameTempCurr = document.forms[0].txtDobj_projectName.value;
	var sTableNameTempCurr = document.forms[0].txtDobj_tableName.value;
	while(sTableNameTempCurr == ""){
		var sTableNameTempCurr = prompt("Please name the class", "");
		if(sTableNameTempCurr == null){
			return;
		}
	}
	setTextAreaValue("txaOut", "addClassDef(\"" + sProjectNameTempCurr + "#" + sTableNameTempCurr + "#" + trimReturns(convertDataGridToValues()).split("\n").join("#") + "\");");
	document.forms[0].txaOut.focus();
	document.forms[0].txaOut.select();
}

function moveField(iPos, iDirection){
	var iNewPos = (iPos + iDirection);
	var sNamePassive = document.forms[0]["clsMemVar_" + iNewPos + "_name"].value;
	var sTypePassive = document.forms[0]["clsMemVar_" + iNewPos + "_type"].value;
	var sLenMaxPassive = document.forms[0]["clsMemVar_" + iNewPos + "_lenMax"].value;
	var sLenMinPassive = document.forms[0]["clsMemVar_" + iNewPos + "_lenMin"].value;
	var sDefaultValuePassive = document.forms[0]["clsMemVar_" + iNewPos + "_defaultValue"].value;
	var sRelationPassive = document.forms[0]["clsMemVar_" + iNewPos + "_relation"].value;
	var sDescriptionPassive = document.forms[0]["clsMemVar_" + iNewPos + "_description"].value;

	document.forms[0]["clsMemVar_" + iNewPos + "_name"].value = document.forms[0]["clsMemVar_" + iPos + "_name"].value;
	document.forms[0]["clsMemVar_" + iNewPos + "_type"].value = document.forms[0]["clsMemVar_" + iPos + "_type"].value;
	document.forms[0]["clsMemVar_" + iNewPos + "_lenMax"].value = document.forms[0]["clsMemVar_" + iPos + "_lenMax"].value;
	document.forms[0]["clsMemVar_" + iNewPos + "_lenMin"].value = document.forms[0]["clsMemVar_" + iPos + "_lenMin"].value;
	document.forms[0]["clsMemVar_" + iNewPos + "_defaultValue"].value = document.forms[0]["clsMemVar_" + iPos + "_defaultValue"].value;
	document.forms[0]["clsMemVar_" + iNewPos + "_relation"].value = document.forms[0]["clsMemVar_" + iPos + "_relation"].value;
	document.forms[0]["clsMemVar_" + iNewPos + "_description"].value = document.forms[0]["clsMemVar_" + iPos + "_description"].value;

	document.forms[0]["clsMemVar_" + iPos + "_name"].value = sNamePassive;
	document.forms[0]["clsMemVar_" + iPos + "_type"].value = sTypePassive;
	document.forms[0]["clsMemVar_" + iPos + "_lenMax"].value = sLenMaxPassive;
	document.forms[0]["clsMemVar_" + iPos + "_lenMin"].value = sLenMinPassive;
	document.forms[0]["clsMemVar_" + iPos + "_defaultValue"].value = sDefaultValuePassive;
	document.forms[0]["clsMemVar_" + iPos + "_relation"].value = sRelationPassive;
	document.forms[0]["clsMemVar_" + iPos + "_description"].value = sDescriptionPassive;

	document.forms[0]["clsMemVar_" + iNewPos + "_name"].select();
}

function newDataObjectField(){
	showDataGridValuesAsLines();
	setTextAreaValue("txaIn", getTextAreaValue("txaIn") + "\n$$$$$$$$");
	showHideDataGrid();
	try {
		document.forms[0]["clsMemVar_" + (atablecols.length - 1) + "_name"].select();
	} catch (e){}
}

function guessOtherValues(srcField){
	var sFieldValue = srcField.value.split(" ").join("_").toLowerCase();
	if(sFieldValue != srcField.value){
		srcField.value = sFieldValue;
	}
	var asFieldName = srcField.name.split("_");
	var sFieldBaseName = asFieldName[0] + "_" + asFieldName[1] + "_";
	var sSuggestedLenMax = "32";
	var sSuggestedLenMin = "0";
	var txtTypeTrg = document.forms[0][sFieldBaseName + "type"];
	var iFieldNameLength = srcField.value.length;
	if(iFieldNameLength > 32){
		document.getElementById("fieldStatus" + asFieldName[1]).innerHTML = "Name too long (" + iFieldNameLength + " chars)";
	}
	if(endsWith(sFieldValue, "_id")){
		if(txtTypeTrg.value == ""){
			txtTypeTrg.value = "int";
		}
		sSuggestedLenMax = "32";
		sSuggestedLenMin = "1";
	} else if (sFieldValue.indexOf("name") != -1){
		if(txtTypeTrg.value == ""){
			txtTypeTrg.value = "String";
		}
		sSuggestedLenMax = "50";
	} else if ((sFieldValue.indexOf("description") != -1) || (sFieldValue.indexOf("comment") != -1)){
		if(txtTypeTrg.value == ""){
			txtTypeTrg.value = "String";
		}
		sSuggestedLenMax = "500";
	} else if (sFieldValue.indexOf("date") != -1){
		if(txtTypeTrg.value == ""){
			txtTypeTrg.value = "Date";
		}
		sSuggestedLenMax = "2000";
	} else if ((sFieldValue.indexOf("stamp") != -1) || (sFieldValue.indexOf("dtime") != -1)){
		if(txtTypeTrg.value == ""){
			txtTypeTrg.value = "Timestamp";
		}
		sSuggestedLenMax = "2000";
	} else if (sFieldValue.indexOf("email") != -1){
		if(txtTypeTrg.value == ""){
			txtTypeTrg.value = "Email";
		}
		sSuggestedLenMax = "80";
	} else if (sFieldValue.indexOf("password") != -1){
		if(txtTypeTrg.value == ""){
			txtTypeTrg.value = "Password";
		}
		sSuggestedLenMax = "30";
	} else if (sFieldValue.indexOf("is") == 0){
		if(txtTypeTrg.value == ""){
			txtTypeTrg.value = "boolean";
		}
		sSuggestedLenMax = "1";
	}
	if(document.forms[0][sFieldBaseName + "defaultValue"].value == ""){
		if(txtTypeTrg.value == "boolean"){
			document.forms[0][sFieldBaseName + "defaultValue"].value = "false";
		}
	}
	if(document.forms[0][sFieldBaseName + "relation"].value == "" ){
		if(sFieldValue == "id"){
			document.forms[0][sFieldBaseName + "relation"].value = "key";
		} else if(endsWith(sFieldValue, "_id")){
			document.forms[0][sFieldBaseName + "relation"].value = "fkey";
		}
	}
	if(document.forms[0][sFieldBaseName + "description"].value == "" ){
		var f = new TableRow(sFieldValue, "", 0, 0, "");
		document.forms[0][sFieldBaseName + "description"].value = f.getDescription();
	}
	if(document.forms[0][sFieldBaseName + "lenMax"].value == "" ){
		document.forms[0][sFieldBaseName + "lenMax"].value = sSuggestedLenMax;
	}
	if(document.forms[0][sFieldBaseName + "lenMin"].value == "" ){
		document.forms[0][sFieldBaseName + "lenMin"].value = sSuggestedLenMin;
	}
}

function formatAsClassName(txtSrc){
	var sValue = txtSrc.value;
	//txtSrc.value = getAsInnerCaps(txtSrc.value.split(" ").join("_"));
	if(document.forms[0].txtDobj_tableName.value == ""){
		document.forms[0].txtDobj_tableName.value = getAsUnderscore(txtSrc.value).split(" ").join("_");
	}
}

function formatAsTableName(txtSrc){
	var sValue = txtSrc.value;
	var txtClass = document.forms[0].txtDobj_className
	if(txtClass.value == ""){
		txtClass.value = toLeadUpperCase(getAsInnerCaps(txtSrc.value.split(" ").join("_")));
	}
	txtSrc.value = getAsUnderscore(txtSrc.value).split(" ").join("_");
}
