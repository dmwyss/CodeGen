
var g_sSystemFields = "UPDATE_COUNT,UPDATE_USER_ID,UPDATE_DATETIME";
var g_asReplacableWords = new Array(
	"desc,description", "dest,destination", "ncs,NCS", "num,number"
	,"filename,file-name", "filepath,file-path"
	);
var g_sTableName = "INSTRUCTION_FILE";

newField("WC1", "FILE_REFERENCE",	"VARCHAR2",	16,	0,	true,	true);
newField("WC2", "SOURCE_FILENAME", 	"VARCHAR2",	32,	0,	false,	false);
newField("WC3", "SOURCE_FILE_SIZE", 	"NUMBER",	8,	0,	false,	false);
newField("WC4", "FILE_TYPE", 		"VARCHAR2",	32,	0,	false,	false);
newField("WC5", "FILE_CONTENT", 	"BLOB",		4000,	0,	false,	false);
newField("WC6", "INT_PARTY_ID", 	"VARCHAR2",	16,	0,	false,	false);
newField("WC7", "UPLOAD_USER_ID", 	"VARCHAR2",	12,	0,	false,	false);
newField("WC8", "UPLOAD_DATETIME", 	"DATE",		7,	0,	false,	false);
newField("WC9", "TOTAL_INSTRUCTIONS", 	"NUMBER",	8,	0,	false,	false);
newField("WC10", "DEST_FILENAME", 	"VARCHAR2",	32,	0,	false,	false);
newField("WC11", "DEST_FILEPATH", 	"VARCHAR2",	255,	0,	false,	false);
newField("WC12", "UPDATE_COUNT", 	"NUMBER",	11,	0,	false,	false);
newField("WC13", "CURRENT_STATUS_DESC", "VARCHAR2",	255,	0,	false,	false);
newField("WC14", "CURRENT_STATUS_CODE", "VARCHAR2",	3,	0,	false,	false);
newField("WC15", "NCS_STATUS_REASON", 	"VARCHAR2",	255,	0,	false,	false);
newField("WC16", "UPDATE_USER_ID", 	"VARCHAR2",	8,	0,	false,	false);
newField("WC17", "UPDATE_DATETIME", 	"DATE",		7,	0,	false,	false);
newField("WC18", "FILE_SUB_TYPE", 	"VARCHAR2",	32,	0,	false,	false);
newField("WC19", "HASH_VALUE", 		"VARCHAR2",	64,	0,	false,	false);
newField("WC20", "NUM_AUTH_REQ", 	"NUMBER",	2,	0,	false,	false);

