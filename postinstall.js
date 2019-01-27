var concat=require("concat");
var copyfiles=require("copyfiles");
var replace = require("replace");

concat("application-controls",'extension/application-controls.js');
copyfiles(['./node_modules/global-input-message/distribution/globalinputmessage.js','./node_modules/davidshimjs-qrcodejs/qrcode.js',"./extension"], {up:true},function(err){
  if(err){
      console.error(err);
  }
    replace({
      regex:"module.exports = QRCode;",
      replacement:"",
      paths:["./extension/qrcode.js"],
      recursive:false,
      silen:true
    });

});
