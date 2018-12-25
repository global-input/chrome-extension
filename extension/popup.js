
var globalInputChromeExtension={

  pagedata:{},
  /* The entry function for initiasing the extensions script */
    onDocumentLoaded:function(){
          this.contentContainer=document.getElementById('content');
          var connectButton = document.getElementById('connectToGlobalInputApp');
          connectButton.addEventListener("click", this.connectToGlobalInputApp.bind(this));
          var that=this;
          chrome.runtime.onMessage.addListener(this.onContentMessageReceived.bind(this));
    },
    /* Messages from the content script */
    onContentMessageReceived:function(message,sender,sendResponse){
          console.log("We are not expecting to receive content message");
    },

    /* send a message to the content script  */

    sendMessageToContent:function(messageType, content){
        var that=this;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {messageType:messageType,content:content}, that.onReplyMessageReceived.bind(that));
        });
    },
    /*this will be called when the 'connect to mobile' button is clicked  */
    connectToGlobalInputApp:function(){
        this.showInitialising();
        this.sendMessageToContent("get-page-config");
    },
    /*
    This will send the field value received from the mobile to the content script.
    */
    sendFieldValue:function(fieldId, fieldValue){
        this.sendMessageToContent("set-form-field",{fieldId:fieldId,fieldValue:fieldValue});
    },


    /*
     Receive the result of the message sent to the content script.
    */
    onReplyMessageReceived:function(message){
      this.pagedata.hostname=message.hostname;
      if(!message){
           this.contentContainer.innerText="Unable to communicate with the page content, please reload/refresh the page and try again.";
      }
      else if(message.messageType==="get-page-config"){
            this.onPageConfigDataReceived(message);
      }
      else if(message.messageType==="set-form-field"){
            //we assume it is always successful for the time being.
      }
      else{
        console.log("reply message is not recognized");
      }
    },

    /*When we got the reply from content script for our page config request*/
    onPageConfigDataReceived:function(message){
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
        if(message.status==="success"){
            globalinputConfig.initData.form=this.buildGlobalInputForm(message);
        }
        else{
            globalinputConfig.initData.form=this.buildGlobalInputCustomForm(message.host);
        }


        var globalInputApi=require("global-input-message"); //get the Global Input Api
        if(this.globalInputConnector){
            this.globalInputConnector.disconnect();
            this.globalInputConnector=null;
        }
        this.globalInputConnector=globalInputApi.createMessageConnector(); //Create the connector
        this.globalInputConnector.connect(globalinputConfig);  //connect to the proxy.

      },



/* When the Global Input App has connected to the extension */
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

        if(this.pagedata.formData){
             this.contentContainer.appendChild(this.pagedata.formData.formContainer);
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
        this.displayHostName(this.pagedata.hostname);
        var qrcodedata=this.globalInputConnector.buildInputCodeData();
        console.log("code data:[["+qrcodedata+"]]");
        this.displayPageQRCode(qrcodedata,this.formType);
      },


    buildGlobalInputForm:function(message){
        this.extensionForm=null;
        var form={
             id:message.content.form.id,
             title:message.content.form.title,
             fields:[]
        };
        var that=this;
        for(var i=0;i<message.content.form.fields.length;i++){
                var field=message.content.form.fields[i];
                var nField={
                                id:field.id,
                                label:field.label,
                                type:field.type,
                                operations:{
                                    contetFormId:field.id,
                                    onInput:function(value){
                                        that.sendFieldValue(this.contetFormId,value);
                                    }
                               }

                }
                if(nField.type==='button'){
                    nField.id=null; //Global Input App will not store its value if it does not have id
                }
                form.fields.push(nField);
             }
        return form;
    },



    buildGlobalInputField:function(fieldOpts){
            var that=this;
            var opts={
                label:fieldOpts.label,
                id:fieldOpts.id,
                type:fieldOpts.type,
                placeholder:fieldOpts.placeholder
            }
            var inputContainer=this.createOneInputField(opts);
            this.pagedata.formData.fields.push({id:fieldOpts.id,formElement:opts.element});
            this.pagedata.formData.formContainer.appendChild(inputContainer);
            var formfield={
                  label:fieldOpts.label,
                  id:fieldOpts.id,
                  type:fieldOpts.type==='password'?'secret':"text",
                  operations:{
                        onInput:function(newValue){
                          for(var i=0;i<that.pagedata.formData.fields.length;i++){
                              var field=that.pagedata.formData.fields[i];
                              if(field.id===this.fieldId){
                                  field.formElement.value=newValue;
                                  break;
                              }
                          }
                        }
                  }
             };
            formfield.operations.fieldId=formfield.id;
            return formfield;
    },

    /* Build a custom form when a form is not found on the page */
    buildGlobalInputCustomForm:function(hostname){

          this.pagedata.formData={
              fields:[],
              formContainer:document.createElement('div'),
              messageElement:document.createElement('div')
          };

          var form={
                id:    "###username###"+"@"+hostname, // unique id for saving the form content on mobile automating the form-filling process.
                title: "Sign In on "+hostname,  //Title of the form displayed on the mobile
                fields:[]
          };

          var formfield=this.buildGlobalInputField({
                label:"Username",
                id:"username",
                type:"text",
                placeholder:'Enter Username'
           });
           form.fields.push(formfield);

           formfield=this.buildGlobalInputField({
                  label:"Password",
                  id:"password",
                  type:"password",
                  placeholder:'Enter Password'
           });
           form.fields.push(formfield);

          formfield=this.buildGlobalInputField({
                      label:"Account",
                      id:"account",
                      type:"text",
                      placeholder:'Enter Account Number if any'
          });
          form.fields.push(formfield);

          formfield=this.buildGlobalInputField({
                          label:"Note",
                          id:"note",
                          type:"text",
                          placeholder:'Enter Optional Note'
          });
          form.fields.push(formfield);

          return form;
  },




    createOneInputField:function(opts){
          var that=this;
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
                  that.pagedata.formData.messageElement.innerText="The "+opts.id+" is copied into the clipboard";
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
      }

};
document.addEventListener('DOMContentLoaded',  globalInputChromeExtension.onDocumentLoaded.bind(globalInputChromeExtension));
