// NumberUtis.js

function safeGetInt(sIn, iDefault){
	if((typeof iDefault == "undefined") || (iDefault == null)){
		iDefault = 0;
	}
	if((typeof sIn == "undefined") || (sIn == null) || (sIn.length == 0) || isNaN(sIn)){
		return iDefault;
	}
	return parseInt(sIn);
}