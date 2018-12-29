cat global-input-comment.txt > extension/global-input-message.js
curl https://unpkg.com/global-input-message@1.6.2/distribution/globalinputmessage.min.js >> extension/global-input-message.js
cat qr-code-comment.txt > extension/qrcode.js
curl https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs@04f46c6a0708418cb7b96fc563eacae0fbf77674/qrcode.min.js >> extension/qrcode.js
