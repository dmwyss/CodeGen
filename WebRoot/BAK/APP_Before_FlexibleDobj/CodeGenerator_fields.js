function newField(sId, sFieldName, sFieldType, iLength, iLengthAfterPoint, isMandatory, isKey) {
	var fldNew = new Field(sId, sFieldName, sFieldType, iLength, iLengthAfterPoint, isMandatory, isKey);
	g_afld[g_afld.length] = fldNew;
}
function Field(sId, sFieldName, sFieldType, iLength, iLengthAfterPoint, isMandatory, isKey) {
	this.id = sId;
	this.name = sFieldName;
	this.nameInnerCaps = getAsInnerCaps(sFieldName);
	this.type = sFieldType;
	this.javaType = "String";
	if(sFieldType == "NUMBER"){
		this.javaType = "Integer";
	} else if(sFieldType == "DATE"){
		this.javaType = "java.sql.Date";
	} else if((sFieldType == "BLOB") || (sFieldType == "CLOB")){
		this.javaType = "byte[]";
	}
	this.length = iLength;
	this.lengthAfterPoint = iLengthAfterPoint;
	this.isMandatory = isMandatory;
	this.isKey = isKey;
	this.isSystemField = (g_sSystemFields.indexOf(sFieldName) != -1);
}

