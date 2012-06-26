function getTextAreaValue(sFieldName){
	return g_form[sFieldName].value;
}
function setTextAreaValue(sFieldName, sValue){
	if(sFieldName == "txaOut"){
		appendClippy(sValue);
	}
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
function getCheckboxValue(sFieldName){
	var radSrc = document.forms[0][sFieldName];
	//alert((typeof radSrc));
	//alert(radSrc.length);
	if(!radSrc){
		//alert("not there");
		return "";
	} else if ((typeof radSrc.length) == "undefined"){
		//alert("single");
		return (radSrc.checked) ? radSrc.value : "";
	} else {
		//alert("multi");
		var asOut = new Array();
		for(var iRC = 0; iRC < radSrc.length; iRC++){
			if(radSrc[iRC].checked){
				//alert(radSrc[iRC].value + " %% " + (typeof radSrc[iRC]));
				asOut[asOut.length] = radSrc[iRC].value;
			}
		}
		return asOut.join(",");
	}
	return "";
}
