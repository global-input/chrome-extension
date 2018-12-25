
var globalInputChromeExtension={
    onDocumentLoaded:function(){
          this.contentContainer=document.getElementById('content');
          var connectButton = document.getElementById('connectToGlobalInputApp');
          connectButton.addEventListener("click", this.connectToGlobalInputApp.bind(this));
          var that=this;
          chrome.runtime.onMessage.addListener(this.onContentMessageReceived.bind(this));
    },
    sendMessageToContent:function(messageType, content){
        var that=this;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {messageType:messageType,content:content}, that.onReplyMessageReceived.bind(that));
        });
    },


    onReplyMessageReceived:function(message){
      if(!message){
           this.contentContainer.innerText="Unable to communicate with the page content, please reload/refresh the page and try again.";
      }
      else if(message.messageType==="get-page-config"){
            this.onPageConfigDataReceived(message.content);
      }
      else{
        console.log("reply message is not recognized");
      }
    },
      onContentMessageReceived(message,sender,sendResponse){
            console.log("We are not expecting to receive content message");
            // sendResponse({messageType:messageType,content:content});
            // this.replyToContent(sendResponse,"default",{status:"success"});
      },

      connectToGlobalInputApp:function(){
          this.showInitialising();
          this.sendMessageToContent("get-page-config");
      },


      onSenderConnected:function(sender, senders){
        this.contentContainer.innerHTML="";
        var message="Sender Connected ("+senders.length+"):";
        message+=senders[0].client;
        if(senders.length>1){
          for(var i=1;i<senders.length;i++){
              message+", ";
              message+=senders[i].client;
          }
        }

        if(this.formData){
             this.contentContainer.appendChild(this.formData.formContainer);
             document.body.style.height="100px";
        }
        else{
           document.body.style.height="50px";
         }
         var messageElement=this.createMessageElement(message);
         this.contentContainer.appendChild(messageElement);
      },
      onSenderDisconnected:function(sender, senders){
      },
      onWebSocketConnect:function(){
        console.log("connected**************");
        this.displayHostName(this.hostname);
        var qrcodedata=this.globalInputConnector.buildInputCodeData();
        console.log("code data:[["+qrcodedata+"]]");
        this.displayPageQRCode(qrcodedata,this.formType);
      },

    sendFieldValue:function(fieldId, fieldValue){
        this.sendMessageToContent("set-form-field",{fieldId:fieldId,fieldValue:fieldValue});
    },
    buildGlobalInputForm:function(content){
        if(!content.form){
              return null;
        }
        this.extensionForm=null;

        var form={
             id:content.form.id,
             title:content.form.title,
             fields:[]
        };
        var that=this;
        for(var i=0;i<content.form.fields.length;i++){
                var nField={
                                id:content.form.fields[i].id,
                                label:content.form.fields[i].label,
                                type:content.form.fields[i].type,
                                operations:{
                                    contetFormId:content.form.fields[i].id,
                                    onInput:function(value){
                                        that.sendFieldValue(this.contetFormId,value);
                                    }
                               }

                }
                if(nField.type==='button'){
                    nField.id=null;
                }
                form.fields.push(nField);
             }
        return form;
    },



    buildGlobalInputField:function(fieldOpts){
            var that=this;
            var opts={
                messageElement:fieldOpts.messageElement,
                label:fieldOpts.label,
                id:fieldOpts.id,
                type:fieldOpts.type,
                placeholder:fieldOpts.placeholder
            }
            var inputContainer=this.createOneInputField(opts);
            var formElement=opts.element;
            this.formData.fields.push({id:fieldOpts.id,formElement:formElement});
            fieldOpts.formData.formContainer.appendChild(inputContainer);
            var formfield={
                  label:fieldOpts.label,
                  id:fieldOpts.id,
                  type:fieldOpts.type==='password'?'secret':"text",
                  operations:{
                        onInput:function(newValue){
                          for(var i=0;i<that.formData.fields.length;i++){
                              var field=that.formData.fields[i];
                              if(field.id===this.fieldId){
                                  field.formElement.value=newValue;
                                  break;
                              }
                          }
                        }
                  }
             };
            formfield.operations.fieldId=formfield.id;
            fieldOpts.form.fields.push(formfield);
    },
    buildGlobalInputCustomForm:function(content){
      var formContainer = document.createElement('div');
      this.formData={
          fields:[],
          formContainer:formContainer
      };

      var that=this;

      formContainer.id="form";
      var messageElement = document.createElement('div');
      var form={
            id:    "###username###"+"@"+content.host, // unique id for saving the form content on mobile automating the form-filling process.
            title: "Sign In on "+content.host,  //Title of the form displayed on the mobile
            fields:[]
      };

      this.buildGlobalInputField({formData:this.formData,
            form:form,
            messageElement:messageElement,
            label:"Username",
            id:"username",
            type:"text",
            placeholder:'Enter Username'
        });

     this.buildGlobalInputField({formData:this.formData,
              form:form,
              messageElement:messageElement,
              label:"Password",
              id:"password",
              type:"password",
              placeholder:'Enter Password'
    });

    this.buildGlobalInputField({formData:this.formData,
                form:form,
                messageElement:messageElement,
                label:"Account",
                id:"account",
                type:"text",
                placeholder:'Enter Account Number if any'
    });

  this.buildGlobalInputField({formData:this.formData,
                  form:form,
                  messageElement:messageElement,
                  label:"Note",
                  id:"note",
                  type:"text",
                  placeholder:'Enter Optional Note'
  });
  return form;
  },
  onPageConfigDataReceived:function(content){
        var that=this;
      var globalinputConfig={
                     onSenderConnected:this.onSenderConnected.bind(this),
                     onSenderDisconnected:this.onSenderDisconnected.bind(this),
                     onRegistered:(next)=>{
                                  next();
                                  this.onWebSocketConnect();
                     },
                     initData:{
                       form:null,
                       action:"input",
                       dataType:"form",
                     },
      };
      globalinputConfig.initData.form=this.buildGlobalInputForm(content);
      if(!globalinputConfig.initData.form){
          globalinputConfig.initData.form=this.buildGlobalInputCustomForm(content);
      }
      var globalInputApi=require("global-input-message"); //get the Global Input Api
      if(this.globalInputConnector){
          this.globalInputConnector.disconnect();
          this.globalInputConnector=null;
      }
      this.globalInputConnector=globalInputApi.createMessageConnector(); //Create the connector
      this.globalInputConnector.connect(globalinputConfig);  //connect to the proxy.

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
    createMessageElement:function(message){
          var messageContainer = document.createElement('div');
          messageContainer.id="message";
          messageContainer.innerText=message;
          return messageContainer;
    },





    /*****************************************OLD*************************************/
      oldSendMessageToContent:function(message){

        var that=this;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, message, that.onReplyMessageReceived.bind(that));
        });

      },
        connectToGlobalInput:function(){
              this.oldSendMessageToContent({action:"connect"})
        },
        sendInputMessage:function(value,index){
          this.oldSendMessageToContent({action:"sendInputMessage",value:value,index:index});
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

        onSenderConnectedOld:function(senders,formType,data){
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
       onSenderDisconnectedOld:function(senders){
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
      displayHostName:function(hostname){
          var hostnameContainer=document.getElementById('hostname');
          if(hostnameContainer){
              hostnameContainer.innerText="("+hostname+")";
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
       showInitialising:function(){
             this.contentContainer.innerHTML="";
             var message="Initialising.....";
             var messageElement=this.createMessageElement(message);
             this.contentContainer.appendChild(messageElement);
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
document.addEventListener('DOMContentLoaded',  globalInputChromeExtension.onDocumentLoaded.bind(globalInputChromeExtension));
