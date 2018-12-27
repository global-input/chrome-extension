var globalInputChromeExtension={
  pagedata:{
      hostname:"",
      contentContainer:null,
      formData:{
        formType:null,
        formContainer:null,
        fields:[],
      },
      form:null
  },

  createContentContainer:function(){
    this.pagedata.contentContainer=document.getElementById('content');
  },
  clearContent:function(){
      this.pagedata.contentContainer.innerHTML="";
  },
  setWindowHeight:function(height){
        document.body.style.height=height+"px";
  },
  appendForm:function(){
      this.appendElement(this.pagedata.formData.formContainer);
      this.setWindowHeight(100);
  },
  appendMessage:function(message){
    var messageElement=this.createMessageElement(message);
    this.appendElement(messageElement);
  },
  appendElement(element){
    this.pagedata.contentContainer.appendChild(element);
  },
  appendResetButton:function(message){
    var buttonElement=this.createOneButton({label:"Reset", onclick:this.resetAll.bind(this)});
    this.appendElement(buttonElement);
  },
  displayMessage:function(message){
    this.clearContent();
    this.setWindowHeight(50);
    this.appendMessage(message);
  },
  displayForm:function(message){
      this.clearContent();
      this.appendForm();
      this.appendMessage(message);
  },
  appendQRCode:function(qrcodeData){
        var qrCodeContainerElement=this.createQRCode(qrcodeData);
        this.pagedata.contentContainer.appendChild(qrCodeContainerElement);
  },
  displayPageQRCode:function(codeData, message){
        this.clearContent();
        this.appendQRCode(codeData);
        this.appendMessage(message);
        this.setWindowHeight(500);

   },
  displayInitialising:function(){
         this.clearContent();
         this.appendMessage("Initialising.....");
  },
  displayHostName:function(){
          var hostnameContainer=document.getElementById('hostname');
          if(hostnameContainer){
              hostnameContainer.innerText="("+this.pagedata.hostname+")";
          }
  },
  setFormFieldValue:function(fieldId,newValue){
      for(var i=0;i<this.pagedata.formData.fields.length;i++){
          if(this.pagedata.formData.fields[i].id===fieldId){
              this.pagedata.formData.fields[i].formElement.value=newValue;
              break;
          }
      }
      this.sendMessageToContent("set-cache-field",{fieldId:fieldId,fieldValue:newValue}, function(message){
        //nothing to do at the moment
      });
  },
  displayCacheFormPage(message){
    for(var i=0;i<message.content.cachefields.length;i++){
        var field=message.content.cachefields[i];
        this.setFormFieldValue(field.id,field.value);
    }
    this.pagedata.formData.formType='cached-form';
    this.displayForm("Global Input App Disconnected");
    this.appendResetButton();
  },
  isCopyPasteForm:function(){
      return this.pagedata.formData.formType==='copy-and-paste';
  },
  addFormElement:function(fieldId, formElement,inputContainer){
      this.pagedata.formData.fields.push({id:fieldId,formElement:formElement});
      this.pagedata.formData.formContainer.appendChild(inputContainer);
  },




  /* The entry function for initiasing the extensions script */
    onDocumentLoaded:function(){
          this.createContentContainer();
          var connectButton = document.getElementById('connectToGlobalInputApp');
          connectButton.addEventListener("click", this.connectToGlobalInputApp.bind(this));
          var that=this;
          chrome.runtime.onMessage.addListener(this.onContentMessageReceived.bind(this));
          this.checkPageStatus();

    },
    checkPageStatus:function(){
        var that=this;

        this.sendMessageToContent('check-page-status',null, function(message){
            if(!message){
                that.displayMessage("Unable to communicate with the page content, please reload/refresh the page and try again.");
            }
            else{
                that.initPageData(message);
                var settingsButton = document.getElementById('settings');
                settingsButton.addEventListener("click", that.displaySettings.bind(that));
            }

        })
    },
    getGlobalInputSettings:function(){
      var globalInputSettings={
          url:   localStorage.getItem("globaliput.url"),
          apikey:localStorage.getItem("globaliput.apikey"),
      };
      if(!globalInputSettings.url){
          globalInputSettings.url="https://globalinput.co.uk";
      }
      if(!globalInputSettings.apikey){
          globalInputSettings.apikey="k7jc3QcMPKEXGW5UC";
      }
      return globalInputSettings;

    },
    displaySettings:function(){

      var globalInputSettings=this.getGlobalInputSettings();
      this.clearContent();


      var opts={
          label:"URL:",
          id:"globlaInputURL",
          type:"text",
          placeholder:"WebSocket Server URL",
          value:globalInputSettings.url,
          clipboard:false
      }
      var inputContainer=this.createInputField(opts);
      



      this.pagedata.contentContainer.appendChild(inputContainer);






    },
    initPageData:function(message){
            this.pagedata.formData.formContainer=document.createElement('div');
            this.pagedata.hostname=message.host;
            this.pagedata.form=this.buildCopyAndPasteGlobalInputForm(message);
            this.displayHostName();
            if(message.content.cachefields){
                this.displayCacheFormPage(message);
            }
            else{

            }
    },
    resetAll:function(){
      var that=this;
        this.sendMessageToContent("reset",null,function(message){
            that.connectToGlobalInputApp();

        });


    },

    /* Messages from the content script */
    onContentMessageReceived:function(message,sender,sendResponse){
          console.log("We are not expecting to receive content message");
    },

    /* send a message to the content script  */

    sendMessageToContent:function(messageType, content,callback){
        var that=this;
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {messageType:messageType,content:content}, callback);
        });
    },
    /*this will be called when the 'connect to mobile' button is clicked  */
    connectToGlobalInputApp:function(){
        this.displayInitialising();
        this.sendMessageToContent("get-page-config",null,this.executeConnectToGlobalInputApp.bind(this));
    },
    /*Connect to Global Input App after we got the reply from the content script*/
    executeConnectToGlobalInputApp:function(message){
        if(!message){
          this.displayMessage("Unable to communicate with the page content, please reload/refresh the page and try again.");
        }
        this.pagedata.hostname=message.host;
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
            globalinputConfig.initData.form=this.buildContentGlobalInputForm(message);
            this.pagedata.formData.formType='content-form';

        }
        else{
            globalinputConfig.initData.form=this.pagedata.form;
            this.pagedata.formData.formType='copy-and-paste';
        }
        var globalInputApi=require("global-input-message"); //get the Global Input Api
        if(this.globalInputConnector){
            this.globalInputConnector.disconnect();
            this.globalInputConnector=null;
        }
        this.globalInputConnector=globalInputApi.createMessageConnector(); //Create the connector
        this.globalInputConnector.connect(globalinputConfig);  //connect to the proxy.

      },
    /*
    This will send the field value received from the mobile to the content script.
    */
    sendFieldValue:function(fieldId, fieldValue){
      var that=this;
        this.sendMessageToContent("set-form-field",{fieldId:fieldId,fieldValue:fieldValue}, function(message){
            that.connectToGlobalInputApp();
        });
    },





/* When the Global Input App has connected to the extension */
      onSenderConnected:function(sender, senders){

        var message="Sender Connected ("+senders.length+"):";
        message+=senders[0].client;
        if(senders.length>1){
          for(var i=1;i<senders.length;i++){
              message+", ";
              message+=senders[i].client;
          }
        }
        if(this.isCopyPasteForm()){
            this.displayForm(message);
        }
        else{
            this.displayMessage(message);
        }
      },
      onSenderDisconnected:function(sender, senders){

      },
      onWebSocketConnect:function(){
        console.log("connected**************");
        var qrcodedata=this.globalInputConnector.buildInputCodeData();
        console.log("code data:[["+qrcodedata+"]]");

        var message="Global Input is now enabled! Please scan the QR code above with the Global Input App on your mobile to connect to the page, so you can operate on the page with your mobile.";
        if(this.isCopyPasteForm()){
              message="The elements in the page are not identified. You can still scan the following QR code with the Global Input app on your mobile and transfer the content to this popup window first and then do copy and paste operations. If you would like to interact with the page directly with your mobile, the footprint of this page needs to be added to the script. This can be done easily with a little bit of Javascript knowledge. If you need help on this, please send a message to dilshat@iterativesolution.co.uk."
        }
        this.displayPageQRCode(qrcodedata,message);
      },


    buildContentGlobalInputForm:function(message){
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
                placeholder:fieldOpts.placeholder,
                value:"",
                clipboard:true
            }
            var inputContainer=this.createInputField(opts);
            this.addFormElement(fieldOpts.id,opts.element,inputContainer);

            var formfield={
                  label:fieldOpts.label,
                  id:fieldOpts.id,
                  type:fieldOpts.type==='password'?'secret':"text",
                  operations:{
                        onInput:function(newValue){
                              that.setFormFieldValue(this.fieldId,newValue);
                        }
                  }
             };
            formfield.operations.fieldId=formfield.id;
            return formfield;
    },

    /* Build a custom form when a form is not found on the page */
    buildCopyAndPasteGlobalInputForm:function(message){


          var hostname=message.host;
          var form={
                id:    "###username###"+"@"+hostname, // unique id for saving the form content on mobile automating the form-filling process.
                title: "Sign In on "+hostname,  //Title of the form displayed on the mobile
                fields:[],
          };

          var formfield=this.buildGlobalInputField({
                label:"Username",
                id:"username",
                type:"text",
                placeholder:'Enter Username',
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
                      placeholder:'Enter Account Number if any',
          });
          form.fields.push(formfield);

          formfield=this.buildGlobalInputField({
                          label:"Note",
                          id:"note",
                          type:"text",
                          placeholder:'Enter Optional Note',
          });
          form.fields.push(formfield);

          return form;
  },

    createInputField:function(opts){
      var inputRowContainer=document.createElement('div');
      inputRowContainer.className = "fielrow";

            var inputContainer=document.createElement('div');
                  inputContainer.className = "field";
                  var labelElement = document.createElement('label');
                  labelElement.innerText=opts.label;
            inputContainer.appendChild(labelElement);
                  var element = document.createElement('input');
                  element.id=opts.id;
                  element.type=opts.type;
                  element.value = opts.value;
            inputContainer.appendChild(element);
            opts.element=element;




            if(opts.clipboard){
                  var copyButtonElement = document.createElement('button');
                  copyButtonElement.className="copybutton";
                  copyButtonElement.innerText="Copy";
                  copyButtonElement.onclick=function(){

                        element.type='text';
                        element.select();
                        document.execCommand("Copy");
                        element.type=opts.type;
                        copyButtonElement.disabled=true;
                        var messageElement=document.createElement('div');
                        messageElement.innerText="The "+opts.id+" is copied into the clipboard";
                        inputRowContainer.appendChild(messageElement);
                        setTimeout(function(){
                              inputRowContainer.removeChild(messageElement);
                              copyButtonElement.disabled=false;
                        },2000);
                  };
                  inputContainer.appendChild(copyButtonElement);
            }
      inputRowContainer.appendChild(inputContainer);
      return inputRowContainer;

    },




    createOneButton:function(opts){
          var that=this;
          var inputContainer=document.createElement('div');
          inputContainer.className = "field";

           var buttonElement = document.createElement('button');
           buttonElement.className='controlButton';
           buttonElement.innerText=opts.label;
           buttonElement.onclick=function(){
                opts.onclick();
           };
        inputContainer.appendChild(buttonElement);
        return inputContainer;
    },
    createMessageElement:function(message){
          var messageContainer = document.createElement('div');
          messageContainer.id="message";
          messageContainer.innerText=message;
          return messageContainer;
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
