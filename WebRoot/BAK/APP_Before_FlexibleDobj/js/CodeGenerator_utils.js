function setTextAreaValue(sFieldName, sValue){
	g_form[sFieldName].value = sValue;
}
function getRadioValue(sFieldName){
	var radSrc = document.forms[0][sFieldName];
	for(var iRC = 0; iRC < radSrc.length; iRC++){
		if(radSrc[iRC].checked){
			return radSrc[iRC].value;
		}
	}
	return "";
}

/**
 * Return an array of all the matches to the command, getting the settings contained in them.
 * For example $SECTION{one,two}...$SECTION{} will return [[one,two],[]]
 */
function getTextInsideMarkers(sSuper, sMarkerStart, sMarkerEnd) {
	if(sSuper.indexOf(sMarkerStart) == -1) {
		return (new Array(sSuper)); // Find string not found.
	}
	if(sMarkerStart.length == 0) {
		return (new Array(sSuper)); // Find string not found.
	}
	if(sMarkerEnd.length == 0) {
		return (new Array(sSuper)); // Find string not found.
	}
	var sOut = "";
	var iPosStart = sSuper.indexOf(sMarkerStart);
	var iPosEnd = sSuper.indexOf(sMarkerEnd, iPosStart + sMarkerStart.length);
	var iBrake = 0;
	var iFound = 0;
	var asOut = new Array();
	while(iPosStart != -1) {
		asOut[asOut.length] = sSuper.substring(iPosStart + sMarkerStart.length, iPosEnd);
		iPosStart = sSuper.indexOf(sMarkerStart, iPosEnd);
		iPosEnd = sSuper.indexOf(sMarkerEnd, iPosStart + sMarkerStart.length);
	}
	return asOut;
}

/**
 * Return an array of all the matches to the command, getting the settings contained in them.
 * For example $SECTION{one,two}...$SECTION{} will return [[one,two],[]]
 */
function getTextOutsideMarkers(sSuper, sMarkerStart, sMarkerEnd) {
	if(sMarkerStart.length == 0) {
		return (new Array(sSuper)); // Find string not found.
	}
	if(sMarkerEnd.length == 0) {
		return (new Array(sSuper)); // Find string not found.
	}
	if((sSuper.indexOf(sMarkerStart) == -1) || (sSuper.indexOf(sMarkerEnd) == -1)) {
		return (new Array(sSuper)); // Start and end strings not found.
	}
	var sOut = "";
	var iPosStart = 0;
	var iPosEnd = sSuper.indexOf(sMarkerStart);
	var iBrake = 0;
	var iFound = 0;
	var asOut = new Array();
	while(iPosEnd != -1) {
		asOut[asOut.length] = sSuper.substring(iPosStart, iPosEnd);
		iPosStart = sSuper.indexOf(sMarkerEnd, iPosEnd) + sMarkerEnd.length;
		iPosEnd = sSuper.indexOf(sMarkerStart, iPosStart);
	}
	asOut[asOut.length] = sSuper.substring(iPosStart);
	return asOut;
}
