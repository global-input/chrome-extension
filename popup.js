
var globalInput={
        onDocumentLoaded:function(){
              this.contentContainer=document.getElementById('content');
              var operateOnThisPageButton = document.getElementById('operateOnThisPage');
              operateOnThisPageButton.addEventListener("click", this.onOperateOnThisPageButtonCicked.bind(this));
              var that=this;
              chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse) {
                          that.processMessageResponse(request);
                          sendResponse({action: "delivered"});
                    });
              this.sendMessageToContentScript({action:"onPopWindowOpenned"})

        },
        onOperateOnThisPageButtonCicked:function(){
              this.sendMessageToContentScript({action:"connect"})
        },
        sendMessageToContentScript:function(message){
            var that=this;
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, message, that.processMessageResponse.bind(that));
            });
        },
        processMessageResponse:function(response){
            if(!response){
                 this.contentContainer.innerText="Unable to communicate with the page content, please reload/refresh the page and try again.";
            }
            else if(response.action==='displayQRCode'){
                  this.displayHostName(response);
                  this.displayPageQRCode(response.qrcodedata,response.formType);
            }
            else if(response.action==='senderConnected'){
                  this.onSenderConnected(response.senders,response.formType,response.data);
            }
            else if(response.action==='senderDisconnected'){
                  this.onSenderDisconnected(response.senders,response.formType,response.data);
            }
            else if(response.action==='setformvalue'){
                  this.onSetFormValues(response.fieldname,response.fieldvalue);
            }

        },
        onSetFormValues:function(fieldname,fieldvalue){
                if(fieldname==='username'){
                      if(this.usernameElement){
                          this.usernameElement.value=fieldvalue;
                      }
                }
                else if(fieldname==='password'){
                      if(this.passwordElement){
                          this.passwordElement.value=fieldvalue;
                      }
                }
        },

        onSenderConnected:function(senders,formType,data){
             this.contentContainer.innerHTML="";
             var message="Sender Connected ("+senders.length+"):";
             message+=senders[0].client;
             if(senders.length>1){
               for(var i=1;i<senders.length;i++){
                   message+", ";
                   message+=senders[i].client;
               }
             }

             if(formType==='usernamepassword'){
                  var signInFormElement=this.createInputForm();
                  this.contentContainer.appendChild(signInFormElement);
                  if(data){
                      this.onSetFormValues("username",data.username);
                      this.onSetFormValues("password",data.password);
                  }
                  document.body.style.height="100px";
             }
             else{
                document.body.style.height="50px";
              }
              var messageElement=this.createMessageElement(message);
              this.contentContainer.appendChild(messageElement);
       },
       onSenderDisconnected:function(senders){
               var message="Sender Disconnected ("+senders.length+"):";
               message+=senders[0].client;
               if(senders.length>1){
                 for(var i=1;i<senders.length;i++){
                     message+", ";
                     message+=senders[i].client;
                 }
               }
               this.displayMessage(message);
       },


       displayMessage:function(message){
          var messageContainer = document.getElementById('message');
          if(messageContainer){
                messageContainer.innerText=message;
          }
          else{
            console.error("failed to display the error message:"+message);
          }
      },
      displayHostName:function(response){
          var hostnameContainer=document.getElementById('hostname');
          if(hostnameContainer){
              hostnameContainer.innerText="("+response.hostname+")";
          }
       },
      displayPageQRCode:function(codeData, formType){
            this.contentContainer.innerHTML="";
            var message="Global Input is now enabled! Please scan the following QR code with the Global Input App on your mobile to connect to the page, so you can operate on the page with your mobile.";
            if(formType!=='pageControl'){
              message="The elements in the page are not identified. You can still scan the following QR code with the Global Input app on your mobile and transfer the content to this popup window first and then do copy and paste operations. If you would like to interact with the page directly with your mobile, the footprint of this page needs to be added to the script. This can be done easily with a little bit of Javascript knowledge. If you need help on this, please send a message to dilshat@iterativesolution.co.uk."
            }

            var messageElement=this.createMessageElement(message);
            this.contentContainer.appendChild(messageElement);
            var qrCodeContainerElement=this.createQRCode(codeData);
            this.contentContainer.appendChild(qrCodeContainerElement);
            document.body.style.height="500px";
       },
       createQRCode:function(qrCodedata){
           var qrCodeContainer = document.createElement('div');
           qrCodeContainer.id="qrcode"; //this is where the QR code will be generated
           qrCodeContainer.style.display='flex';
           qrCodeContainer.style['display-direction']='row';
           qrCodeContainer.style['justify-content']='center';
           qrCodeContainer.style['z-index']=1000;
           qrCodeContainer.textContent = '';
           var qrcode = new QRCode(qrCodeContainer, {
                         text: qrCodedata,
                         width:300,
                         height: 300,
                         colorDark : "#000000",
                         colorLight : "#ffffff",
                         correctLevel : QRCode.CorrectLevel.H
                      });

           return qrCodeContainer;
       },



        createMessageElement:function(message){
              var messageContainer = document.createElement('div');
              messageContainer.id="message";
              messageContainer.innerText=message;
              return messageContainer;
        },





        createInputForm:function(){
              var formContainer = document.createElement('div');
              formContainer.id="form";


              var messageElement = document.createElement('div');


                  var inputContainer=document.createElement('div');
                  inputContainer.className = "field";
                      var labelElement = document.createElement('label');
                      labelElement.innerText="Username";
                  inputContainer.appendChild(labelElement);
                      this.usernameElement = document.createElement('input');
                      this.usernameElement.id="username";
                      this.usernameElement.type="text";
                      this.usernameElement.value = '';
                      this.usernameElement.placeholder = 'Enter Username';
                   inputContainer.appendChild(this.usernameElement);


                       var copyButtonElement = document.createElement('button');


                       copyButtonElement.id="copyusername";


                       copyButtonElement.innerText="Copy to Clipboard";

                       var that=this;
                       copyButtonElement.onclick=function(){
                              that.usernameElement.select();
                              document.execCommand("Copy");
                              messageElement.innerText="The username is copied into the clipboard";
                       };
                    inputContainer.appendChild(copyButtonElement);

             formContainer.appendChild(inputContainer);

                   var inputContainer=document.createElement('div');
                   inputContainer.className = "field";
                       var labelElement = document.createElement('label');
                       labelElement.innerText="Password";
                   inputContainer.appendChild(labelElement);
                       this.passwordElement = document.createElement('input');
                       this.passwordElement.id="password";
                       this.passwordElement.type="password";
                       this.passwordElement.value = '';
                       this.passwordElement.placeholder = 'Enter Password';
                    inputContainer.appendChild(this.passwordElement);


                    var copyButtonElement = document.createElement('button');


                    copyButtonElement.id="copypassword";


                    copyButtonElement.innerText="Copy to Clipboard";

                    var that=this;
                    copyButtonElement.onclick=function(){
                           that.passwordElement.select();
                           document.execCommand("Copy");
                           messageElement.innerText="The password is copied into the clipboard";
                    };
              inputContainer.appendChild(copyButtonElement);

              formContainer.appendChild(inputContainer);
              formContainer.appendChild(messageElement);
              return formContainer;
        },



};
document.addEventListener('DOMContentLoaded',  globalInput.onDocumentLoaded.bind(globalInput));
