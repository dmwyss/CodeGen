function setCookie(sCookieName, sCookieValue, iDaysToLast){

	var dtToday = new Date();
	if(isNaN(iDaysToLast)){
		iDaysToLast = -1;
	}
	if (iDaysToLast != -1){
		iDaysToLast = iDaysToLast * 1000 * 60 * 60 * 24;
	}
	var dtExpiryDate = new Date(dtToday.getTime() + (iDaysToLast));
	var sOut = "";
	sOut += sCookieName + "=" +escape(sCookieValue);
	if(iDaysToLast != -1){
		sOut += ";expires=" + dtExpiryDate.toGMTString();
	}
	document.cookie = sOut;
}

function deleteCookie(sCookieName, sCookieValue, iDaysToLast){
	setCookie(sCookieName, "", 0);
}

function getCookie(sCookieName){
	var sCookieName = sCookieName;
	var iStartPos = document.cookie.indexOf( sCookieName + "=" );
	var iLength = iStartPos + sCookieName.length + 1;
	if ((!iStartPos) && (sCookieName != document.cookie.substring( 0, sCookieName.length))) {
		return "";
	}
	if (iStartPos == -1) return "";
	var iEndPos = document.cookie.indexOf(";", iLength );
	if (iEndPos == -1) iEndPos = document.cookie.length;
	return unescape(document.cookie.substring(iLength, iEndPos));
}