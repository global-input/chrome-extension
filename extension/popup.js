(function(){
var globalInputAppChromeExtension={
  pagedata:{
      action:null,
      hostname:"",
      senders:null,
      contentContainer:null,
      actionType:null,
      cacheTTL:null,
      cacheTimer:null,
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
  getHostName:function(){
    return this.pagedata.hostname;
  },
  _getFormSettingLocalStoragePrefix:function(){
    var formprefix="extension."+this.getHostName()?this.getHostName():'default';
    return formprefix+".forms.fields";
  },
  setCacheTTL:function(ttl){
    this.pagedata.cacheTTL=ttl;
  },
  getCacheFreshTTL:function(){
    if(this.pagedata.cacheTTL){
        return this.pagedata.cacheTTL*2/3;
    }
    else{
      return 0;
    }

  },
  setSenders:function(senders){
    this.pagedata.senders=senders;
  },
  isSenderConnected:function(){
    return this.pagedata.globalInputConnector && this.pagedata.senders;
  },
  updateCacheTimer:function(){
        this.clearCacheTimer();
        if(this.pagedata.action==='display-cached-values' || this.pagedata.action==='connected-window'){
                that=this;
                this.sendMessageToContent("update-cache-time",null, function(message){
                    if(message){
                      var cacheTTL=that.getCacheFreshTTL();
                      if(cacheTTL>500){
                           that.pagedata.cacheTimer=setTimeout(that.updateCacheTimer.bind(that),cacheTTL);
                      }
                    }
                    else{
                      console.log("update-cache-time failure");
                    }
                });
        }
        else{
            this.clearCacheTimer();
        }

  },
  clearCacheTimer:function(){
          if(this.pagedata.cacheTimer){
              var timer=this.pagedata.cacheTimer;
              this.pagedata.cacheTimer=null;
              clearTimeout(timer);
          }
  },

  setAction:function(action){
      console.log(action);
      this.pagedata.action=action;
      if(action==='connect-to-window' || action==='connect-to-content'){
          this.pagedata.actionType=action;
      }
  },

  isConnectToWindowForm:function(){
      return this.pagedata.actionType==='connect-to-window';
  },
  isFormEditor:function(){
      return this.pagedata.action==='form-editor';
  },
  getCustomApplicationControlConfig:function(){
        var applicationConfigString=localStorage.getItem("iterative.globaliputapp.controlConfigs");
        if(applicationConfigString){
            try{
                return applicatoonControlConfig=JSON.parse(applicationConfigString);
            }
            catch(error){
                  console.log("error in loading the applicationConfigString:"+error);
            }


        }
        return null;
  },
  isApplicationControlDisabled:function(){
      var applicationConfigString=localStorage.getItem("iterative.globaliputapp.controlDisabled");
      if(applicationConfigString){
          return true;
      }
  },
  disableApplicationControl:function(){
      localStorage.setItem("iterative.globaliputapp.controlDisabled","true");
  },
  enableApplicationControl:function(){
      localStorage.removeItem("iterative.globaliputapp.controlDisabled");
  },
  updateCustomApplicationControlConfig:function(newContent){
        var hostname=this.getHostName();
        if(!hostname){
          console.error("hostname is null, so it will not save control settings");
          return;
        }
        var customApplicationControlConfig=this.getCustomApplicationControlConfig();
        var newCustomApplicationControlConfig=[];
        var notUpdated=true;
        if(customApplicationControlConfig){
            for(var i=0;i<customApplicationControlConfig.length;i++){
                if(notUpdated && this.applicationConfigMatchHostName(customApplicationControlConfig[i], hostname)){
                       if(newContent){
                          newCustomApplicationControlConfig.push(newContent);
                       }
                       notUpdated=false;
                }
                else{
                  newCustomApplicationControlConfig.push(customApplicationControlConfig[i]);
                }
            }
        }
        if(notUpdated && newContent){
            newCustomApplicationControlConfig.push(newContent);
        }
        if(newCustomApplicationControlConfig.length){
            var updateString=JSON.stringify(newCustomApplicationControlConfig);
            localStorage.setItem("iterative.globaliputapp.controlConfigs",updateString);
        }
        else{
            localStorage.removeItem("iterative.globaliputapp.controlConfigs");
        }
  },
  deleteCustomApplicationControlConfig:function(hostname){
    var customApplicationControlConfig=this.getCustomApplicationControlConfig();
    var newCustomApplicationControlConfig=[];
    var notUpdated=true;
    if(customApplicationControlConfig){
        for(var i=0;i<customApplicationControlConfig.length;i++){
            if(notUpdated && this.applicationConfigMatchHostName(customApplicationControlConfig[i], hostname)){
                   notUpdated=false;
            }
            else{
              newCustomApplicationControlConfig.push(customApplicationControlConfig[i]);
            }
        }
    }

    if(newCustomApplicationControlConfig.length){
        var updateString=JSON.stringify(newCustomApplicationControlConfig);
        localStorage.setItem("iterative.globaliputapp.controlConfigs",updateString);
    }
    else{
        localStorage.removeItem("iterative.globaliputapp.controlConfigs");
    }
  },
  applicationConfigMatchHostName:function(applicationControlConfig, hostname){
          if(!applicationControlConfig){
            return false;
          }
          if(!applicationControlConfig.hostnames){
            return false;
          }
          if(applicationControlConfig.hostnames.type==='single'){
                if(applicationControlConfig.hostnames.value===hostname){
                  return true;
                }
          }
          else if(applicationControlConfig.hostnames.type==='array'){
            for(var k=0;k<applicationControlConfig.hostnames.value.length;k++){
                if(applicationControlConfig.hostnames.value[k]===hostname){
                    return true;
                }
            }
          }
          return false;
  },
  selectApplicationControlConfig:function(hostname, applicationControlConfigs){
        for(var i=0;i<applicationControlConfigs.length;i++){
              if(this.applicationConfigMatchHostName(applicationControlConfigs[i],hostname)){
                  return applicationControlConfigs[i];
              }
        }
        return null;
  },

  getApplicationControlSettings:function(){
            var chromeExtension=this;
            var applicationControlSelector={
                    getConfig:function(){
                          var hostname=chromeExtension.getHostName();
                          if(!hostname){
                            return null;
                          }
                          var customApplicationConfigString=chromeExtension.getCustomApplicationControlConfig();
                          if(customApplicationConfigString){
                              var selectedApplicationControlConfig=chromeExtension.selectApplicationControlConfig(hostname,customApplicationConfigString);
                              if(selectedApplicationControlConfig){
                              return {
                                            type:"custom",
                                            applicationConfigs:selectedApplicationControlConfig
                                          };
                              }
                          }
                          if(chromeExtension.applicationControlConfigs){
                              var selectedApplicationControlConfig=chromeExtension.selectApplicationControlConfig(hostname,chromeExtension.applicationControlConfigs);
                              if(selectedApplicationControlConfig){
                                 return {
                                                  type:"default",
                                                  applicationConfigs:selectedApplicationControlConfig
                                        };
                              }
                          }
                          return null;


                    }


            };

                return applicationControlSelector.getConfig();

  },





  buildWindowForm:function(){
    var formSettings=this.getWidowFormSettings();
    this.pagedata.formData.formContainer=document.createElement('div');
    var title=this.getHostName();
    this.pagedata.formData.fields=[];
    this.pagedata.form={
              id:  "###username###@"+this.getHostName(), // unique id for saving the form content on mobile automating the form-filling process.
              title: title,  //Title of the form displayed on the mobile
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
    var buttonElement=this.createButtons({
      buttons:[{label:"Reset", onclick:this.resetAll.bind(this)}]
    });
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
  appendSeparateWebApplication:function(){
        var element=this.createHTMLElement('You can also use <a href="https://globalinput.co.uk/global-input-app/form-data-transfer" target="_blank">this separate web application</a> to transfer content');
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
      var that=this;
      this.sendMessageToContent("set-cache-field",{fieldId:fieldId,fieldValue:newValue}, function(message){
          //for the moment
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

    this.updateCacheTimer();


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
          this.applicationControlConfigs=globalInputApp_applicationControlConfigs,
          this.createContentContainer();
          chrome.runtime.onMessage.addListener(this.onContentMessageReceived.bind(this));
          this.main();
    },

    appendConnectToMobileButton:function(){
      var that=this;
      var opts={
        buttons:[{
          label:"Connect to Mobile",
          onclick:function(){
              that.onClickConnectToMobile();
          }
        }]

      };
      var buttons=this.createButtons(opts);
      this.appendElement(buttons);
    },

    appendSettingsButton:function(){
      var that=this;
      var opts={
            items:[{
                label:"Communication Settings",
                onclick: this.displayProxySettings.bind(this)
            },{
                label:"Applications Control Settings",
                onclick:this.displayApplicationControlSettings.bind(this)
            }]
         };
         var menuContainer=this.createMenu(opts);
         this.appendElement(menuContainer);
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
    checkPageStatus:function(onSucess, onFailure){
          var that=this;
          this.setAction("check-page-status");
          this.sendMessageToContent('check-page-status',null, function(message){
              if(!message){
                console.log("failed to contact content script at this time");
                onFailure();
              }
              else{
                  that.setHostName(message.host);
                  that.setCacheTTL(message.cacheTTL);
                  onSucess(message);
              }
          })
    },
    main:function(){
        var that=this;
        this.checkPageStatus(function(message){
                  if(message.content.cachefields){
                      that.displayCachedFormPage(message);
                  }
                  else{
                      that.displayMainWindow();
                  }
        }, function(){
            that.displayMainWindow();
        });
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

    clearFormFieldsSettings:function(){
        var key=this._getFormSettingLocalStoragePrefix();
        localStorage.removeItem(key);
    },
    saveFormFieldSettings:function(formSettings){
          if(formSettings.isDefault){
              this.clearFormFieldsSettings();
          }
          var fieldString=JSON.stringify(formSettings.fields);
          localStorage.setItem(this._getFormSettingLocalStoragePrefix(),fieldString);
    },
    getWidowFormSettings:function(loadDefaultSettings){
          var formsettings={
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
          if(loadDefaultSettings){
              return formsettings;
          }
          var fieldString=localStorage.getItem(this._getFormSettingLocalStoragePrefix());
          if(fieldString){
            formsettings.isDefault=false;
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

        return formsettings;
    },


    saveGlobalInputSettings:function(globalInputSettings){
        localStorage.setItem("iterative.globaliputapp.url",globalInputSettings.url);
        localStorage.setItem("iterative.globaliputapp.apikey",globalInputSettings.apikey);
    },

    displayApplicationControlSettings:function(){
            this.setAction("application-control-editor");
            var chromeExtension=this;
            var applicationControlEditor={
                data:{

                },

                start:function(){
                      var that=this;
                      if(chromeExtension.getHostName()){
                          this.data.hostname=chromeExtension.getHostName();
                          this.showMain();
                      }
                      else{
                            chromeExtension.checkPageStatus(function(message){
                                that.data.hostname=chromeExtension.getHostName();
                                that.showMain();
                            }, function(){
                                chromeExtension.whenEmptyReplyReceived();
                            });
                      }

                },
                showMain:function(){
                      this.data.applicationControlSettings=chromeExtension.getApplicationControlSettings();

                      if((!chromeExtension.isApplicationControlDisabled()) && this.data.applicationControlSettings){
                            this.displayEditor();
                      }
                      else{
                            this.displayApplicationControlDisabledScreen();
                      }
                },
                setMessageText:function(message){
                  this.messageElement.innerText=message;
                },
                getObjectStringForm:function(obj){
                  return JSON.stringify(obj,null,2);
                },
                getEditContent:function(){
                  if(this.data.applicationControlSettings && this.data.applicationControlSettings.applicationConfigs){
                      return this.getObjectStringForm(this.data.applicationControlSettings.applicationConfigs);
                  }
                  else{
                      return "";
                  }

                },
                isContentChanged:function(content){

                    if(!this.data.applicationControlSettings){
                        return true;
                    }
                    if(this.data.applicationControlSettings.type==="new"){
                        return true;
                    }
                    return this.getEditContent() !== this.getObjectStringForm(content);;
                },
                deleteRecord:function(){
                    chromeExtension.deleteCustomApplicationControlConfig(this.data.hostname);
                    chromeExtension.disableApplicationControl();
                    chromeExtension.displayMainWindow();
                },
                disableApplicationControl(){
                    chromeExtension.disableApplicationControl();
                    chromeExtension.displayMainWindow();
                },
                saveEditContent:function(){
                    var content=this.editorElement.value;
                    try{
                        content=JSON.parse(content);
                        if(!chromeExtension.applicationConfigMatchHostName(content,chromeExtension.getHostName())){
                              this.setMessageText("hostname in the config should match current url");
                              return;
                        }
                        if(!content.forms){
                          this.setMessageText("forms array is missing");
                          return;
                        }
                        if(!Array.isArray(content.forms)){
                          this.setMessageText("forms element shoild be array");
                          return;
                        }
                        if(this.isContentChanged(content)){
                                chromeExtension.updateCustomApplicationControlConfig(content)
                        }
                        chromeExtension.displayMainWindow();
                    }
                    catch(error){
                        console.error(error);
                        this.setMessageText("failed to parse the content:"+error);
                        return;
                    }


                    //chromeExtension.displayMainWindow();
                },
                createNewApplicationControlSetting:function(){
                    return {
                            type:"new",
                            applicationConfigs:{
                                        hostnames:{
                                              type:"single",
                                              value:this.data.hostname
                                        },
                                        forms:[{
                                                title:"Sign In on "+this.data.hostname,
                                                fields:[{
                                                      id:"username",
                                                      type:"text",
                                                      selector:'input[id="login-form-username"]',
                                                      data:{label:"Username"},
                                                },{
                                                    id:"password",
                                                    type:"secret",
                                                    selector:'input[id="login-form-password"][type="password"]',
                                                    data:{label:"Password"},
                                                },{
                                                    id:"submit",
                                                    type:"button",
                                                    selector:'input[id="login"]',
                                                    data:{label:"Log In"},
                                                    nextUI:{
                                                             type:"refresh"
                                                    }
                                                }]
                                        }]
                              }
                          };
                },
                enableApplicationControl:function(){
                  chromeExtension.enableApplicationControl();
                  if(!this.data.applicationControlSettings){
                      this.data.applicationControlSettings=this.createNewApplicationControlSetting();
                  }
                  this.displayEditor();
                },
                displayEditor:function(){
                       chromeExtension.clearContent();
                       var editContent=this.getEditContent();
                       var opts={
                           label:"Application Control Settings for this Website",
                           id:"controlConfigsContent",
                           type:"text",
                           value:editContent,
                           nLines:10
                       };
                       var inputContainer=chromeExtension.createInputField(opts);
                       this.editorElement=opts.element;
                       chromeExtension.appendElement(inputContainer);

                       opts={
                           buttons:[{
                                 label:"Cancel",
                                 onclick:chromeExtension.displayMainWindow.bind(chromeExtension)
                           },{
                                 label:"Save",
                                 onclick:this.saveEditContent.bind(this)
                           }]
                       };
                       if(this.data.applicationControlSettings.type==="custom"){
                         opts.buttons.splice(1,0,{
                            label:"Disable",
                            onclick:this.deleteRecord.bind(this)
                         });
                       }
                       else if(!chromeExtension.isApplicationControlDisabled()){
                         opts.buttons.splice(1,0,{
                             label:"Disable",
                             onclick:this.disableApplicationControl.bind(this)
                         });
                       }

                       this.messageElement=chromeExtension.createMessageElement("");
                       chromeExtension.appendElement(this.messageElement);
                       var buttons=chromeExtension.createButtons(opts);

                       chromeExtension.appendElement(buttons);



                },
                displayApplicationControlDisabledScreen:function(){
                      chromeExtension.clearContent();
                      this.messageElement=chromeExtension.createMessageElement('The Application Control is not enabled for this website.  This means that you cannot directly communicate with this page. However, you can transfer data to/from this extension from your mobile and use copy-and-paste operation. If you would like to enable Application Control for this website, please click on "Enable"  button.');
                      chromeExtension.appendElement(this.messageElement);
                      opts={
                          buttons:[{
                                label:"Cancel",
                                onclick:chromeExtension.displayMainWindow.bind(chromeExtension)
                          },{
                                label:"Enable",
                                onclick:this.enableApplicationControl.bind(this)
                          }]
                      };
                      var buttons=chromeExtension.createButtons(opts);
                      chromeExtension.appendElement(buttons);

                }

            };
            applicationControlEditor.start();

    },
    displayProxySettings:function(){

      var globalInputSettings=this.getGlobalInputSettings();
      this.clearContent();
      this.appendTitle("WebSocket Proxy Settings");
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

      var that=this;
      opts={
          buttons:[{
                label:"Cancel",
                onclick:that.displayMainWindow.bind(that)
          },{
                label:"Save",
                onclick:function(){
                      globalInputSettings.url=globlaInputURLelement.value;
                      globalInputSettings.apikey=globlaInputAPIKeyelement.value;
                      that.saveGlobalInputSettings(globalInputSettings);
                      that.displayMainWindow();
                }
          }]
      };
      var buttons=this.createButtons(opts);
      this.appendElement(buttons);
    },
    displayWindowFormEditor:function(){
        var chromeExtension=this;
        this.setAction("form-editor");
        var formEditorData={
              modified:false,
              formSettings:null,
              original:{
                  isDefault:null
              },
              adjustModified:function(){
                if(this.original.isDefault && this.formSettings.isDefault){
                    this.modified=false;
                }
              },

              start:function(){
                this.formSettings=chromeExtension.getWidowFormSettings();
                this.original.isDefault=this.formSettings.isDefault;
                this.renderFormEditor();
              },
              cancelEdit:function(){
                if(chromeExtension.isSenderConnected()){
                   chromeExtension.displayConnectedWindowForm();
                }
                else{
                   chromeExtension.reconnectToWindowForm();
                }
              },
              saveFormEditorData:function(){
                if(!this.modified){
                    console.log("not changed");
                }
                chromeExtension.saveFormFieldSettings(this.formSettings);
                chromeExtension.reconnectToWindowForm();
              },
              addNewField:function(newFieldProperty){
                  this.formSettings.fields.push(newFieldProperty);
                  this.formSettings.isDefault=false;
                  this.modified=true;
              },
              deleteAField:function(fieldid){
                this.modified=true;
                this.formSettings.fields=this.formSettings.fields.filter(f=>f.id!==fieldid);
                this.formSettings.isDefault=false;
              },
              resetToDefault:function(){
                 this.formSettings=chromeExtension.getWidowFormSettings(true);
                 this.modified=true;
                 this.renderFormEditor();
              },
              displayAddNewField:function(){
                          chromeExtension.clearContent();
                          chromeExtension.appendTitle("Adding a New Field");
                          var newFieldData={
                              nameProperty:{
                                    label:"Name",
                                    id:"newfieldname",
                                    type:"text",
                                    value:"",
                                    placeholder:"Name of the new field"
                              },
                              linesProperty:{
                                name:"fieldLines",
                                value:'singleline',
                                items:[{label:'Single-line', value:"singleline"},
                                       {label:'Multi-line',  value:"multiline"}]

                              },
                              onOk:function(){
                                      var newFieldlabel=this.nameProperty.element.value.trim();
                                      if(!newFieldlabel){
                                          that.appendMessage("The field is is not valid");
                                          return;
                                      }
                                      var newFieldId=newFieldlabel.replace(' ',"_").toLowerCase();
                                      var nLines=1;
                                      if(this.linesProperty.elements[1].checked){
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
                                      formEditorData.addNewField(newFieldProperty);
                                      formEditorData.renderFormEditor();
                              },
                              onCancel:function(){
                                    formEditorData.renderFormEditor();
                              }



                          };
                          var inputContainer=chromeExtension.createInputField(newFieldData.nameProperty);
                          chromeExtension.appendElement(inputContainer);

                          inputContainer=chromeExtension.createRadioButtons(newFieldData.linesProperty);
                          chromeExtension.appendElement(inputContainer);
                          var buttonContainer=chromeExtension.createButtons({
                              buttons:[{
                                    label:"Back",
                                    onclick:newFieldData.onCancel.bind(newFieldData)
                              },{
                                    label:'Add',
                                    onclick: newFieldData.onOk.bind(newFieldData)
                              }]
                          });
                          chromeExtension.appendElement(buttonContainer);
              },

              appendEditFormFields:function(){
                    for(var i=0;i<this.formSettings.fields.length;i++){
                          var fsetfields=this.formSettings.fields[i];
                           var opts={
                               label:fsetfields.label,
                               id:fsetfields.id,
                               type:fsetfields.type,
                               value:"",
                               readonly:true,
                               nLines:fsetfields.nLines,
                               button:{
                                        className:"deleteButton",
                                        label:"Delete",

                              },
                              clickOnButton:function(){
                                  formEditorData.deleteAField(this.id);
                                  formEditorData.renderFormEditor();
                              }
                           };
                           var inputContainer=chromeExtension.createInputField(opts);
                           chromeExtension.appendElement(inputContainer);
                    }
              },
              appendEditorFieldButtons:function(){
                if(this.formSettings.isDefault){
                  var inputContainer=chromeExtension.createButton({
                    label:'Add New Field',
                    onclick:this.displayAddNewField.bind(this),
                  });
                  chromeExtension.appendElement(inputContainer);
                }
                else{
                  var inputContainer=chromeExtension.createButtons({
                    buttons:[{
                        label:"Reset to Default",
                        onclick:this.resetToDefault.bind(this),
                        className:"button"
                    },{
                        label:"Add New Field",
                        onclick:this.displayAddNewField.bind(this),
                        className:"button"
                    }],

                  });
                  chromeExtension.appendElement(inputContainer);
                }
              },
              appendFormEditorButtons:function(){
                if(this.modified && this.formSettings.fields.length){
                       var buttonContainer=chromeExtension.createButtons({
                           buttons:[{
                              label:"Cancel",
                              onclick:this.cancelEdit.bind(this)
                           },{
                              label:"Save",
                              onclick:this.saveFormEditorData.bind(this)
                           }]
                       });
                       chromeExtension.appendElement(buttonContainer);
                }
                else{
                  var buttonContainer=chromeExtension.createButtons({
                      buttons:[{label:"Cancel",
                      onclick:this.cancelEdit
                  }]});
                  chromeExtension.appendElement(buttonContainer);
                }
              },
              renderFormEditor:function(){
                      chromeExtension.clearContent();
                      chromeExtension.appendTitle("Customising Form");
                      this.adjustModified();
                      this.appendEditFormFields();
                      this.appendEditorFieldButtons();
                      this.appendFormEditorButtons();

              }

        };
        formEditorData.start();
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
        if(this.getHostName()){
              this.requestContentFormFromContent();
        }
        else{
                this.checkPageStatus(function(message){
                  that.requestContentFormFromContent();
                }, function(){
                    that.whenEmptyReplyReceived();
                });
        }
    },



    requestContentFormFromContent(){
      var request={
      };
      var applicationControlSettings=this.getApplicationControlSettings();
      if(applicationControlSettings && (!this.isApplicationControlDisabled())){
            request.applicationControlConfig=applicationControlSettings.applicationConfigs;
      }
      var that=this;
      this.sendMessageToContent("get-page-config",request,function(message){
            if(!message){
                that.whenEmptyReplyReceived();
                return;
            }
            that.setHostName(message.host);
            that.setCacheTTL(message.cacheTTL);

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
    requestNextPageConfig:function(request){
        var applicationControlSettings=this.getApplicationControlSettings();
        if(applicationControlSettings){
              request.applicationControlConfig=applicationControlSettings.applicationConfigs;
        }
        this.setAction('next-page-config');
        var that=this;
        this.sendMessageToContent("next-page-config",request,function(message){
              if(!message){
                  that.whenEmptyReplyReceived();
                  return;
              }
              that.setHostName(message.host);
              var initData={
                action:"input",
                dataType:"form",
                form:null,
              };
              if(message.status==="success"){
                  initData.form=that.buildContentGlobalInputForm(message);
                  that.setAction('connect-to-content');
              }
              else{
                  that.setAction('connect-to-window');
                  that.buildWindowForm();
                  initData.form=that.pagedata.form;
                  that.displayConnectedWindowForm();
              }
              that.pagedata.globalInputConnector.sendInitData(initData);
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
      this.clearContent();
      this.appendMessage("Unable to obtain the page status. Please check the URL on the web adress bar and then reload/refresh the page, and try again after the page is fully loaded.");
      this.appendSeparateWebApplication();

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
     this.setAction('connected-window');
     this.clearContent();
     this.appendForm();
     this.appendMessage(this.getSenderTextContent());
     this.appendElement(this.createHTMLElement('The Application Control is not enabled for the direct operation on this website. You can still transfer data securely from/to this extension window using your mobile and do copy and paste operation.  You may enable the application control for this website in the application control settings window. Please <a href="https://globalinput.co.uk/global-input-app/contact-us" target="_blank">contact us</a> for more information.'));
     this.appendCustomiseWindowFormButton();
     this.updateCacheTimer();
   },
   displayConnectedContentMessage:function(){
     this.setAction('connected-content');
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
              this.main();
          }
      },
      onWebSocketConnect:function(){
        var qrcodedata=this.pagedata.globalInputConnector.buildInputCodeData();
        console.log("code data:[["+qrcodedata+"]]");
        this.clearContent();
        this.appendQRCode(qrcodedata);
        this.appendGlobalInputAppAvailable();
        this.setWindowHeight(500);

      },
      displayNextUIOnMobile:function(nextUI){
        var that=this;
        var initData={
          action:"input",
          dataType:"form",
          form:{
                  title:this.pagedata.hostname,
                  fields:[{
                      type:"info",
                      value:"Please continue"
                  },{
                      type:"button",
                      label:"Close",
                      icon:"cancel",
                      viewId:"row1",
                      operations:{
                          onInput:function(){
                              that.disconnectGlobalInputApp();
                              window.close();
                          }
                      }

                  },{
                      type:"button",
                      label:"Continue",
                      viewId:"row1",
                      icon:"right",
                      operations:{
                          onInput:function(){
                            that.requestNextPageConfig(nextUI);
                          }
                      }

                  }

                  ]
                }
        };
        this.pagedata.globalInputConnector.sendInitData(initData);


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
                var fieldProperty={
                      id:field.id,
                      label:field.label,
                      type:field.type,
                      items:field.items,
                      selectType:field.selectType,
                      operations:{
                        field:field,
                        onInput:function(newValue){
                            var field=this.field;
                            that.sendMessageToContent("set-form-field",{fieldId:field.id,fieldValue:newValue}, function(message){
                                if(field.matchingRule.nextUI){
                                      that.displayNextUIOnMobile(field.matchingRule.nextUI)
                                }
                            });
                        }
                      }
                };
                if(field.type==='button'||field.type==='list'||field.type==='info' || field.type==='picker' || field.type==='select'){
                    fieldProperty.id=null;
                }
                if(field.type==='info' || field.type==='picker' || field.type==='select'){
                  fieldProperty.value=field.value;
                      if(field.type==='picker'){
                          if(typeof field.value ==='undefined'){
                              fieldProperty.value=fieldProperty.items[0].value;
                          }
                      }

                }

                form.fields.push(fieldProperty);
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
                  if(opts.readonly){
                    element.readOnly=opts.readonly;
                  }
                  element.className="textInput";


            opts.element=element;

            if(opts.clipboard){
              var elementgroup=document.createElement('div');
              elementgroup.className="elementgroup";
              inputContainer.appendChild(elementgroup);

                  elementgroup.appendChild(element);
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
                  elementgroup.appendChild(copyButtonElement);
            }
            else if(opts.button){
                  var elementgroup=document.createElement('div');
                  elementgroup.className="elementgroup";
                  inputContainer.appendChild(elementgroup);
                  elementgroup.appendChild(element);
              var buttonElement = document.createElement('button');
                  buttonElement.className=opts.button.className;
                  buttonElement.innerText=opts.button.label;
                  buttonElement.onclick=function(){
                    opts.clickOnButton();
              };
              elementgroup.appendChild(buttonElement);
            }
            else{
                inputContainer.appendChild(element);
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
                        inputContainer.className = "radioContainer";
                            var item=opts.items[i];
                            var element = document.createElement('input');

                            element.type="radio";
                            element.name=opts.name;
                            element.value=item.value;
                            element.className="radioButton";
                            element.id=opts.name+'_'+item.value;
                            if(opts.value===item.value){
                              element.checked=true;
                            }
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
    createMenu:function(opts){
       var inputContainer=document.createElement('div');
       inputContainer.className = "menuContainer";
       for(var i=0;i<opts.items.length;i++){
         var menuElement = document.createElement('a');
         menuElement.className='menu';
         menuElement.innerText=opts.items[i].label;
         var that=this;
         menuElement.onclick=opts.items[i].onclick;
         inputContainer.appendChild(menuElement);
       }
       this.appendElement(inputContainer);
       return inputContainer;
    },


    createButtons:function(opts){
          var that=this;
          var inputContainer=document.createElement('div');
          inputContainer.className = "buttonContainer";

          for(var i=0;i<opts.buttons.length;i++){
                var buttonElement = document.createElement('button');
                buttonElement.className='controlButton';
                if(opts.buttons[i].className){
                     buttonElement.className=opts.buttons[i].className;
                }
                buttonElement.innerText=opts.buttons[i].label;
                buttonElement.onclick=opts.buttons[i].onclick;
                inputContainer.appendChild(buttonElement);
          }

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
        messageContainer.className="message";
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
document.addEventListener('DOMContentLoaded',  globalInputAppChromeExtension.onDocumentLoaded.bind(globalInputAppChromeExtension));
})();
