
var g_form;
var g_sHiddenDollar = "*#*";

var isEscapeBackslashes = true;
var asClippy = new Array();
var iClippyCurr = -1;

function runStringGeneration(){
    var sIn = getTextAreaValue("txaIn");
    if((getRadioValue("radType")) != "DeString"){
        sIn = getAsString(sIn);
    } else {
        sIn = getAsText(sIn);
    }
    setTextAreaValue("txaOut", sIn);
    document.forms[0].txaIn.select();
}
// =========================================================================================
function runDeString(){
    var sIn = getTextAreaValue("txaIn");
    sIn = getAsText(sIn);
    setTextAreaValue("txaOut", sIn);
    document.forms[0].txaIn.select();
}
function getAsText(sIn){
    var asIn = sIn.split("\n");
    var sOut = "";
    var iCheck = 0;
    for(var i = 0; i < asIn.length; i++){
        if(asIn[i].length > 0){
            sTemp = getCleanedUpLine(asIn[i]);
            if(sTemp != "\n"){
                sOut += getCleanedUpLine(asIn[i]);
            }
        }
        iCheck++;
    }
    //a lert(iCheck);
    return sOut;
}

// = = = = = = = = = = = = = = = =

// =========================================================================================

function getAsString(sIn){
    var sRadType = getRadioValue("radType");
    //var isString = (sRadType == "String");
    var sVarName = document.forms[0].txtVarName.value;
    //a lert(isString);
    var sOut = "";
    var sLineLeader = "" + sVarName + " += \"";
    var sLineEnd = "\";";
    var sIndents = "";
    var iIndents = parseInt(getTextAreaValue("txtIndentCount"));
    for(var i = 0; i < iIndents; i++){
        sIndents += "\t";
    }
    if(sRadType == "String"){
        sOut += "" + sIndents + "String " + sVarName + " = \"\";";
        sOut += "\n" + sIndents + sLineLeader;
    } else {
        sOut += "" + sIndents + "StringBuffer " + sVarName + " = new StringBuffer();";
        sLineLeader = "" + sVarName + ".append(\"\\n";
        sLineEnd = "\");";
        sOut += "\n" + sIndents + "" + sLineLeader;
    }
    var isAllowLeadingTabs = false;
    for(var iC = 0; iC < sIn.length; iC++){
        var cThis = sIn.charAt(iC);
        if(cThis == "\n"){
            sOut += sLineEnd + "\n" + sIndents + "" + sLineLeader;
        } else if(cThis == "\t"){
            if(isAllowLeadingTabs){
                sOut += "\\t";
            }
        } else if(cThis == "\r"){
            sOut += "";
        } else if(cThis == "\""){
            sOut += "\\" + cThis + "";
        } else if(cThis == "\\"){
            if(isEscapeBackslashes){
                sOut += "\\";
            }
            sOut += "\\";
        } else {
            sOut += cThis;
        }
    }
    sOut += sLineEnd;
    sOut = replaceSubstring(sOut, "/" + "*", "/" + "\" + \"*");
    sOut = replaceSubstring(sOut, "*" + "/", "*" + "\" + \"/");
    return sOut;
}
function runReCapitalize(){
    var sSetting = getRadioValue("radTypeCase");
    var sIn = getTextAreaValue("txaIn");
    var sOut = "";
    if(sSetting == "UpperCase"){
        sOut = getTextAreaValue("txaIn").toUpperCase();
    } else if(sSetting == "LowerCase"){
        sOut = getTextAreaValue("txaIn").toLowerCase();
    } else if(sSetting == "GuessCase"){
        var asOut = getTextAreaValueAsArray("txaIn");
        for(var iP = 0; iP < asOut.length; iP++){
            sOut += ((iP == 0) ? "" : "\n");
            if(getCase(asOut[iP]) == "UPPER"){
                sOut += asOut[iP].toLowerCase();
            } else {
                sOut += asOut[iP].toUpperCase();
            }
        }
    } else if(sSetting == "InnerCaps"){
        sOut = getAsInnerCaps(getTextAreaValue("txaIn"));
    } else if(sSetting == "Underscore"){
        sOut = getAsUnderscore(getTextAreaValue("txaIn"));
    }
    setTextAreaValue("txaOut", sOut);
    document.forms[0].txaIn.select();
}
function runSetsOp(){
    var sSetting = getRadioValue("radSetsOp");
    var isSetsCommasSeparators = (getCheckboxValue("chxIsSetsCommasSeparators") == "yes");
    var isCommaSepOut = (getCheckboxValue("chxIsCommaSepOut") == "yes");
    var isSortSetsOutput = (getCheckboxValue("chxIsSortSetsOutput") == "yes");
    var sOut = sSetting;
    var sInA = getTextAreaValue("txaSetA");
    sInA = sInA.split("\r").join("");
    if(isSetsCommasSeparators){
        sInA = sInA.split(",").join("\n");
    }
    var asInA = removeBlanks(sInA.split("\n"));
    var sInASearch = "," + asInA.join(",") + ",";
    var sInB = getTextAreaValue("txaSetB");
    sInB = sInB.split("\r").join("");
    if(isSetsCommasSeparators){
        sInB = sInB.split(",").join("\n");
    }
    var asInB = removeBlanks(sInB.split("\n"));
    var sInBSearch = "," + asInB.join(",") + ",";
    var asOut = new Array();
    var sSpliceSep = "$";
    if(sSetting == "Splice"){
        var sSpliceSep = document.forms[0].txtSetsSeparator.value;
        var iRenderedSoFar = 0;
        for(; iRenderedSoFar < Math.min(asInA.length, asInB.length); iRenderedSoFar++){
            asOut[asOut.length] = asInA[iRenderedSoFar] + sSpliceSep + asInB[iRenderedSoFar];
        }
        for(; iRenderedSoFar < asInA.length; iRenderedSoFar++){
            asOut[asOut.length] = asInA[iRenderedSoFar] + sSpliceSep;
        }
        for(; iRenderedSoFar < asInB.length; iRenderedSoFar++){
            asOut[asOut.length] = sSpliceSep + asInB[iRenderedSoFar];
        }
    } else if(sSetting == "Merge"){
        asOut = asInA; // Include everything from A.
        for(var iBX = 0; iBX < asInB.length; iBX++){
            if(sInASearch.indexOf(asInB[iBX]) == -1){
                // Current B elem is NOT IN A.
                asOut[asOut.length] = asInB[iBX];
            }
        }
        //sOut = asOut.join("\n");
    } else if(sSetting == "AMinusB"){
        // Take away all of the A elements which are in B.
        for(var iAX = 0; iAX < asInA.length; iAX++){
            if(sInBSearch.indexOf(asInA[iAX]) == -1){
                // Current A elem is NOT IN in B.
                asOut[asOut.length] = asInA[iAX];
            }
        }
    } else if(sSetting == "Cartesian"){
        // Take away all of the A elements which are in B.
        var sSeparator = document.forms[0].txtSetsSeparator.value;
        for(var iAX = 0; iAX < asInA.length; iAX++){
            for(var iBX = 0; iBX < asInB.length; iBX++){
                asOut[asOut.length] = asInA[iAX] + sSeparator + asInB[iBX];
            }
        }
    } else {
        // "Common" was chosen.
        for(var iAX = 0; iAX < asInA.length; iAX++){
            if(sInBSearch.indexOf(asInA[iAX]) != -1){
                // Current A elem is ALSO IN B.
                asOut[asOut.length] = asInA[iAX];
            }
        }
    }
    if(isSortSetsOutput){
        asOut = sortIgnoreCase(asOut);
    }
    if(isCommaSepOut){
        sOut = asOut.join(",");
    } else {
        sOut = asOut.join("\n");
    }
    //sOut = sOut + "\n" + sInA + "\n" + sInB
    setTextAreaValue("txaOut", sOut);
    document.forms[0].txaIn.select();
}
function doOnClickRadSetsOp(radSrc){
    var sDisplaySetting = "none";
    if((getRadioValue(radSrc.name) == "Splice") || (getRadioValue(radSrc.name) == "Cartesian")){
        sDisplaySetting = "";
    }
    document.getElementById("areaSetsSeparatorWrapper").style.display = sDisplaySetting;
}
function sortIgnoreCase(asIn){
    return asIn.sort(function(x,y){
        var a = String(x).toUpperCase();
        var b = String(y).toUpperCase();
        if (a > b)
            return 1
        if (a < b)
            return -1
        return 0;
    });

}
function swapSetInputs(){
    var sWasA = getTextAreaValue("txaSetA");
    setTextAreaValue("txaSetA", getTextAreaValue("txaSetB"));
    setTextAreaValue("txaSetB", sWasA);
}
function hideShowMainInputField(isShow){
    var sDisplaySetting = (isShow) ? "" : "none";
    var txaInNotUsed = document.getElementById("td-inField");
    txaInNotUsed.style.display = sDisplaySetting;
}
function runReFormat(){
    var sSetting = getRadioValue("radTypeFormatFile");
    var sIn = getTextAreaValue("txaIn");
    var sOut = "";
    var sStatus = "Filesize before: ";
    if(sSetting == "css"){
        sStatus = "Filesize before: ";
        sOut = getTextAreaValue("txaIn");
        var iStartLen = sOut.length;
        sStatus += iStartLen + ", after ";
        sOut = sOut.split("**").join("$IMPOSSIBLESTREINFDF$");
        sOut = removeBetween(sOut, "/" + "*", "*" + "/");
        sOut = trimLines(sOut);
        sOut = sOut.split(": ").join(":").split(",").join(", ").split("  ").join(" ").split("  ").join(" ").split("  ").join(" ");
        sOut = sOut.split("$IMPOSSIBLESTREINFDF$").join("**");
        var iEndLen = sOut.length;
        sStatus += sOut.length;
        if((iStartLen != 0) && (iEndLen != 0)){
            sStatus += " (reduced by " + (100 - Math.round(iEndLen * 100 / iStartLen)) + "%)";
        }
    } else {
        sOut = getTextAreaValue("txaIn").toUpperCase();
    }
    document.getElementById("formatFileStatusBar").innerHTML = sStatus;
    setTextAreaValue("txaOut", sOut);
    document.forms[0].txaIn.select();
}
function setVarName(sRadSrcName){
    if(sRadSrcName == "radEscape"){
        isEscapeBackslashes = (getRadioValue(sRadSrcName) == "Yes");
        //a lert(isEscapeBackslashes);
    } else {
        if(getRadioValue(sRadSrcName) == "String"){
            setTextAreaValue("txtVarName", "sOut");
        } else {
            setTextAreaValue("txtVarName", "sbOut");
        }
    }
}
var g_sCookieLastTabName = "codeGeneratorLastTabName";
function runOnLoad(){
    g_form = document.forms[0];
    var sCookieLastTab = getCookie(g_sCookieLastTabName);
    changeTab(sCookieLastTab);
    //resumeSelectedDobj();
    //resumeSelectedDobj();
    //resumeSelectedDobjSetting();
    //setClassNameSelect();
}
function doMouseOverTab(tdTab){
    tdTab.style.cursor = "hand";
    if(tdTab.id != sTabSelected){
        tdTab.className = "table-tab-on";
    }
}
function doMouseOutTab(tdTab){
    tdTab.style.cursor = "default";
    if(tdTab.id != sTabSelected){
        tdTab.className = "table-tab-off";
    }
}
function doOnClickTab(tdTab){
    setCookie(g_sCookieLastTabName, tdTab.id);
    changeTab(tdTab.id);
}
function changeTab(sTabNew){
    if(sTabNew == ""){
        return;
    }
    sTabSelected = sTabNew;
    // Turn all OFF.
    document.getElementById("td-String").className = "table-tab-off";
    document.getElementById("span-String").style.display = "none";
    document.getElementById("td-DeString").className = "table-tab-off";
    document.getElementById("span-DeString").style.display = "none";
    document.getElementById("td-Cap").className = "table-tab-off";
    document.getElementById("span-Cap").style.display = "none";
    document.getElementById("td-Sets").className = "table-tab-off";
    document.getElementById("span-Sets").style.display = "none";
    document.getElementById("td-Func").className = "table-tab-off";
    document.getElementById("span-Func").style.display = "none";
    document.getElementById("td-Sort").className = "table-tab-off";
    document.getElementById("span-Sort").style.display = "none";
    document.getElementById("td-Replace").className = "table-tab-off";
    document.getElementById("span-Replace").style.display = "none";
    document.getElementById("td-Shablonen").className = "table-tab-off";
    document.getElementById("span-Shablonen").style.display = "none";
    document.getElementById("td-DataObject").className = "table-tab-off";
    document.getElementById("span-DataObject").style.display = "none";
    document.getElementById("td-FormatFile").className = "table-tab-off";
    document.getElementById("span-FormatFile").style.display = "none";
    document.getElementById("td-Clippy").className = "table-tab-off";
    document.getElementById("span-Clippy").style.display = "none";

    // Make sure that the in and out fields are visible
    document.getElementById("table-inAndOutFields").style.display = "";

    // Show the main input field - overwritten in some modes.
    hideShowMainInputField(true);

    // Turn correct one ON
    document.getElementById(sTabNew).className = "table-tab-on";
    if(sTabNew == "td-String"){
        document.getElementById("span-String").style.display = "";
    } else if(sTabNew == "td-DeString"){
        document.getElementById("span-DeString").style.display = "";
    } else if(sTabNew == "td-Cap"){
        document.getElementById("span-Cap").style.display = "";
    } else if(sTabNew == "td-Sets"){
        document.getElementById("span-Sets").style.display = "";
        hideShowMainInputField(false);
    } else if(sTabNew == "td-Func"){
        document.getElementById("span-Func").style.display = "";
    } else if(sTabNew == "td-Sort"){
        document.getElementById("span-Sort").style.display = "";
    } else if(sTabNew == "td-Replace"){
        document.getElementById("span-Replace").style.display = "";
    } else if(sTabNew == "td-Shablonen"){
        document.getElementById("span-Shablonen").style.display = "";
        document.getElementById("table-inAndOutFields").style.display = "none";
    } else if(sTabNew == "td-DataObject"){
        document.getElementById("span-DataObject").style.display = "";
        resumeDobjEntitySelector();
        resumeDobjTemplateSelector();
    } else if(sTabNew == "td-FormatFile"){
        document.getElementById("span-FormatFile").style.display = "";
    } else if(sTabNew == "td-Clippy"){
        document.getElementById("span-Clippy").style.display = "";
    }
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

/*
 * Create the functionize script.
 * Loop through all the values, inserting them into the function scripts.
 */
function runFunc(){
    // Get the formatting text
    var sAllFormats = getTextAreaValue("txaFuncFormat");
    // Replace tab markers with real tabs
    sAllFormats = replaceSubstring(sAllFormats, "^t", "\t");
    // Put the format string back in the format field.
    setTextAreaValue("txaFuncFormat", sAllFormats);
    var sOutAll = "";
    var sValueSeparator = getValueSeparatorForFunctionize();
    var asSettings = getTextInsideMarkers(sAllFormats, "$SECTION{", "}");
    var asFormats = getTextOutsideMarkers(sAllFormats, "$SECTION{", "}");
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
        var sIn = getTextAreaValue("txaIn");
        var asIn = sIn.split("\n");
        // do cycle here
        resetCycles();
        sFormat = setCycleMarkers(sFormat);
        var sNL = "\n";
        var isShowNewLines = true;
        if((asSettings[iFormat].indexOf("noreturn") != -1) || (asSettings[iFormat].indexOf("nonewline") != -1)){
            sNL = "";
            isShowNewLines = false;
        }
        for(var iLine = 0; iLine < asIn.length; iLine++){
            if(asIn[iLine].charAt(asIn[iLine].length - 1) == "\r"){
                asIn[iLine] = asIn[iLine].substring(0, asIn[iLine].length -1);
            }
            if(asIn[iLine].length != 0){
                var asValues = asIn[iLine].split(sValueSeparator);
                //a lert("asValues " + asValues);
                var sTemp = sFormat;
                var iBit = 0;
                var sCounterStartMarker = "$COUNTER{";
                var sCounterEndMarker = "}";
                if(sTemp.indexOf(sCounterStartMarker) != -1){
                    sTemp = replaceSubstring(sTemp, sCounterStartMarker + sCounterEndMarker, "" + iLine);
                    sTemp = replaceSubstring(sTemp, sCounterStartMarker + "0" + sCounterEndMarker, "" + iLine);
                    var iCounterPos = sTemp.indexOf(sCounterStartMarker);
                    while(iCounterPos != -1){
                        var iBeginNr = iCounterPos + sCounterStartMarker.length;
                        var iEndNr = sTemp.indexOf(sCounterEndMarker, iCounterPos);
                        var sCounterValue = sTemp.substring(iBeginNr, iEndNr);
                        var iCounterOffset = 0;
                        try {
                            iCounterOffset = parseInt(sCounterValue);
                        } catch(e){}
                        sTemp = sTemp.substring(0, iCounterPos) + (iLine + iCounterOffset) + sTemp.substring(iEndNr + sCounterEndMarker.length);
                        iCounterPos = sTemp.indexOf(sCounterStartMarker);
                    }
                }
                for(; iBit < asValues.length; iBit++){
                    sTemp = replaceSubstring(sTemp, "${" + iBit + "}", asValues[iBit]);
                }
                // Check if next value to look for is there...
                if(sTemp.indexOf("${" + iBit + "}") != -1){
                    var sEss = (iBit > 1) ? "s" : "";
                    sErrors += "Line " + (iLine + 1) + " only has " + (iBit) + " value" + sEss + ", is missing some values.\n";
                }
                sOut += evaluateMod(sTemp) + sNL;
            }
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

var asCycle = new Array();
var sCycleMarkerStart = "###CYCLE#$";
var sCycleMarkerEnd = "$#CYCLE###";
function resetCycles(){
    asCycle = new Array();
}
function addCycle(sIn){
    //a lert("Adding cycle " + sIn)
    asCycle[asCycle.length] = sIn.split("$");
}
function setCycleMarkers(sFormat){
    var iBrake = 0;
    var iPosStart = sFormat.indexOf("$CYCLE{");
    var iPosEnd = -1;
    var iCycleCounter = 0;
    while((iPosStart != -1) && (iBrake++ < 10)){
        iPosEnd = sFormat.indexOf("}", iPosStart);
        var sText = sFormat.substring((sFormat.indexOf("{", iPosStart) + 1), iPosEnd);
        addCycle(sText);
        sFormat = sFormat.substring(0, iPosStart) + sCycleMarkerStart + (asCycle.length - 1) + sCycleMarkerEnd + sFormat.substring(iPosEnd + 1);
        iPosStart = sFormat.indexOf("$CYCLE{", iPosStart + sCycleMarkerStart.length + sCycleMarkerEnd.length);
    }
    return sFormat;
}

function replaceCycleMarkers(sIn){
    for(var i = 0; i < asCycle.length; i++){
        var sToken = (sCycleMarkerStart + i + sCycleMarkerEnd);
        //sIn = replaceSubstring(sIn, sToken, "CYC" + i + "," + iE++);
        var iPos = sIn.indexOf(sToken);
        var iBrake = 0;
        var iE = 0;
        while((iPos != -1) && (iBrake++ < 1000)){
            var asTokens = asCycle[i];
            //var sReplaceToken = ("CYC[" + i + "," + iE + "]");
            var sReplaceToken = getFromLoopedArray(asTokens, iE);
            sIn = sIn.substring(0, iPos) + sReplaceToken + sIn.substring(iPos + sToken.length);
            iPos = sIn.indexOf(sToken, (iPos + sToken.length));
            iE++;
        }
    }
    return sIn;
}
function getFromLoopedArray(as, iElement){
    if (as.length == 0){
        return "";
    } else if (iElement < 0){
        return "";
    }
    return as[iElement % as.length];
}
var asTest = new Array("first", "second", "last");
var iTest = 0;
getFromLoopedArray(asTest, iTest++);
getFromLoopedArray(asTest, iTest++);
getFromLoopedArray(asTest, iTest++);
getFromLoopedArray(asTest, iTest++);
getFromLoopedArray(asTest, iTest++);
getFromLoopedArray(asTest, iTest++);
getFromLoopedArray(asTest, iTest++);

function runSort(){
    var sSortOrder = getRadioValue("radSortOrder");
    var sSortSelection = getSelectValue("selSortSelection");
    var isRemoveBlanks = (getCheckboxValue("chxIsRemoveBlanks") == "yes");
    var isRemoveDuplicates = (getCheckboxValue("chxIsRemoveDuplicates") == "yes");
    var sDelimiter = "\n";
    if(sSortSelection == "ByMarker"){
        sDelimiter = g_form.txtSortMarker.value;
    }
    var asIn = getTextAreaValue("txaIn").split(sDelimiter);
    if(isRemoveDuplicates){
        asIn = removeDuplicates(asIn);
    }
    if(isRemoveBlanks){
        asIn = removeBlanks(asIn);
    }
    var sSortSep = "*&*";
    var isHasSortSelection = false;
    if(sSortSelection == "AfterCharNum"){
        isHasSortSelection = true;
        var sSortAfter = g_form.txtSortMarker.value;
        if(isNaN(sSortAfter)){
            alert("Not a number");
            return;
        }
        var iSortAfter = parseInt(g_form.txtSortMarker.value);
        for(var i = 0; i < asIn.length; i++){
            var sLine = cleanLine(asIn[i]);
            if(sLine != ""){
                var iSortAfterTemp = Math.min(iSortAfter, sLine.length);
                //a lert(iSortAfter + " being set to " + iSortAfterTemp);
                asIn[i] = sLine.substring(iSortAfterTemp).toLowerCase() + sSortSep + sLine;
            }
        }
    } else if(sSortSelection == "AfterFirstIndex"){
        isHasSortSelection = true;
        var sSortAfter = g_form.txtSortMarker.value;
        for(var i = 0; i < asIn.length; i++){
            var sLine = cleanLine(asIn[i]);
            if(sLine != ""){
                var iFoundAt = sLine.indexOf(sSortAfter);
                if(iFoundAt == -1){
                    asIn[i] = sLine.toLowerCase() + sSortSep + sLine;
                } else {
                    asIn[i] = sLine.substring(iFoundAt + sSortAfter.length).toLowerCase() + sSortSep + sLine;
                }
            }
        }
    } else if(sSortSelection == "ByMarker"){
        var sIn = getTextAreaValue("txaIn") + "\n";
        var sSortMarkerVal = g_form.txtSortMarker.value;
        sIn = replaceSubstring(sIn, "\r\n", "\n");
        sIn = replaceSubstring(sIn, sSortMarkerVal + "\n", "\n" + sSortMarkerVal);
        asIn = sIn.split(sSortMarkerVal);
        //a lert(asIn.join("\n--------\n"));
    } else {
        isHasSortSelection = true;
        for(var i = 0; i < asIn.length; i++){
            asIn[i] = asIn[i].toLowerCase() + sSortSep + asIn[i];
        }
    }
    //a lert(asIn.join("\n"));
    asIn.sort();
    if(sSortOrder == "Ascending"){
        asIn.reverse();
    }
    if(isHasSortSelection){
        for(var i = 0; i < asIn.length; i++){
            asIn[i] = asIn[i].substring(asIn[i].indexOf(sSortSep) + sSortSep.length);
        }
    }
    var sOutTemp = asIn.join(sDelimiter);
    if(sSortSelection == "ByMarker"){
        sOutTemp = replaceSubstring(sOutTemp, "\n" + sSortMarkerVal, sSortMarkerVal + "\n");
    }
    setTextAreaValue("txaOut", sOutTemp);
}
function getTextAreaValueAsArray(sFieldName){
    var sVal = getTextAreaValue(sFieldName);
    var asVal = sVal.split("\n");
    for(var i = 0; i < asVal.length; i++){
        asVal[i] = cleanLine(asVal[i]);
    }
    return asVal;
}
function escapeDollars(sIn){
    return handleDollars(sIn, true);
}
function unescapeDollars(sIn){
    return handleDollars(sIn, false);
}
function handleDollars(sIn, isEscape){
    var sDollarLitteral = "^$";
    var sDollar = "$";
    if(isEscape){
        //a lert(replaceSubstring(sIn, sDollarLitteral, g_sHiddenDollar));
        return replaceSubstring(sIn, sDollarLitteral, g_sHiddenDollar);
    } else {
        //a lert(replaceSubstring(sIn, g_sHiddenDollar, sDollar));
        return replaceSubstring(sIn, g_sHiddenDollar, sDollar);
    }
}
//function escapeFormatChars(sIn){
//	var sOut = replaceSubstring(sIn, "\t", "^t");
//	return r eplaceSubstring(sOut, "\r\n", "^n");
//	//return r eplaceSubstring(sOut, "$", "^$");
//}
//function unescapeFormatChars(sIn){
//	var sOut = replaceSubstring(sIn, "^t", "\t");
//	r eturn r eplaceSubstring(sOut,"^n", "\r\n");
//	//r eturn r eplaceSubstring(sOut,"^$", g_sHiddenDollar);
//}
function runReplaceRemoveCommon(){
    var sText = getTextAreaValue("txaIn");
    var asLines = sText.split("\n");
    var sRemoStart = asLines[0];
    for(var i = 1; i < asLines.length; i++){
        // Cycle through until we get first different char.
        var sLineNext = asLines[i];
        for(var ixDif = 0; ixDif < Math.min(sRemoStart.length, sLineNext.length); ixDif++){
            if(sRemoStart.charAt(ixDif) != sLineNext.charAt(ixDif)){
                // Got a difference
                sRemoStart = sRemoStart.substring(0, ixDif);
                break;
            }
        }
    }
    for(var iRemoStart = 0; iRemoStart < asLines.length; iRemoStart++){
        asLines[iRemoStart] = asLines[iRemoStart].substring(sRemoStart.length);
    }

    var sRemoEnd = asLines[0];
    for(var iEndCounter = 1; iEndCounter < asLines.length; iEndCounter++){
        // Cycle through until we get first different char.
        var sLineNext = asLines[iEndCounter];
        for(var ixDif = 1; ixDif < Math.min(sRemoEnd.length, sLineNext.length); ixDif++){
            var debu1 = sRemoEnd.charAt(sRemoEnd.length - ixDif);
            var debu2 = sLineNext.charAt(sLineNext.length - ixDif);
            if(sRemoEnd.charAt(sRemoEnd.length - ixDif) != sLineNext.charAt(sLineNext.length - ixDif)){
                // Got a difference
                sRemoEnd = sRemoEnd.substring((sRemoEnd.length - ixDif + 1), sRemoEnd.length);
                break;
            }
        }
    }
    for(var iRemoEndCount = 0; iRemoEndCount < asLines.length; iRemoEndCount++){
        asLines[iRemoEndCount] = asLines[iRemoEndCount].substring(0, (asLines[iRemoEndCount].length - sRemoEnd.length));
    }
    setTextAreaValue("txaOut", asLines.join("\n"));
}
function runReplace(){
    var sText = getTextAreaValue("txaIn");
    //sText = escapeDollars(sText);
    var sPairs = getTextAreaValue("txaReplacePairs");
    sPairs = escapeDollars(sPairs);
    var asPairs = sPairs.split("\n");
    //a lert(asPairs);
    //var isTrim = (getRadioValue("radWithTrim") == "All");
    //var iTrimLeng = parseInt(getRadioValue("radWithTrim"));
    var iTrimLeng = parseInt(getSelectValue("selWithTrim"));
    var isTrim = iTrimLeng > 0;
    iTrimLeng *= -1;
    var iChangeCount = 0;
    var aiChangeCount = new Array();
    for(var i = 0; i < asPairs.length; i++){
        var sSRTemp = replaceSubstring(asPairs[i],"^t","\t");
        sSRTemp = replaceSubstring(sSRTemp,"^n","\r\n");
        var asSR = replaceSubstring(sSRTemp,"^n","\n").split("$");
        if(asSR.length == 1){
            asSR[1] = "";
        }
        if(asSR[1].charCodeAt(asSR[1].length - 1) == 13){
            asSR[1] = asSR[1].substring(0, (asSR[1].length - 1));
        }
        //a lert("replaceSubstring(\"" + sText + "\", \"" + asSR[0] + "\", \"" + asSR[1] + "\")");
        var sFindTemp = unescapeDollars(asSR[0]);
        var sReplaceTemp = unescapeDollars(asSR[1]);
        g_iReplaceSubstringCounter = 0;
        sText = replaceSubstring(sText, sFindTemp, sReplaceTemp);
        iChangeCount += g_iReplaceSubstringCounter;
        aiChangeCount[i] = g_iReplaceSubstringCounter;
    }
    if(isTrim){
        //a lert(iTrimLeng + "[" + sText);
        var asText = sText.split("\n");
        for(var iL = 0; iL < asText.length; iL++){
            asText[iL] = indentText(asText[iL], "\t", iTrimLeng);
        }
        sText = asText.join("\n");
    }
    var sText = unescapeDollars(sText);
    log.replace(iChangeCount + " replacement" + ((iChangeCount == 1) ? "" : "s") + " made (" + (aiChangeCount.join(",")) + ").");
    setTextAreaValue("txaOut", sText);
}

function Log(sLogDisplayObjectName){
    this.logDisplayObjectName = sLogDisplayObjectName;
    this.replace = function(sOut){
        document.getElementById(this.logDisplayObjectName).innerHTML = sOut;
    }
    this.out = function(sOut){
        var objOut = document.getElementById(this.logDisplayObjectName);
        objOut.innerHTML += ((objOut.innerHTML == "") ? "" : "<br>") + sOut;
    }
}
var log = new Log("replacePairsStatusBar");
function runAppend(){
    var sToAdd = getSelectValue("selAppendString");
    if(sToAdd == "Other"){
        sToAdd = prompt("Enter the text to append\nUse:^n for new-line, ^t for tab", "^t// ");
        if((sToAdd == null) || (typeof sToAdd == "undefined") || (sToAdd == "")){
            return;
        }
    }
    sToAdd = replaceSubstring(sToAdd, "^t", "\t");
    sToAdd = replaceSubstring(sToAdd, "^n", "\n");
    var asText = getTextAreaValue("txaIn").split("\n");
    for(var iL = 0; iL < asText.length; iL++){
        asText[iL] = indentText(asText[iL], sToAdd, 1);
    }
    g_form.txaIn.value = asText.join("\n");
}

function indentText(sIn, sCharToAdd, iCount){
    if(iCount == 0){
        return sIn;
    }
    if(iCount < 0){
        //a lert("removing");
        iCount *= -1;
        var iChanged = 0;
        while((iChanged < iCount) && ((sIn.charAt(0) == " ") || (sIn.charAt(0) == "\t"))){
            sIn = sIn.substring(1);
            iChanged++;
        }
    } else {
        //a lert("adding");
        for(var iAdd = 0; iAdd < iCount; iAdd++){
            sIn = sCharToAdd + sIn;
        }
    }
    return sIn;
}

function getSelectValue(sFieldName){
    var selTrg = g_form[sFieldName];
    if(!selTrg){
    	return "";
    }
    var iSelIndex = selTrg.selectedIndex;
    return selTrg[iSelIndex].value;
}
function setSelectValue(sFieldName, sValue){
	var selTrg = g_form[sFieldName];
	if(!selTrg){
		return;
	}
	for ( var iOpt = 0; iOpt < selTrg.length; iOpt++) {
		if(selTrg[iOpt].value == sValue){
			selTrg.selectedIndex = iOpt;
		}
	}
}

// ===========================================================================
// MOD STUFF
var asMods = new Array("UPPERCASE","LOWERCASE","INNERCAPS","PROPERCASE","LEADUPPERCASE","LEADLOWERCASE","REPLACE");

function evaluateMod(sIn){
    var iPosLast = lastIndexOfAMod(sIn);
    var iBrake = 0;
    while((iPosLast != -1) && (iBrake++ < 1000)){
        var sRealized = sIn.substring(iPosLast);
        var iPosClose = getClosingBracketPosMod(sRealized) + 1;
        sRealized = sRealized.substring(0, iPosClose);
        sRealized = realizeMod(sRealized);
        sIn = sIn.substring(0, iPosLast) + sRealized + sIn.substring(iPosLast + iPosClose);
        //a lert("curr [" + sIn + "]");
        iPosLast = lastIndexOfAMod(sIn);
    }
    return sIn;
}

function realizeMod(sIn) {
    var sInstruction = sIn.substring(0, sIn.indexOf("{"));
    var sText = sIn.substring(sIn.indexOf("{") + 1, sIn.length - 1);
    if(sInstruction == "$UPPERCASE"){
        sText = sText.toUpperCase();
    } else if(sInstruction == "$LOWERCASE"){
        sText = sText.toLowerCase();
    } else if(sInstruction == "$INNERCAPS"){
        sText = getAsInnerCaps(sText);
    } else if(sInstruction == "$PROPERCASE"){
        sText = sText.substring(0,1).toUpperCase() + sText.substring(1).toLowerCase();
    } else if(sInstruction == "$LEADUPPERCASE"){
        sText = sText.substring(0,1).toUpperCase() + sText.substring(1);
    } else if(sInstruction == "$LEADLOWERCASE"){
        sText = sText.substring(0,1).toLowerCase() + sText.substring(1);
    } else if(sInstruction == "$REPLACE"){
        var asText = sText.split("$");
        sText = replaceSubstring(asText[0], asText[1], asText[2]);
    }
    return sText;
}

function getClosingBracketPosMod(sIn) {
    var isCloseCurly = true;
    var iPos = 0;
    while(isCloseCurly){
        var cTemp = sIn.charAt(iPos);
        if(cTemp == '}'){
            return iPos;
        } else {
            iPos++;
        }
    }
    return iPos;
}

function lastIndexOfAMod(sIn) {
    var iLast = -1;
    for(var iMod = 0; iMod < asMods.length; iMod++){
        var iModTemp = sIn.lastIndexOf(getMarkerMod(asMods[iMod]));
        if(iModTemp > iLast){
            iLast = iModTemp;
        }
    }
    return iLast;
}

function getMarkerMod(sModName) {
    return "$" + sModName + "{";
}

function getValueSeparatorForFunctionize(){
    var asVals = getTextAreaValue("txaIn").split("\t");
    if(asVals.length > 1){
        return "\t";
    }
    return "$";
}

function setTemplateMod(selSrc){
    var sOut = "";
    var sValueFromSel = selSrc[selSrc.selectedIndex].value;
    //if(selSrc.selectedIndex == 1){
    var sValueSeparator = getValueSeparatorForFunctionize();
    var sVals = getTextAreaValue("txaIn").split("\n");
    var iVars = sVals[0].split(sValueSeparator).length;
    if(sValueFromSel == "simple"){
        for(var i = 0; i < iVars; i++){
            sOut += "${" + i + "} ";
        }
    } else if(sValueFromSel == "htmltable"){
        sOut += "$SECTION{norepeat}";
        sOut += "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"\" style=\"\">";
        //sOut += "\n$SECTION{}";
        sOut += "\n$SECTION{}\n\t<tr>";
        for(var i = 0; i < iVars; i++){
            sOut += "\n\t\t<td>${" + i + "}</td>";
        }
        sOut += "\n\t</tr>\n$SECTION{norepeat}";
        sOut += "\n</table>";
    } else if(sValueFromSel == "sqlinsert"){
        //sOut += "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"\" style=\"\">";
        sOut += "insert into table_t (\n";
        for(var i = 0; i < iVars; i++){
            if(i > 0){
                sOut += ", ";
            }
            sOut += "column" + i + "";
        }
        sOut += "\n) values (\n";
        for(var i = 0; i < iVars; i++){
            if(i > 0){
                sOut += ", ";
            }
            sOut += "${" + i + "}";
        }
        sOut += "\n);\n";
        sOut += "$SECTION{norepeat}";
        sOut += ";\n/";
        sOut += "\ncommit\n/";
    } else if(sValueFromSel == "javaclass"){
        sOut += "$SECTION{norepeat}\n\t// Data Fields\n$SECTION{}\n\tprivate $REPLACE{$REPLACE{$REPLACE{${1}$VARCHAR$String}$NUMBER$int}$Date$java.util.Date} $INNERCAPS{$REPLACE{${0}$ $_}} = $REPLACE{$REPLACE{$REPLACE{${1}$String$\"\"}$int$0}$Date$null}; // Field to hold $REPLACE{${0}$ $-} value.";
        sOut += "\n$SECTION{norepeat,start=0}";
        sOut += "\n$SECTION{} ";
        sOut += "\n\t/" + "**";
        sOut += "\n\t * Return ${0} from DB col USER_T.$UPPERCASE{$REPLACE{${0}$ $_}}.";
        sOut += "\n\t * @return $INNERCAPS{$REPLACE{${0}$ $_}} ${1} representing the $REPLACE{${0}$ $-} value.";
        sOut += "\n\t *" + "/";
        sOut += "\n\tpublic $REPLACE{$REPLACE{$REPLACE{${1}$VARCHAR$String}$NUMBER$int}$Date$java.util.Date} get$LEADUPPERCASE{$INNERCAPS{$REPLACE{${0}$ $_}}}(){";
        sOut += "\n\t\treturn this.$INNERCAPS{$REPLACE{${0}$ $_}};";
        sOut += "\n\t}";
        sOut += "\n";
        sOut += "\n\t/" + "**";
        sOut += "\n\t * Set ${0}";
        sOut += "\n\t * @param valToSet, ${1} representing the $REPLACE{${0}$ $-} value.";
        sOut += "\n\t *" + "/";
        sOut += "\n\tpublic void set$LEADUPPERCASE{$INNERCAPS{$REPLACE{${0}$ $_}}}($REPLACE{$REPLACE{$REPLACE{${1}$VARCHAR$String}$NUMBER$int}$Date$java.util.Date} valToSet){";
        sOut += "\n\t\tthis.$INNERCAPS{$REPLACE{${0}$ $_}} = valToSet;";
        sOut += "\n\t}";
        sOut += "\n$SECTION{norepeat}";
        sOut += "\n$SECTION{}";
        sOut += "\n$NOREPEAT{}\t/" + "**";
        sOut += "\n\t * Create description of the state of the object.";
        sOut += "\n\t * @return String containing all the fields, and their current values.";
        sOut += "\n\t *" + "/";
        sOut += "\n\tpublic String toString(){";
        sOut += "\n\t\tStringBuffer sbOut = new StringBuffer();";
        sOut += "\n$SECTION{}";
        sOut += "\n\t\tsbOut.append(\"$INNERCAPS{$REPLACE{${0}$ $_}} [\").append(this.$INNERCAPS{$REPLACE{${0}$ $_}}).append(\"]\");";
        sOut += "\n$SECTION{norepeat}\t\treturn sbOut.toString();";
        sOut += "\n\t}";
    } else if(sValueFromSel == "javastrutsaction"){
        sOut += "\n$SECTION{norepeat}\tObjectVO oVo = new ObjectVO();";
        sOut += "\n$SECTION{norepeat}";
        sOut += "\n$SECTION{} ";
        sOut += "\n\t/" + "**";
        sOut += "\n\t * Set ${0}";
        sOut += "\n\t * @param valToSet, ${1} representing the $REPLACE{${0}$ $-} value.";
        sOut += "\n\t *" + "/";
        sOut += "\n\tpublic void set$LEADUPPERCASE{$INNERCAPS{$REPLACE{${0}$ $_}}}($REPLACE{$REPLACE{$REPLACE{${1}$VARCHAR$String}$NUMBER$int}$Date$java.util.Date} valToSet){";
        sOut += "\n\t\toVo.set$LEADUPPERCASE{$INNERCAPS{$REPLACE{${0}$ $_}}}(valToSet);";
        sOut += "\n\t}";
        sOut += "\n$SECTION{norepeat}";
        sOut += "\n$SECTION{norepeat}\t/" + "**";
        sOut += "\n\t * Create description of the state of the object.";
        sOut += "\n\t * @return String containing all the fields, and their current values.";
        sOut += "\n\t *" + "/";
        sOut += "\n\tpublic String toString(){";
        sOut += "\n\t\tStringBuffer sbOut = new StringBuffer();";
        sOut += "\n$SECTION{}";
        sOut += "\n\t\tsbOut.append(\" [$INNERCAPS{$REPLACE{${0}$ $_}}=\").append(oVo.get$LEADUPPERCASE{$INNERCAPS{$REPLACE{${0}$ $_}}}()).append(\"]\");";
        sOut += "\n$SECTION{norepeat}\t\treturn sbOut.toString();";
        sOut += "\n\t}";
    } else if(sValueFromSel == "declaremembervars"){
        sOut += "\tpublic $REPLACE{$REPLACE{${1}$VARCHAR$String}$NUMBER$int} $INNERCAPS{$REPLACE{${0}$ $_}} = $REPLACE{$REPLACE{${1}$VARCHAR$\"\"}$NUMBER$0}; // The ${0} value. DB col \"$UPPERCASE{$REPLACE{${0}$ $_}}\".";
    } else if(sValueFromSel == "xmlvalues"){
        sOut += "<A#>";
        sOut += "\n\t<B#>${0}</B#>";
        sOut += "\n\t<C#>${1}</C#>";
        sOut += "\n\t<D#>${2}</D#>";
        sOut += "\n\t<E#>${3}</E#>";
        sOut += "\n</A#>";
    } else if(sValueFromSel == "xmlnodes"){
        sOut += "$SECTION{norepeat}<root>\r\n";
        sOut += "$SECTION{}\r\n";
        sOut += "\t<$INNERCAPS{$REPLACE{${0}$ $_}}>${1}</$INNERCAPS{$REPLACE{${0}$ $_}}>\r\n";
        sOut += "$SECTION{norepeat}</root>";
    } else if(sValueFromSel == "htmlselectfield"){
        sOut += "$SECTION{norepeat}<select name=\"sel\" class=\"input-selectDefault\">\r\n";
        sOut += "$SECTION{}\r\n";
        sOut += "^t<option value=\"$INNERCAPS{$REPLACE{${0}$ $_}}\"$CYCLE{ selected$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$}>$LEADUPPERCASE{${0}}</option>";
        sOut += "$SECTION{norepeat}</select>";
    } else if(sValueFromSel == "hibernateproperty"){
        sOut += "\t\t<property name=\"$INNERCAPS{$REPLACE{${0}$ $_}}\"";
        sOut += " column=\"$UPPERCASE{$REPLACE{${0}$ $_}}\" />";
    } else if(sValueFromSel == "batrenamefiles"){
        sOut += "$SECTION{norepeat}c:";
        sOut += "\ncd C:\\Data\\WebSphere_WebIR\\instr-service-deployment\\cmd";
        sOut += "\n$SECTION{}";
        sOut += "\nrename ${0} $REPLACE{${0}$.bat.$.cmd.}";
        sOut += "\n$SECTION{norepeat}";
        sOut += "\npause";
    } else if(sValueFromSel == "imagedisplaypage"){
        sOut += "\n$SECTION{norepeat}<html>";
        sOut += "\n<" + "head>";
        sOut += "\n<title>Code Generated Page</title>";
        sOut += "\n<" + "style>";
        sOut += "\nbody {";
        sOut += "\nbackground-color: #888;";
        sOut += "\n}";
        sOut += "\n.imageSmall {";
        sOut += "\nwidth: 30px;";
        sOut += "\n}";
        sOut += "\n.imageNormal {";
        sOut += "\nwidth: auto;";
        sOut += "\n}";
        sOut += "\n</" + "style>";
        sOut += "\n<" + "script>";
        sOut += "\nfunction doOnClickImage(imgSrc){";
        sOut += "\n\ttoggleImageSize(imgSrc);";
        sOut += "\n}";
        sOut += "\nfunction toggleImageSize(imgSrc){";
        sOut += "\n\tif(imgSrc.className == \"imageNormal\"){";
        sOut += "\n\t\timgSrc.className = \"imageSmall\";";
        sOut += "\n\t} else {";
        sOut += "\n\t\timgSrc.className = \"imageNormal\";";
        sOut += "\n\t}";
        sOut += "\n}";
        sOut += "\nfunction doOnMouseoverImage(imgSrc){";
        sOut += "\n\twindow.status = imgSrc.src;";
        sOut += "\n}";
        sOut += "\n</" + "script>";
        sOut += "\n</" + "head>";
        sOut += "\n<" + "body>";
        sOut += "\n$SECTION{}";
        sOut += "\n<img src=\"http://www.site.com/path/img${0}.jpg\" class=\"imageSmall\" onclick=\"doOnClickImage(this);\" onmouseover=\"doOnMouseoverImage(this);\"/>";
        sOut += "\n$SECTION{norepeat}";
        sOut += "</body>";
        sOut += "\n</" + "html>";
    }
    //setTextAreaValue("txaIn", "01\n02\n03\n04\n05\n06\n07\n08\n09\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30");
    setTextAreaValue("txaFuncFormat", sOut);
}

function setShablonen(selSrc){
    var sOut = "";
    if(selSrc.selectedIndex == 1){ // HTML
        sOut += "<html>";
        sOut += "\n<head>";
        sOut += "\n<title>Web Page</title>";
        sOut += "\n<meta name=\"description\" content=\"Description\" /> ";
        sOut += "\n<meta name=\"keywords\" content=\"Keywords\" /> ";
        sOut += "\n<style type=\"text/css\">";
        sOut += "\nbody, table, tr, td {";
        sOut += "\n\tmargin:0px 0px 0px 0px;";
        sOut += "\n\tfont-size:12px;";
        sOut += "\n\tfont-family:Geneva, Arial, Helvetica, san-serif;";
        sOut += "\n\tline-height:140%;";
        sOut += "\n\tcolor:#FFF;";
        sOut += "\n\tbackground:#848484; /" + "* url(bg_homeMetal.jpg) top left repeat-x; *" + "/";
        sOut += "\n}";
        sOut += "\ntable, td {";
        sOut += "\n\tvertical-align: top;";
        sOut += "\n}";
        sOut += "\na, a:visited {";
        sOut += "\n\tcolor: white;";
        sOut += "\n\ttext-decoration: none;";
        sOut += "\n}";
        sOut += "\n</style>";
        sOut += "\n<script>";
        sOut += "\nfunction doOnLoad(){";
        sOut += "\n}";
        sOut += "\n</" + "s" + "cript>";
        sOut += "\n<" + "!" + "-- s" + "cript src=\"HomeData.js\"><" + "/" + "script" + " --" + ">";
        sOut += "\n<" + "/" + "head>";
        sOut += "\n<body onload=\"doOnLoad();\">";
        sOut += "\n<table class=\"table-main\" width=\"180\">";
        sOut += "\n\t<tr>";
        sOut += "\n\t\t<td class=\"\" style=\"\">";
        sOut += "\n\t\t\t<div id=\"div-links\" class=\"\" style=\"\"></div>";
        sOut += "\n\t\t</td>";
        sOut += "\n\t</tr>";
        sOut += "\n</table>";
        sOut += "\n</body>";
        sOut += "\n</html>";
    } else if(selSrc.selectedIndex == 2){ // CSS
        sOut += "<style type=\"text/css\">";
        sOut += "\nbody, table, tr, td {";
        sOut += "\n\tmargin:0px 0px 0px 0px;";
        sOut += "\n\tfont-size:12px;";
        sOut += "\n\tfont-family:Geneva, Arial, Helvetica, san-serif;";
        sOut += "\n\tline-height:140%;";
        sOut += "\n\tcolor:#FFF;";
        sOut += "\n\tbackground:#848484 url(bg_homeMetal.jpg) top left repeat-x;";
        sOut += "\n}";
        sOut += "\ntable, td {";
        sOut += "\n\tvertical-align: top;";
        sOut += "\n}";
        sOut += "\na, a:visited {";
        sOut += "\n\tcolor: white;";
        sOut += "\n\ttext-decoration: none;";
        sOut += "\n}";
        sOut += "\n</style>";
    } else if(selSrc.selectedIndex == 3){ // XML
        sOut += "<A#>";
        sOut += "\n\t<B#>${0}</B#>";
        sOut += "\n\t<C#>${1}</C#>";
        sOut += "\n\t<D#>${2}</D#>";
        sOut += "\n\t<E#>${3}</E#>";
        sOut += "\n</A#>";
    }
    setTextAreaValue("txaShablonen", sOut);
}

function showClippy(iStep){
    var iClippyTemp = iClippyCurr + iStep; //Math.max(0, (iClippyCurr + iStep));
    if((iClippyTemp < 0) || (iClippyTemp >= asClippy.length)){
        return;
    }
    iClippyCurr = iClippyTemp;
    showClippyText(iClippyCurr);
    showClippyInfo();
}

function showClippyText(){
    var sTxt = "";
    if((iClippyCurr >= 0) && (asClippy.length > 0)){
        sTxt = asClippy[iClippyCurr];
    }
    g_form.txaClippy0.value = sTxt;
}
function showClippyInfo(){
    if(iClippyCurr == -1){
        sOut = "There are no clippies";
        return;
    }
    var sOut = "Clippy " + (iClippyCurr + 1);
    document.getElementById("span-clippyInfo").innerHTML = sOut;
    document.getElementById("span-clippyCount").innerHTML = asClippy.length;
}
function appendClippy(sClippyNew){
    if((sClippyNew == "") || sClippyNew == asClippy[asClippy.length - 1]){
        return;
    }
    asClippy[asClippy.length] = sClippyNew;
    iClippyCurr = asClippy.length - 1;
    showClippyText();
    showClippyInfo();
}
function removeCurrentClippy(){
    if(asClippy.length > 0){
        asClippy[iClippyCurr] = "";
        removeEmptyClippies();
    }
}
function removeEmptyClippies(){
    var iOffset = 0;
    var sOut = "";
    for(var iC = 0; (iC + iOffset) < asClippy.length; iC++){
        while(((iC + iOffset) < asClippy.length) && (asClippy[iC + iOffset] == "")){
            iOffset++;
        }
        asClippy[iC] = asClippy[iC + iOffset];
    }
    asClippy.length = (asClippy.length - iOffset);
    iClippyCurr--;
    if(iClippyCurr >= asClippy.length){
        iClippyCurr = asClippy.length - 1;
    }
    if((iClippyCurr < 0) && (asClippy.length > 0)){
        iClippyCurr = 0;
    }
    showClippyText();
    showClippyInfo();
}
function setSearchReplaceCaseGuesses(){
    var sPairs = getTextAreaValue("txaReplacePairs");
    var asPairs = getTextAreaValueAsArray("txaReplacePairs");
    var asPairsLengthAtStart = asPairs.length;
    for(var iP = 0; iP < asPairsLengthAtStart; iP++){
        if(getCase(asPairs[iP]) == "UPPER"){
            if(!isInArray(asPairs, asPairs[iP].toLowerCase())){
                sPairs += "\n" + asPairs[iP].toLowerCase();
            }
        } else {
            if(!isInArray(asPairs, asPairs[iP].toUpperCase())){
                sPairs += "\n" + asPairs[iP].toUpperCase();
            }
        }
    }
    setTextAreaValue("txaReplacePairs", sPairs);
}
function isInArray(as, s){
    for(var iE = 0; iE < as.length; iE++){
        if(as[iE] == s){
            return true;
        }
    }
    return false;
}
function putRecycledContent(){
    appendClippy(g_form.txaIn.value);
    g_form.txaIn.value = g_form.txaOut.value;
}
function runSetReplaceValues(sSelName){
	
	var sType = getSelectValue(sSelName);
    var sOut = "";
    if(sType == "Returns"){
    	sOut = "^n^n^n^n^n^n^n^n$^n\n^n^n^n^n$^n\n^n^n^n$^n\n^n^n$^n\n^n^n$^n";
    } else if(sType == "HTML"){
        sOut += "<!DOCTYPE HTML PUBLIC $<!doctype html public ";
        sOut += "\n<HTML>$<html>";
        sOut += "\n</HTML>$</html>";
        sOut += "\n<HEAD>$<head>";
        sOut += "\n<META $<meta ";
        sOut += "\n<LINK $<link ";
        sOut += "\n<TITLE>$<title>";
        sOut += "\n</TITLE>$</title>";
        sOut += "\n</HEAD>$</head>";
        sOut += "\n<BODY>$<body>";
        sOut += "\n<TABLE$<table";
        sOut += "\n WIDTH=$ width=";
        sOut += "\n ID=$ id=";
        sOut += "\n NAME=$ name=";
        sOut += "\n CLASS=$ class=";
        sOut += "\n<DIV$<div";
        sOut += "\n</DIV>$</div>";
        sOut += "\n<SPAN$<span>";
        sOut += "\n</SPAN>$</span>";
        sOut += "\n<TR$<tr";
        sOut += "\n<TD$<td";
        sOut += "\n</TABLE>$</table>";
        sOut += "\n</TR>$</tr>";
        sOut += "\n</TD>$</td>";
        sOut += "\n<P>$<p>";
        sOut += "\n</P>$</p>";
        sOut += "\n</BODY>$</body>";
        sOut += "\n<A HREF$<a href";
        sOut += "\n<EM>$<em>";
        sOut += "\n</EM>$</em>";
        sOut += "\n<FONT$<font";
        sOut += "\n</FONT>$</font>";
        sOut += "\n</A>$</a>";
        sOut += "\n<BR>$<br/>";

        sOut += "\n<H1>$<h1>";
        sOut += "\n</H1>$</h1>";
        sOut += "\n<H2>$<h2>";
        sOut += "\n</H2>$</h2>";
        sOut += "\n<H3>$<h3>";
        sOut += "\n</H3>$</h3>";
        sOut += "\n<H4>$<h4>";
        sOut += "\n</H4>$</h4>";
        sOut += "\n<H5>$<h5>";
        sOut += "\n</H5>$</h5>";
        sOut += "\n<H6>$<h6>";
        sOut += "\n</H6>$</h6>";

        sOut += "\n<B>$<b>";
        sOut += "\n</B>$</b>";
	} else if(sType == "ASCII"){
		sOut = "'$&apos;";
		sOut += "\n’$&apos;";
		sOut += "\n—$-";
		sOut += "\n–$-";
		sOut += "\n·$";
		sOut += "\n”$&quot;";
		sOut += "\n“$&quot;";
		sOut += "\n…$...";

	} else if(sType == "PlainTextToHtml"){
	} else if(sType == "AngleBrackets"){
		sOut += "<$&" + "lt;";
		sOut += "\n>$&" + "gt;";
	} else {
		sOut = "\\$/";
		sOut += "\n/$\\";
	}
	setTextAreaValue("txaReplacePairs", sOut);
}

function doClickInbetween(sMove){
    var tdIn = document.getElementById("td-inField");
    var tdOut = document.getElementById("td-outField");
    //a lert(sMove);
    if("LR".indexOf(sMove) != -1){
        var iChange = (sMove == "R") ? 10 : -10;
        var iTdInW = parseInt(tdIn.style.width.split("%").join(""));
        var iTdOutW = parseInt(tdOut.style.width.split("%").join(""));
        var iTdInWNew = iTdInW + iChange;
        var iTdOutWNew = iTdOutW + (iChange * -1);
        if((iTdInWNew > 10) && (iTdOutWNew > 10)){
            tdIn.style.width = iTdInWNew + "%";
            tdOut.style.width = iTdOutWNew + "%";
        }
    } else if("UD".indexOf(sMove) != -1){
        //a lert("height [" + tdOut.style.height + "]"); // Mikijuice
        //a lert("height [" + tdOut.style.width + "]");
        var iChange = (sMove == "D") ? 10 : -10;
        var isPx = false;
        var sMarker = "%";
        if(tdIn.style.height.indexOf("px") != -1){
            isPx = true;
            sMarker = "px";
            iChange *= 5;
        }
        var iTdInW = parseInt(tdIn.style.height.split(sMarker).join(""));
        //a lert(iTdInW);
        var iTdOutW = parseInt(tdOut.style.height.split(sMarker).join(""));
        var iTdInWNew = iTdInW + iChange;
        var iTdOutWNew = iTdOutW + iChange;
        //a lert(iTdInWNew + " -- " + iTdOutWNew)
        if((iTdInWNew > 10) && (iTdOutWNew > 10)){
            tdIn.style.height = iTdInWNew + sMarker;
            tdOut.style.height = iTdOutWNew + sMarker;
        }
    }
}
