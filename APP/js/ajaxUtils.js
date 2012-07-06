
/* NOTE: you need to create a method called processXmlDoc(xmlDoc); */

var httpxmlRequest;

/*
Sample of submission...
function doSubmit(){
    httpxmlRequest = createXMLHttpRequest();
    var sXmlUrl = g_sBaseLocation + "playerPriceAdminData.jsp";
    startRequestPost(httpxmlRequest, sXmlUrl, handleStateChangeAjaxCall, serialize("taRawData"));
}

 * You also need to create a method called processXmlDoc(xmlDoc).
 * The following example converts an XML document to a JSON Object.
 * Using the Java Class: cms.util.HttpUtils.valueObjectToXml you will
 * receive a series of fields. For example
 * 		<?xml version="1.0" encoding="ISO-8859-1"?>
 * 		<valueObject objectType="Person" status="0" statusMessage="Saved OK">
 * 			<field name="firstName" dataType="String">ValueOne</field>
 * 		</valueObject>
function processXmlDoc(xmlDoc){
	var objOut = new Object();
    var nodliRoot = xmlDoc.getElementsByTagName("valueObject");
    objOut.objectType = nodliRoot[0].getAttribute("objectType");
    objOut.status = nodliRoot[0].getAttribute("status");
	objOut.statusMessage = nodliRoot[0].getAttribute("statusMessage");

    var sOut = "";
    var nodliFields = nodliRoot[0].getElementsByTagName("field");
    for(var iR = 0; iR < nodliFields.length; iR++){
        var nodliDatabaseDataTop = nodliFields[iR];
        var sFieldName = nodliDatabaseDataTop.getAttribute("name");
        var sFieldDataType = nodliDatabaseDataTop.getAttribute("dataType");
        var sFieldValue = nodliDatabaseDataTop.childNodes[0].nodeValue;
        sOut += "\n" + sFieldName + "|" + sFieldDataType + "=" + sFieldValue;
        objOut[sFieldName] = (sFieldDataType == "int") ? parseInt(sFieldValue) : sFieldValue;
    }
    
    var selTrg = document.forms[0].agencyId;
	selTrg.options[selTrg.options.length] = new Option(objOut.agencyName, objOut.agencyId);
	selTrg.selectedIndex = (selTrg.options.length - 1);

    alert(sOut);
}
*/

/*
 * Convert a field into a serialized string.
 */
function serialize(sFieldName, sValue){
	var sOut = sFieldName + "=" + escape(sValue);
	return sOut;
}

/*
 * Convert a field into a serialized string.
 */
function cleanIllegalChars(sTextToClean){
	return sTextToClean.split("\\").join("");
}

 /*
  * Convert a field into a serialized string.
  */
 function serializeField(sFieldName){
	 return serialize(sFieldName, document.forms[0][sFieldName].value);
 }
 
/*
 * Call made when AJAX call returns.
 * NOTE: you need to create a method called processXmlDoc(xmlDoc);
 */
function handleStateChangeAjaxCall() {
    if(httpxmlRequest.readyState == 4) {
        if(httpxmlRequest.status == 200) {
            var xmlDocTemp = httpxmlRequest.responseXML;
            processXmlDoc(xmlDocTemp);
        } else if(httpxmlRequest.status == 0) {
        	//alert("HttpXmlRequest.status: " + httpxmlRequest.status + "\n\n" + httpxmlRequest.responseXML);
        	var xmlDocTemp = httpxmlRequest.responseXML;
        	processXmlDoc(xmlDocTemp);
        }
    }
}

/**
 * Create an XML Request object. This works for all browsers.
 * @return Object as conduit to server, in form of an ActiveXObject or an XMLHttpRequest.
 */
function createXMLHttpRequest() {
    var xmlHttpOut;
    if (window.ActiveXObject) {
        xmlHttpOut = new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xmlHttpOut = new XMLHttpRequest();
    }
    return xmlHttpOut;
}

/**
* Begin the call process to retrive XML.
* This includes setting up for when the XML is returned.
* @param xmlHttpTemp XML Loading object, different in IE and FireFox etc.
* @param sXmlUrl URL of the XML object.
* @param functionToHandleStateChange Name of the method to call when the state changes.
*/
function startRequest(xmlHttpTemp, sXmlUrl, functionToHandleStateChange) {
	xmlHttpTemp.onreadystatechange = functionToHandleStateChange;
	xmlHttpTemp.open("GET", sXmlUrl, true);
	xmlHttpTemp.send(null);
}

/*
 * Begin the call process to post data and return results XML.
 * @param xmlHttpTemp XML Loading object, different in IE and FireFox etc.
 * @param sXmlUrl URL of the XML object.
 * @param functionToHandleStateChange Name of the method to call when the state changes.
 * @param sParams URI format String, eg "username=Joe%20Bloggs&age=20".
 */
function startRequestPost(xmlHttpTemp, sXmlUrl, functionToHandleStateChange, sParams) {
    xmlHttpTemp.onreadystatechange = functionToHandleStateChange;
    xmlHttpTemp.open("POST", sXmlUrl, true);
    xmlHttpTemp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttpTemp.setRequestHeader("Content-length", sParams.length);
    xmlHttpTemp.setRequestHeader("Connection", "close");
    xmlHttpTemp.send(sParams);
}
 
function getAttributeSafe(nodeSrc, sAttributeName){
	if(nodeSrc == null){
		return "";
	}
	var sOut = nodeSrc.getAttribute(sAttributeName);
	if(sOut == null){
		return "";
	}
	return sOut;
}

