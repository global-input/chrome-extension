sed '/module.exports = QRCode;/d'  node_modules/davidshimjs-qrcodejs/qrcode.js > extension/qrcode.js
cp node_modules/global-input-message/distribution/globalinputmessage.js extension/
cat application-controls/*.js > extension/application-controls.js
