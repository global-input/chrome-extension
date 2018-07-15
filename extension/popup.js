
var globalInput={
        onDocumentLoaded:function(){
              this.contentContainer=document.getElementById('content');
              var connectButton = document.getElementById('operateOnThisPage');
              connectButton.addEventListener("click", this.connectToGlobalInput.bind(this));
              var that=this;
              chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse) {
                          that.processMessageResponse(request);
                          sendResponse({action: "delivered"});
                    });
              this.sendMessageToContentScript({action:"onPopWindowOpenned"})

        },
        connectToGlobalInput:function(){
              this.sendMessageToContentScript({action:"connect"})
        },
        sendInputMessage:function(value,index){
          this.sendMessageToContentScript({action:"sendInputMessage",value:value,index:index});
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
                else if(fieldname==='account'){
                      if(this.accountElement){
                          this.accountElement.value=fieldvalue;
                      }
                }
                else if(fieldname==='note'){
                      if(this.noteElement){
                          this.noteElement.value=fieldvalue;
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
                      this.onSetFormValues("account",data.account);
                      this.onSetFormValues("note",data.note);
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
               if((!senders) || (!senders.length)){
                    this.displayMessage("Clients disconnected");
                    this.clearAllCustomeFields();
               }
               else{
                 var message="Sender Disconnected ("+senders.length+"):";
                 message+=senders[0].client;
                 if(senders.length>1){
                   for(var i=1;i<senders.length;i++){
                       message+", ";
                       message+=senders[i].client;
                   }
                 }
                 this.displayMessage(message);
               }

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




        createOneInputField:function(opts){
              var inputContainer=document.createElement('div');
              inputContainer.className = "field";
                  var labelElement = document.createElement('label');
                  labelElement.innerText=opts.label;
              inputContainer.appendChild(labelElement);

              opts.element = document.createElement('input');
              opts.element.id=opts.id;
              opts.element.type=opts.type;
              opts.element.value = '';
              opts.element.placeholder = opts.placeholder;
           inputContainer.appendChild(opts.element);

               var copyButtonElement = document.createElement('button');
               copyButtonElement.className="copybutton";
               copyButtonElement.innerText="Copy to Clipboard";
               copyButtonElement.onclick=function(){
                      opts.element.type='text';
                      opts.element.select();
                      document.execCommand("Copy");
                      opts.element.type=opts.type;
                      opts.messageElement.innerText="The "+opts.id+" is copied into the clipboard";
               };
            inputContainer.appendChild(copyButtonElement);
            return inputContainer;
        },
        createInputForm:function(){
              var formContainer = document.createElement('div');
              formContainer.id="form";


              var messageElement = document.createElement('div');

              var opts={
                    messageElement:messageElement,
                    label:"Username",
                    id:"username",
                    type:"text",
                    placeholder:'Enter Username'
              }
              var inputContainer=this.createOneInputField(opts);
              this.usernameElement=opts.element;
              formContainer.appendChild(inputContainer);

              opts={
                    messageElement:messageElement,
                    label:"Password",
                    id:"password",
                    type:"password",
                    placeholder:'Enter Password'
              }
              var inputContainer=this.createOneInputField(opts);
              this.passwordElement=opts.element;
              formContainer.appendChild(inputContainer);


              opts={
                    messageElement:messageElement,
                    label:"Account",
                    id:"account",
                    type:"text",
                    placeholder:'Enter Account Number if any'
              }
              var inputContainer=this.createOneInputField(opts);
              this.accountElement=opts.element;
              formContainer.appendChild(inputContainer);

              opts={
                    messageElement:messageElement,
                    label:"Note",
                    id:"note",
                    type:"text",
                    placeholder:'Enter Optional Note'
              }
              var inputContainer=this.createOneInputField(opts);
              this.noteElement=opts.element;
              formContainer.appendChild(inputContainer);

              formContainer.appendChild(messageElement);


              return formContainer;
        },
        clearAllCustomeFields:function(){
          this.onSetFormValues("username", "");
          this.onSetFormValues("password", "");
          this.onSetFormValues("account", "");
          this.onSetFormValues("note", "");
        }



};
document.addEventListener('DOMContentLoaded',  globalInput.onDocumentLoaded.bind(globalInput));
