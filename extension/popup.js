var globalInputChromeExtension={
  pagedata:{
      hostname:"",
      senders:null,
      contentContainer:null,
      formData:{
        formType:null,
        formContainer:null,
        fields:[],
      },
      form:null,
      globalInputApi:null,
      globalInputConnector:null,
  },
  initFormData:function(message){
    this.pagedata.formData.formContainer=document.createElement('div');
    this.pagedata.formData.fields=[];
    this.pagedata.hostname=message.host;
    this.pagedata.form=this.buildCopyAndPasteGlobalInputForm(message);
    this.displayHostName();

  },

  disconnectGlobalInputApp:function(){
    if(this.pagedata.globalInputConnector){
        this.pagedata.globalInputConnector.disconnect();
    }
    this.pagedata.globalInputConnector=null;
  },
  connectToGlobalInputApp:function(globalinputConfig){
    if(!this.pagedata.globalInputApi){
        this.pagedata.globalInputApi=require("global-input-message"); //get the Global Input Api
    }
    this.disconnectGlobalInputApp();
    this.pagedata.globalInputConnector=this.pagedata.globalInputApi.createMessageConnector(); //Create the connector
    this.pagedata.globalInputConnector.connect(globalinputConfig);  //connect to the proxy.
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
  appendTitle:function(title){
    var titleElement=this.creatTitleElement(title);
    this.appendElement(titleElement);

  },
  appendElement:function(element){
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
  displayCachedFormPage(message){
    for(var i=0;i<message.content.cachefields.length;i++){
        var field=message.content.cachefields[i];
        this.setFormFieldValue(field.id,field.value);
    }
    this.pagedata.formData.formType='cached-form';
    this.displayForm("Global Input App is disconnected.");
    this.appendResetButton();
  },
  isCopyPasteForm:function(){
      return this.pagedata.formData.formType==='copy-and-paste';
  },
  addFormElement:function(fieldId, formElement,inputContainer){
    var that=this;
      var onkeyup=function(){
            if(that.pagedata.globalInputConnector && that.pagedata.senders){
                  var value=this.formElement.value;
                  that.pagedata.globalInputConnector.sendInputMessage(value,this.fieldIndex);
            }

      }
      var fieldobj={
                     id:fieldId,
                     formElement:formElement,
                     fieldIndex:this.pagedata.formData.fields.length
                   };
      formElement.onkeyup=onkeyup.bind(fieldobj);
      this.pagedata.formData.fields.push(fieldobj);
      this.pagedata.formData.formContainer.appendChild(inputContainer);


  },




  /* The entry function for initiasing the extensions script */
    onDocumentLoaded:function(){
          this.createContentContainer();
          chrome.runtime.onMessage.addListener(this.onContentMessageReceived.bind(this));
          this.checkPageStatus();

    },
    appendConnectToMobileButton:function(){
      var that=this;
      var opts={
          label:"Connect to Mobile",
          onclick:function(){
              that.onClickConnectToMobile();
          }
      };
      var buttons=this.createOneButton(opts);
      this.appendElement(buttons);
    },
    appendConnectHelpMessage:function(){
      var messageContainer = document.createElement('div');
      messageContainer.innerHTML='Clicking on the button above should display a QR Code that you can scan with the Global Input App (<a href="https://play.google.com/store/apps/details?id=uk.co.globalinput&hl=en_GB" target="_blank">Google Play</a> and <a href="https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4" target="_blank">App Store</a>) on your mobile to operate with your mobile.';
      this.appendElement(messageContainer);
    },
    appendSettingsButton:function(){
      var inputContainer=document.createElement('div');
      inputContainer.id = "settingsContainer";
       var buttonElement = document.createElement('button');
       buttonElement.id='settings';
       buttonElement.innerText="Settings";
       buttonElement.onclick=function(){
          that.displaySettings();
       };
       inputContainer.appendChild(buttonElement);
       this.appendElement(inputContainer);
    },
    displayMainWindow:function(){
      this.disconnectGlobalInputApp();
      var that=this;
      this.clearContent();
      this.appendConnectToMobileButton();
      this.appendConnectHelpMessage();
      this.appendSettingsButton();
    },
    checkPageStatus:function(){
        var that=this;

        this.sendMessageToContent('check-page-status',null, function(message){
            if(!message){
                that.displayMessage("Unable to communicate with the page content, please reload/refresh the page and try again.");
            }
            else{
                that.initPageData(message);
            }

        })
    },
    getGlobalInputSettings:function(){
      var globalInputSettings={
          url:   localStorage.getItem("iterative.globaliputapp.url"),
          apikey:localStorage.getItem("iterative.globaliputapp.apikey"),
      };
      if(!globalInputSettings.url){
          globalInputSettings.url="https://globalinput.co.uk";
      }
      if(!globalInputSettings.apikey){
          globalInputSettings.apikey="k7jc3QcMPKEXGW5UC";
      }
      return globalInputSettings;

    },
    saveGlobalInputSettings:function(globalInputSettings){
        localStorage.setItem("iterative.globaliputapp.url",globalInputSettings.url);
        localStorage.setItem("iterative.globaliputapp.apikey",globalInputSettings.apikey);
    },
    displaySettings:function(){

      var that=this;
      var globalInputSettings=this.getGlobalInputSettings();
      this.clearContent();
      this.appendTitle("Global Input Settings");


      var opts={
          label:"URL:",
          id:"globlaInputURL",
          type:"text",
          placeholder:"WebSocket Server URL",
          value:globalInputSettings.url,
          clipboard:false
      }
      var inputContainer=this.createInputField(opts);
      this.appendElement(inputContainer);

      var globlaInputURLelement=opts.element;


      var opts={
          label:"API Key:",
          id:"apikey",
          type:"text",
          placeholder:"API Key",
          value:globalInputSettings.apikey,
          clipboard:false
      }
      inputContainer=this.createInputField(opts);
      var globlaInputAPIKeyelement=opts.element;

      this.appendElement(inputContainer);


      opts={
          label1:"Cancel",
          label2:"Save",
          onclick1:function(){
              that.displayMainWindow();
          },
          onclick2:function(){
              globalInputSettings.url=globlaInputURLelement.value;
              globalInputSettings.apikey=globlaInputAPIKeyelement.value;
              that.saveGlobalInputSettings(globalInputSettings);
              that.displayMainWindow();
          }
      }
      var buttons=this.createTwoButton(opts);
      this.appendElement(buttons);
    },


    initPageData:function(message){
            this.initFormData(message);
            if(message.content.cachefields){
                this.displayCachedFormPage(message);
            }
            else{
                this.displayMainWindow();
            }
    },
    resetAll:function(){
        var that=this;
        for(var i=0;i<this.pagedata.formData.fields.length;i++){
              this.pagedata.formData.fields[i].formElement.value="";
        }
        this.sendMessageToContent("reset",null,function(message){
            that.displayMainWindow();
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
    onClickConnectToMobile:function(){
        this.displayInitialising();
        this.sendMessageToContent("get-page-config",null,this.onPageConfigDataReceived.bind(this));
    },
    /*We have received the response for our request to page config*/
    onPageConfigDataReceived:function(message){
        var globalInputSettings=this.getGlobalInputSettings();
        if(!message){
          this.displayMessage("Unable to communicate with the page content, please reload/refresh the page and try again.");
          return;
        }
        this.pagedata.hostname=message.host;
        var that=this;
        var globalinputConfig={
                       url:globalInputSettings.url,
                       apikey:globalInputSettings.apikey,
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
        this.connectToGlobalInputApp(globalinputConfig);
      },
    /*
    This will send the field value received from the mobile to the content script.
    */
    sendFieldValue:function(fieldId, fieldValue){
      var that=this;
        this.sendMessageToContent("set-form-field",{fieldId:fieldId,fieldValue:fieldValue}, function(message){
            //No need to do anythign at this time
        });
    },





/* When the Global Input App has connected to the extension */
      onSenderConnected:function(sender, senders){
        this.pagedata.senders=senders;
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
          this.pagedata.senders=null;
          this.disconnectGlobalInputApp();
          this.checkPageStatus();
      },
      onWebSocketConnect:function(){
        console.log("connected**************");
        var qrcodedata=this.pagedata.globalInputConnector.buildInputCodeData();
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
                nLines:fieldOpts.nLines,
                clipboard:true
            };

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
             if(fieldOpts.nLines && fieldOpts.nLines>1){
                  formfield.nLines=fieldOpts.nLines;
             }
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
                          nLines:5,
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
                  var element=null;
                  if(opts.nLines && opts.nLines>1){
                        element = document.createElement('textarea');
                        element.rows=opts.nLines;
                        element.cols=30;
                  }
                  else{
                    element = document.createElement('input');
                    element.type=opts.type;
                  }



                  element.id=opts.id;
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
          inputContainer.className = "buttonContainer";

           var buttonElement = document.createElement('button');
           buttonElement.className='controlButton';
           buttonElement.innerText=opts.label;
           buttonElement.onclick=function(){
                opts.onclick();
           };
        inputContainer.appendChild(buttonElement);
        return inputContainer;
    },
    createTwoButton:function(opts){
          var that=this;
          var inputContainer=document.createElement('div');
          inputContainer.className = "buttonContainer";

           var buttonElement = document.createElement('button');
           buttonElement.className='controlButton';
           buttonElement.innerText=opts.label1;
           buttonElement.onclick=function(){
                opts.onclick1();
           };
        inputContainer.appendChild(buttonElement);


        var buttonElement = document.createElement('button');
        buttonElement.className='controlButton';
        buttonElement.innerText=opts.label2;
        buttonElement.onclick=function(){
             opts.onclick2();
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
    creatTitleElement:function(title){
          var messageContainer = document.createElement('div');
          messageContainer.className="title";
          messageContainer.innerText=title;
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
