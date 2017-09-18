(function(){

  var createQRCodePlaceHolder=function(logincontainer){
    var div = document.createElement('div');
    div.id="qrcode";
    div.textContent = '';
    logincontainer.appendChild(div);

    div = document.createElement('div');
    div.id="globalInputMessage";
    div.textContent = '';
    logincontainer.appendChild(div);

  }
   var globalinput={
     api:require("global-input-message")
   };
   var loginContainer=document.getElementById("login-container");
   var os_username=document.getElementById("os_username");
   var os_password=document.getElementById("os_password");
   var loginButton=document.getElementById("loginButton");
   if(loginContainer && os_username && os_password){
          createQRCodePlaceHolder(loginContainer);
          globalinput.config={
                                onSenderConnected:function(){
                                    document.getElementById("globalInputMessage").innerHTML="Device connected";
                                },
                                onSenderDisconnected:function(){
                                    document.getElementById("globalInputMessage").innerHTML="Device disconnected";
                                },
                                initData:{

                                    form:{
                                      id:  "yp6yAPMEUcmtNDi25@"+window.location.host,
                                      title: "Confluence Sign In",
                                      fields:[{
                                                label:"Username",
                                                id:"username",
                                                operations:{
                                                    onInput:function(username){
                                                         os_username.value=username;
                                                    }
                                                }

                                              },{
                                                 label:"Password",
                                                 id:"password",
                                                 type:"secret",
                                                 operations:{
                                                   onInput:function(password){
                                                     os_password.value=password;
                                                   }
                                                 }

                                              },{
                                                 label:"Login",
                                                 type:"button",
                                                 operations:{
                                                    onInput:function(){
                                                      if(loginButton){
                                                        loginButton.click();
                                                      }
                                                    }
                                                 }

                                              }]
                                          }
                                    }

                            };
                            globalinput.connector=globalinput.api.createMessageConnector();
                            globalinput.connector.connect(globalinput.config);
                            var codedata=globalinput.connector.buildInputCodeData();

                          var qrcode = new QRCode(document.getElementById("qrcode"), {
                            text: codedata,
                            width: 300,
                            height: 300,
                            colorDark : "#000000",
                            colorLight : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.H
                          });

   }





})();
