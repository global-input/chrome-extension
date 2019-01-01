var globalInputChromeExtension={
  pagedata:{
      action:null,
      hostname:"",
      senders:null,
      contentContainer:null,
      formData:{
        formContainer:null,
        fields:[],
      },
      form:null,
      globalInputApi:null,
      globalInputConnector:null,
  },
  setHostName:function(hostname){
    this.pagedata.hostname=hostname;
  },
  setSenders:function(senders){
    this.pagedata.senders=senders;
  },
  isSenderConnected:function(){
    return this.pagedata.globalInputConnector && this.pagedata.senders;
  },

  setAction:function(action){
      console.log(action);
      this.pagedata.action=action;

  },

  isConnectToWindowForm:function(){
      return this.pagedata.action==='connect-to-window';
  },
  isFormEditor:function(){
      return this.pagedata.action==='form-editor';
  },

  buildWindowForm:function(){
    var formSettings=this.getFormSettings();
    this.pagedata.formData.formContainer=document.createElement('div');
    var hostname=this.pagedata.hostname;
    this.pagedata.formData.fields=[];
    this.pagedata.form={
              id:  formSettings.id.replace("###hostname###",hostname), // unique id for saving the form content on mobile automating the form-filling process.
              title: formSettings.title.replace("###hostname###",hostname),  //Title of the form displayed on the mobile
              label:formSettings.label,
              fields:[],
        };
        for(var i=0;i<formSettings.fields.length;i++){
          var fsetfields=formSettings.fields[i];
          var formfield=this.buildGlobalInputField({
                label:fsetfields.label,
                id:fsetfields.id,
                type:fsetfields.type,
                nLines:fsetfields.nLines
           });
           this.pagedata.form.fields.push(formfield);
        }
},

  disconnectGlobalInputApp:function(){
    if(this.pagedata.globalInputConnector){
        this.pagedata.globalInputConnector.disconnect();
    }
    this.pagedata.globalInputConnector=null;
    this.setSenders(null);
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


  appendQRCode:function(qrcodeData){
        var qrCodeContainerElement=this.createQRCode(qrcodeData);
        this.appendElement(qrCodeContainerElement);
  },
  appendGlobalInputAppAvailable:function(){
        var element=this.createHTMLElement('Scan the QR Code above with your Global Input App. Global Input App is available in <a href="https://itunes.apple.com/us/app/global-input-app/id1269541616?mt=8&ign-mpt=uo%3D4" target="_blank">App Store</a> and <a href="https://play.google.com/store/apps/details?id=uk.co.globalinput&hl=en_GB" target="_blank">Google Play Store</a>. Please visit <a href="https://globalinput.co.uk" target="_blank">our website</a> for more information.');
        this.appendElement(element);
  },


  displayInitialising:function(){
         this.clearContent();
         this.appendMessage("Initialising.....");
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
    this.setAction("display-cached-values");
    this.buildWindowForm();
    for(var i=0;i<message.content.cachefields.length;i++){
        var field=message.content.cachefields[i];
        this.setFormFieldValue(field.id,field.value);
    }
    this.clearContent();
    this.appendForm();
    this.appendMessage("Global Input App is disconnected.");
    this.appendResetButton();
  },

  addFormElement:function(fieldId, formElement,inputContainer){
    var that=this;
      var onkeyup=function(){
            if(that.isSenderConnected()){
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

    appendSettingsButton:function(){
      var that=this;
      var inputContainer=this.createButton({
        label:'Settings',
        onclick:function(){
          that.displaySettings();
        }
      });
      this.appendElement(inputContainer);
    },
    appendCustomiseWindowFormButton:function(){
      var that=this;
      var inputContainer=this.createButton({
        label:'Customise Form',
        onclick:function(){
            that.displayWindowFormEditor();
        }
      });
      this.appendElement(inputContainer);
    },

    displayMainWindow:function(){
      this.setAction("main-window");
      this.disconnectGlobalInputApp();
      var that=this;
      this.clearContent();
      this.appendConnectToMobileButton();
      that.appendMessage("Click on the button above to connect to your Global Input App on your mobile.");
      this.appendSettingsButton();
    },
    checkPageStatus:function(){
        var that=this;
        this.setAction("check-page-status");
        this.sendMessageToContent('check-page-status',null, function(message){
            if(!message){
              console.log("failed to contact content script at this time");
              that.displayMainWindow();
            }
            else{
                that.setHostName(message.host);
                if(message.content.cachefields){
                    that.displayCachedFormPage(message);
                }
                else{
                    that.displayMainWindow();
                }
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
    getFormSettings:function(){
          var formsettings={
                id:    "###username###"+"@###hostname###",
                title: "Sign In on ###hostname###",
                label:"web",
                isDefault:true,
                fields:[{
                      label:"Username",
                      id:"username",
                      type:"text"
                 },{
                   label:"Password",
                   id:"password",
                   type:"password"
                 },{
                   label:"Account",
                   id:"account",
                   type:"text"
                 },{
                   label:"Note",
                   id:"note",
                   type:"text",
                   nLines:5
                 }],
          };

        var fieldString=localStorage.getItem("iterative.formsettings.fields");
        if(fieldString){
          try{
              var fields=JSON.parse(fieldString);
              if(fields && fields.length>0){
                  formsettings.fields=fields;
              }
          }
          catch(error){
              console.error(error);
          }
        }
        else{
          formsettings.isDefault=false;
        }
        return formsettings;
    },
    saveGlobalInputSettings:function(globalInputSettings){
        localStorage.setItem("iterative.globaliputapp.url",globalInputSettings.url);
        localStorage.setItem("iterative.globaliputapp.apikey",globalInputSettings.apikey);
    },
    displaySettings:function(){

      var that=this;
      var globalInputSettings=this.getGlobalInputSettings();
      this.clearContent();
      this.appendTitle("Settings");


      var opts={
          label:"URL:",
          id:"globlaInputURL",
          type:"text",
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
    displayWindowFormEditor:function(){
        this.setAction("form-editor");
        var that=this;
        var formSettings=this.getFormSettings();
        var modified=false;

        var that=this;
        var cancelEdit=function(){
          if(that.isSenderConnected()){
             that.displayConnectedWindowForm();
          }
          else{
             that.reconnectToWindowForm();
          }
        }
        var displayAddNewField=function(){
              that.clearContent();
              that.appendTitle("Adding a New Field");
              var nameProperty={
                  label:"Name",
                  id:"newfieldname",
                  type:"text",
                  value:"",
                  placeholder:"Name of the new field"
              };
              var fieldLinesProperty={
                    name:"fieldLines",
                    items:[{label:'Single-line', value:"singleline"},
                           {label:'Multi-line',  value:"multiline"}]

              };

              var inputContainer=that.createInputField(nameProperty);
              that.appendElement(inputContainer);

              inputContainer=that.createRadioButtons(fieldLinesProperty);
              that.appendElement(inputContainer);

              var addNewField=function(){
                    var newFieldlabel=nameProperty.element.value.trim();
                    if(!newFieldlabel){
                        that.appendMessage("The field is is not valid");
                        return;
                    }
                    var newFieldId=newFieldlabel.replace(' ',"_").toLowerCase();
                    var nLines=1;
                    if(fieldLinesProperty.elements[1].checked){
                        nLines=5;
                    }
                    var newFieldProperty={
                      label:newFieldlabel,
                      id:newFieldId,
                      type:'text',
                    };
                    if(nLines>1){
                      newFieldProperty.nLines=nLines;
                    }
                    formSettings.fields.push(newFieldProperty);
                    renderFormEditor();


              };
              var buttonContainer=that.createTwoButton({
                  label1:"Back",
                  label2:"Add",
                  onclick1:renderFormEditor,
                  onclick2:addNewField,
              });
              that.appendElement(buttonContainer);

        };

        var renderFormEditor=function(){
              that.clearContent();
              that.appendTitle("Customising Form");
              for(var i=0;i<formSettings.fields.length;i++){
                    var fsetfields=formSettings.fields[i];
                     var opts={
                         label:fsetfields.label,
                         id:fsetfields.id,
                         type:fsetfields.type,
                         value:"",
                         nLines:fsetfields.nLines,
                         button:{
                                  className:"deleteButton",
                                  label:"Delete",

                        },
                        clickOnButton:function(){
                            modified=true;
                            formSettings.fields=formSettings.fields.filter(f=>f.id!==this.id);
                            renderFormEditor();
                        }
                     };

                     var inputContainer=that.createInputField(opts);
                     that.appendElement(inputContainer);
              }
              var inputContainer=that.createTwoButton({
                label1:"Reset to Default",
                label2:'Add New Field',
                className:"button",
                onclick1:null,
                onclick2:displayAddNewField,
              });
              that.appendElement(inputContainer);


              if(modified && formSettings.fields.length){
                     var buttonContainer=that.createTwoButton({
                         label1:"Cancel",
                         label2:"Save",
                         onclick1:cancelEdit,
                         onclick2:function(){

                         }
                     });
                     that.appendElement(buttonContainer);
              }
              else{
                var buttonContainer=that.createOneButton({
                    label:"Cancel",
                    onclick:cancelEdit
                });
                that.appendElement(buttonContainer);
              }


        };

        renderFormEditor();



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
        var that=this;
        this.setAction('get-page-config');
        this.sendMessageToContent("get-page-config",null,function(message){
              if(!message){
                  that.whenEmptyReplyReceived();
                  return;
              }
              that.setHostName(message.host);
              var globalInputSettings=that.getGlobalInputSettings();
              var globalinputConfig=that.buildBasicGlobalInputConfig(globalInputSettings);
              if(message.status==="success"){
                  globalinputConfig.initData.form=that.buildContentGlobalInputForm(message);
                  that.setAction('connect-to-content');
              }
              else{
                  that.setAction('connect-to-window');
                  that.buildWindowForm();
                  globalinputConfig.initData.form=that.pagedata.form;
              }
              that.connectToGlobalInputApp(globalinputConfig);
        });
    },
    reconnectToWindowForm:function(){
        var globalInputSettings=this.getGlobalInputSettings();
        var globalinputConfig=this.buildBasicGlobalInputConfig(globalInputSettings);
        this.setAction('connect-to-window');
        this.buildWindowForm();
        globalinputConfig.initData.form=this.pagedata.form;
        this.connectToGlobalInputApp(globalinputConfig);
    },


    whenEmptyReplyReceived:function(){
      this.setWindowHeight(50);
      this.setAction("content-not-available");
      that.clearContent();
      that.appendMessage("Unable to obtain the page status, please reload/refresh the page, and try again after the page is fully loaded.");

    },
    buildBasicGlobalInputConfig:function(globalInputSettings){
      var that=this;
      return {
                     url:globalInputSettings.url,
                     apikey:globalInputSettings.apikey,
                     onSenderConnected:this.onSenderConnected.bind(this),
                     onSenderDisconnected:this.onSenderDisconnected.bind(this),
                     onRegistered:function(next){
                                  next();
                                  that.onWebSocketConnect();
                     },
                     initData:{
                       form:null,
                       action:"input",
                       dataType:"form",
                     },
           };
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


    getSenderTextContent:function(){
      var senders=this.pagedata.senders;
      var message="Mobile Connected ("+senders.length+"):";
      message+=senders[0].client;
      if(senders.length>1){
        for(var i=1;i<senders.length;i++){
            message+", ";
            message+=senders[i].client;
        }
      }
      return message;

    },

   displayConnectedWindowForm:function(){
     this.clearContent();
     this.appendForm();
     this.appendMessage(this.getSenderTextContent());
     this.appendElement(this.createHTMLElement('No identifiable form found on this page. Hence, instead of direct operation, you have to copy the content from the form on this window to the target application. In the mean time, you may <a href="https://globalinput.co.uk/global-input-app/contact-us" target="_blank">let us know</a> so we can do the necessary improvement to allow you to operate on this page directly.'));
     this.appendCustomiseWindowFormButton();
   },
   displayConnectedContentMessage:function(){
     this.clearContent();
     this.appendMessage(this.getSenderTextContent());
     this.setWindowHeight(50);
   },
/* When the Global Input App has connected to the extension */
      onSenderConnected:function(sender, senders){
        this.setSenders(senders);
        if(this.isConnectToWindowForm()){
            this.displayConnectedWindowForm();
        }
        else{
            this.displayConnectedContentMessage();
        }
      },
      onSenderDisconnected:function(sender, senders){
          this.disconnectGlobalInputApp();
          if(!this.isFormEditor()){
              this.checkPageStatus();
          }
      },
      onWebSocketConnect:function(){
        console.log("connected**************");
        var qrcodedata=this.pagedata.globalInputConnector.buildInputCodeData();
        console.log("code data:[["+qrcodedata+"]]");
        this.clearContent();
        this.appendQRCode(qrcodedata);
        this.appendGlobalInputAppAvailable();
        this.setWindowHeight(500);

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
                  if(opts.placeholder){
                    element.placeholder=opts.placeholder;
                  }
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
            else if(opts.button){
              var buttonElement = document.createElement('button');
                  buttonElement.className=opts.button.className;
                  buttonElement.innerText=opts.button.label;
                  buttonElement.onclick=function(){
                    opts.clickOnButton();
              };
              inputContainer.appendChild(buttonElement);
            }
      inputRowContainer.appendChild(inputContainer);
      return inputRowContainer;

    },
    createRadioButtons:function(opts){
      var inputRowContainer=document.createElement('div');
      inputRowContainer.className = "fielrow";
      opts.elements=[];



                  for(i=0;i<opts.items.length;i++){
                        var inputContainer=document.createElement('div');
                        inputContainer.className = "field";
                            var item=opts.items[i];
                            var element = document.createElement('input');
                            element.type="radio";
                            element.name=opts.name;
                            element.value=item.value;
                            element.className="radioButton";
                            element.id=opts.name+'_'+item.value;
                            opts.elements.push(element);
                            inputContainer.appendChild(element);
                            var labelElement = document.createElement('label');
                            labelElement.innerText=item.label;
                            labelElement.for=opts.name+'_'+item.value;
                            labelElement.className='radioLabel'
                            inputContainer.appendChild(labelElement);
                        inputRowContainer.appendChild(inputContainer);

                  }
        return inputRowContainer;
    },

    createButton:function(opts){
       var inputContainer=document.createElement('div');
       inputContainer.className = "buttonContainer2";
       var buttonElement = document.createElement('button');
       buttonElement.className='button';
       buttonElement.innerText=opts.label;
       var that=this;
       buttonElement.onclick=opts.onclick;
       inputContainer.appendChild(buttonElement);
       this.appendElement(inputContainer);
       return inputContainer;
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

           if(opts.className){
                buttonElement.className=opts.className;
           }

           buttonElement.innerText=opts.label1;
           buttonElement.onclick=function(){
                opts.onclick1();
           };
        inputContainer.appendChild(buttonElement);


        var buttonElement = document.createElement('button');
        buttonElement.className='controlButton';
        if(opts.className){
             buttonElement.className=opts.className;
        }
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
    createHTMLElement:function(htmlContent){
        var messageContainer = document.createElement('div');
        messageContainer.innerHTML=htmlContent;
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
