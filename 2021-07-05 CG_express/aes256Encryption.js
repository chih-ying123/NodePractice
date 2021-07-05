
var CryptoJS = require("crypto-js");

// Encryption
var Encrypt = function Encrypt(str, ikey, iiv){

	// convert iv, key to base64 bytes
	ikey = CryptoJS.enc.Base64.parse(ikey);
	iiv = CryptoJS.enc.Base64.parse(iiv);
	 
	var encrypted = CryptoJS.AES.encrypt(str, ikey, {
		iv: iiv,
		mode: CryptoJS.mode.CBC,					// mode: CBC、CFB、CTR、ECB、OFB, default is CBC
		padding: CryptoJS.pad.Pkcs7					// padding: Pkcs7、AnsiX923、Iso10126、NoPadding、ZeroPadding, default is Pkcs7
	});
	 
	// to string
	encrypted = encrypted.toString();
	return encrypted; 
}

// Decryption
var Decrypt = function Decrypt(str, ikey, iiv){
	
	// convert iv, key to base64 bytes
	ikey = CryptoJS.enc.Base64.parse(ikey);
	iiv = CryptoJS.enc.Base64.parse(iiv);
	
	var decrypted = CryptoJS.AES.decrypt(str, ikey, {
		iv: iiv,
		mode: CryptoJS.mode.CBC,					// mode: CBC、CFB、CTR、ECB、OFB, default is CBC
		padding: CryptoJS.pad.Pkcs7					// padding: Pkcs7、AnsiX923、Iso10126、NoPadding、ZeroPadding, default is Pkcs7
	});
	
	// convert to utf8 string
	decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
	return decrypted; 
}

module.exports.Encrypt = Encrypt;
module.exports.Decrypt = Decrypt;
