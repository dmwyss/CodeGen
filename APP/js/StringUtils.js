function getCleanedUpLine(sIn){
	return getOnlyInQuotes(removeIfCommented(removeMarkup(sIn)))
}
function removeMarkup(sIn){
	sIn = replaceSubstring(sIn, "\\n", "");
	//a lert("remoMark " + sIn);
	return sIn;
}
function getOnlyInQuotes(sIn){
	var asString = sIn.split("\"");
	if(asString.length > 2){
		return asString[1] + "\n";
	}
	return "";
}
function removeIfCommented(sIn){
	//sIn = ;
	var sStripped = removeWhiteSpaceFromFront(sIn);
	if(sStripped.substring(0,2) == "//"){
		return "";
	}
	return sStripped;
}
function removeWhiteSpaceFromFront(sIn){
	while((sIn.charAt(0) == " ") || (sIn.charAt(0) == "\t")){
		sIn = sIn.substring(1);
	}
	return sIn;
}

function removeWhiteSpaceFromEnd(sIn){
	while((sIn.charAt(sIn.length) == " ") || (sIn.charAt(sIn.length) == "\t")){
		sIn = sIn.substring(0, sIn.length - 1);
	}
	return sIn;
}

function trim(sIn){
	sIn = removeWhiteSpaceFromFront(removeWhiteSpaceFromEnd(sIn));
	while(sIn.indexOf("  ") != -1){
		sIn = replaceSubstring(removeWhiteSpaceFromFront(removeWhiteSpaceFromEnd(sIn)), "  ", " ");
	}
	return sIn;
}
var g_iReplaceSubstringCounter = 0;
function replaceSubstring(sSuper, sFind, sReplace) {
	//a lert("look into " + sSuper);
	if(sSuper.indexOf(sFind) == -1) {
		return sSuper; // Find string not found.
	}
	if(sFind.length == 0) {
		return sSuper; // Find string not found.
	}
	//var isMultipleIterations = true;
	if(sReplace.indexOf(sFind) != -1) {
		//return sSuper; // Replace string found in find string.
		//isMultipleIterations = false;
	}
	var sOut = "";
	var iPos = 0;
	var iPosEnd = sSuper.indexOf(sFind);
	var iBrake = 0;
	var iFound = 0;
	while(iPosEnd != -1) {
		sOut += sSuper.substring(iPos, iPosEnd) + sReplace;
		iPos = iPosEnd + sFind.length;
		//if(isMultipleIterations){
			iPosEnd = sSuper.indexOf(sFind, iPos);
		//} else {
		//	iPosEnd = -1;
		//}
		g_iReplaceSubstringCounter++;
	}
	sOut += sSuper.substring(iPos);
	return sOut;
}

function recursiveReplaceSubstring(sSuper, sFind, sReplace){
	sOut = sSuper;
	while(sOut.indexOf(sFind) != -1){
		var sOut = replaceSubstring(sOut, sFind, sReplace);
	}
	return sOut;
}

/*
 * Remove line returns and new-lines from the start and end of a string.
 */
function trimReturns(sIn){
	var iBrake = 0;
	while((iBrake++ < 100) && (sIn.length > 0) && ("\r\n".indexOf(sIn.charAt(0)) != -1)){
		//a lert("removing [" + sIn.charAt(0) + "] (" + sIn.length + ") (" + iBrake + ")");
		sIn = sIn.substring(1);
	}
	while((iBrake++ < 100) && (sIn.length > 0) && ("\r\n".indexOf(sIn.charAt(sIn.length - 1)) != -1)){
		//a lert("removing [" + sIn.charAt(sIn.length - 1) + "] (" + sIn.length + ") (" + iBrake + ")");
		sIn = sIn.substring(0, (sIn.length - 1));
	}
	return sIn
}
function cleanLine(sIn){
	if(sIn == ""){
		return "";
	}
	var sCharAtEnd = sIn.charAt(sIn.length - 1);
	var iNumAtEnd = sCharAtEnd.charCodeAt();
	if((iNumAtEnd == 13) || (sCharAtEnd == "\r")){
		sIn = sIn.substring(0, sIn.length - 1);
	}
	return sIn;
}
function getCase(sIn){
	var iUp = 0;
	var iLow = 0;
	for(var iC = 0; iC < sIn.length; iC++){
		var cTemp = sIn.charAt(iC);
		if(cTemp.toLowerCase() != cTemp){
			iUp++;
		} else if (cTemp.toUpperCase() != cTemp){
			iLow++;
		}
	}
	//a lert("up " + iUp + " low" + iLow);
	if(iUp >= iLow){
		return "UPPER";
	} else {
		return "LOWER";
	}
}

function toLeadUpperCase(sIn){
	return sIn.substring(0,1).toUpperCase() + sIn.substring(1);
}

function getAsInnerCaps(sIn){
	sIn = sIn.toLowerCase();
	sOut = "";
	//var isPreviousUnderscore = false;
	for(var iC = 0; iC < sIn.length; iC++){
		var c = sIn.charAt(iC);
		if(c == "_"){
			//isPreviousUnderscore = true;
			iC++;
			sOut += sIn.charAt(iC).toUpperCase();
		} else {
			sOut += c;
		}
	}
	return sOut;
}

function getAsUnderscore(sIn){
	sOut = "";
	var isPreviousUnderscore = true;
	for(var iC = 0; iC < sIn.length; iC++){
		var c = sIn.charAt(iC);
		var i = sIn.charCodeAt(iC);
		if((i >= 65) && (i <= 90)){
			if(!isPreviousUnderscore){
				sOut += "_";
			}
			sOut += c.toLowerCase();
			isPreviousUnderscore = true;
		} else {
			sOut += c;
			isPreviousUnderscore = false;
		}
		//sOut += sIn.charCodeAt(iC) + " ";
	}
	return sOut;
}

function trimLines(sIn){
	sIn = replaceSubstring(sIn, "^t", "\t");
	var asIn = sIn.split("\n");
	var sOut = "";
	//var isPreviousUnderscore = true;
	for(var iL = 0; iL < asIn.length; iL++){
		var sLine = trim(asIn[iL]);
		if(sLine.length != 0){
			sOut += sLine + "\n";
		}
	}
	return sOut;
}


function removeBetween(sIn, sStart, sEnd){
	sIn = "/**/" + sIn;
	var asIn = sIn.split(sStart);
	var sOut = "";
/*	var isBeingShown = true;
	for(var iL = 0; iL < asIn.length; iL++){
		//var isHasStartMarker = asIn[iL].indexOf(sStart);
		if(asIn[iL].indexOf(sStart) != -1){
		}
		sOut += sLine + "\n";
	}
*/
	for(var iL = 0; iL < asIn.length; iL++){
		/*
		var iStartPos = Math.min(asIn.length, asIn[iL].indexOf(sEnd));
		var iStartPos = asIn[iL].indexOf(sStart);
		if(iStartPos == -1){
		var iEndPos = Math.max(0, asIn[iL].indexOf(sEnd));
		var iEndPos = Math.max(0, asIn[iL].indexOf(sEnd));
		*/
		var iStartPos = asIn[iL].indexOf(sEnd);
		if(iStartPos == -1){
			sOut += asIn[iL];
		} else {
			sOut += asIn[iL].substring(iStartPos + sEnd.length, asIn[iL].length);
		}
		//sOut += "ccc";
	}
	return sOut;
}

function getAsWords(sIn){
	sIn = sIn.toLowerCase();
	sOut = "";
	for(var iC = 0; iC < sIn.length; iC++){
		var c = sIn.charAt(iC);
		if(c == "_"){
			sOut += " ";
			iC++;
			sOut += sIn.charAt(iC); //.toUpperCase();
		} else {
			sOut += c;
		}
	}
	var asWords = sOut.split(" ");
	for(var iW = 0; iW < asWords.length; iW++){
		for(var iRW = 0; iRW < g_asReplacableWords.length; iRW++){
			var asRWP = g_asReplacableWords[iRW].split(",");
			if(asWords[iW] == asRWP[0]){
				asWords[iW] = asRWP[1];
			}
		}
	}
	return asWords.join(" ");
}

function getFirstCap(sIn){
	if(sIn.length == 0){
		return "";
	}
	sFirst = sIn.substring(0, 1).toUpperCase();
	if(sIn.length == 1){
		return sFirst;
	}
	return sFirst + sIn.substring(1);
}

function endsWith(sSuper, sSub){
	return (sSuper.indexOf(sSub) == (sSuper.length - sSub.length))
}

function removeDuplicates(asMain){
	var sOut = "";
	var sStartDeleteMarker = "###STARTDELETABLE###";
	for(var iLineToFind = 0; iLineToFind < asMain.length; iLineToFind++){
		for(var iLineTemp = (iLineToFind + 1); iLineTemp < asMain.length; iLineTemp++){
			if(asMain[iLineToFind] != asMain[iLineTemp]){
				//asTemp[asTemp.length] = asMain[iLineTemp]
			} else {
				sOut += ("compare \n[" + asMain[iLineToFind] + "]\n[" + asMain[iLineTemp] + "]");
				asMain[iLineTemp] = sStartDeleteMarker + iLineToFind + "###" + iLineTemp;
			}
		}
	}
	var asTemp = new Array();
	for(var iLineToInspectForDeleteMarker = 0; iLineToInspectForDeleteMarker < asMain.length; iLineToInspectForDeleteMarker++){
		if(asMain[iLineToInspectForDeleteMarker].indexOf(sStartDeleteMarker) != 0){
			asTemp[asTemp.length] = asMain[iLineToInspectForDeleteMarker];
		}
	}
	return asTemp;
}

function removeBlanks(asMain){
	var asTemp = new Array();
	for(var iLineToInspect = 0; iLineToInspect < asMain.length; iLineToInspect++){
		if((asMain[iLineToInspect].length != 0) && (asMain[iLineToInspect] != "\n") && (asMain[iLineToInspect] != "\r\n") && (asMain[iLineToInspect] != "\r")){
			asTemp[asTemp.length] = asMain[iLineToInspect];
		}
	}
	return asTemp;
}

