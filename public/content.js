(function(){

//  const sendMessageToExtension=(message,callback)=>{    
//       chrome.runtime.sendMessage(null,message, function(response) {
//         callback(response);      
//       });    
//  } 
  
////___CONTENT___SCRIPT___////



  var globalInputFormManager={

          pageData:{              
              key:null,
              pageForm:null,
          },
     
          /* The entry function when this script file is loaded */
          init:function(){
                  chrome.runtime.onMessage.addListener(this.onExtensionMessageReceived.bind(this));////listener////
                
          },
     
     resetAll:function(){       
        this.pageData.pageForm=null;
        this.pageData.key=null;
     },
     /*  message handler for message coming from extension */
     onExtensionMessageReceived:function(message, sender, replyBack){
         if(!message){
               console.error("empty message is received");
               replyBack({
                           messageType:"error",
                           status:"error",
                           host:window.location.host,
                           content:"empty"
                         }
                         );
               return;
         }
         else if(message.messageType==='set-key'){
               this.pageData.key=message.content.key;               
               replyBack({
                           messageType:message.messageType,
                           status:"success",
                           host:window.location.host,
                           content:null
                         });
         }

         else if(message.messageType==='get-page-config' || message.messageType==='next-page-config'){
              var pageConfig=this.getPageConfig(message);
              if(!pageConfig){
                replyBack({
                  messageType:message.messageType,
                  host:window.location.host,
                  status:"failed",
                  content:"no recognized form",                  
                });
              }
              else{
                replyBack({
                  messageType:message.messageType,
                  host:window.location.host,                  
                  status:"success",
                  content:pageConfig
                });
              }

         }
         else if(message.messageType==='set-form-field'){
                if(!this.pageData.pageForm){
                      replyBack({
                        messageType:message.messageType,
                        host:window.location.host,
                        status:"error",
                        content:"no form in the page"
                      });
                      return;
                }
                this.pageData.pageForm.form.setFormFieldValue(message.content.fieldId,message.content.fieldValue);
                replyBack({
                            messageType:message.messageType,
                            host:window.location.host,
                            status:"success"
                           });
         }         
         else if(message.messageType==='reset'){
            this.resetAll();
            replyBack({
                        messageType:message.messageType,
                        host:window.location.host,
                        status:"success"
                       });
         }
         else if(message.messageType==='check-page-status'){
           replyBack({
                       messageType:message.messageType,
                       host:window.location.host,                       
                       status:"success",
                       content:{
                              key:this.pageData.key
                        }
                      });                                      
         }
         else{
            replyBack({
                         messageType:message.messageType,
                         host:window.location.host,
                         status:"error",
                         content:"messageType not recognized"
                      });
         }
     },
     /* find the form element to build a form config data to be used
     to display a similar form on the mobile screen */
     getPageConfig:function(message){
        var pageForm=this.findFormWithDomainSpecificRule(message);
        this.pageData.pageForm=pageForm; //save it to use to set the value in the form when received input evens from mobile
        if(!pageForm){
              return null;
        }
        else{
          var globalInputForms={
              host:window.location.host,
              form:{
                  id:pageForm.form.id,
                  title:pageForm.form.title,
                  fields:[]
              }
          };
          for(var i=0;i<pageForm.form.fields.length;i++){
            var gFieldProperty={
                  id:pageForm.form.fields[i].id,
                  label:pageForm.form.fields[i].label,
                  type:pageForm.form.fields[i].type,
                  matchingRule:pageForm.form.fields[i].matchingRule,
            };
            if(pageForm.form.fields[i].type==='list' || pageForm.form.fields[i].type==='picker' || pageForm.form.fields[i].type==='select'){
                gFieldProperty.items=[];
                for(var k=0;k<pageForm.form.fields[i].items.length;k++){
                    gFieldProperty.items.push({
                      value:pageForm.form.fields[i].items[k].value,
                      label:pageForm.form.fields[i].items[k].label
                    });
                }
                gFieldProperty.selectType=pageForm.form.fields[i].selectType;
            }
            else if(pageForm.form.fields[i].type==='info'){
                gFieldProperty.value=pageForm.form.fields[i].value;
            }
            globalInputForms.form.fields.push(gFieldProperty);
          }
          return globalInputForms;
        }

     },
     findFormWithDomainSpecificRule:function(message){
          if((!window)|| (!window.location) || (!window.location.host)){
              return null;
          }
          var formManager=this;
          var domainSpecificFormBuilder={
              hostname:window.location.host,
              hostnameMatch:function(matchRule){
                  if(matchRule.hostnames.type==='single'){
                        return matchRule.hostnames.value===this.hostname;
                  }
                  else if(matchRule.hostnames.type==='array'){
                    for(var k=0;k<matchRule.hostnames.value.length;k++){
                        if(matchRule.hostnames.value[k]===this.hostname){
                            return true;
                        }
                    }
                  }
                  return false;
              },
              start:function(message){

                    if(message && message.content && message.content.applicationControlConfig){
                      for(var t=0;t<message.content.applicationControlConfig.forms.length;t++){
                            var form=this.buildForm(message.content.applicationControlConfig.forms[t]);
                            if(form){
                              return form;
                            }
                      }

                    }
                return null;
              },

              getItemValue:function(itemRule,itemElement){
                let val=null;
                if(typeof itemRule ==='string'){
                  return itemRule;
                }
                if(itemRule.selector){
                    itemElement=this.selectElement(itemRule,itemElement);
                }
                if(itemRule.type==='attribute'){
                      val=itemElement.getAttribute(itemRule.attributeName);
                }
                else if(itemRule.type==='textContent'){
                    val=itemElement.textContent;
                }
                else  if(itemRule.type==='value'){
                    val=itemElement.value;
                }
                return val;
              },
              getData:function(dataRule,itemElement){
                  if(dataRule.selector){
                      itemElement=this.selectElement(dataRule,itemElement);
                      if(!itemElement){
                          return null;
                      }
                  }
                  var itemLabel=null;
                  var itemValue=null;
                  if(dataRule.label){
                      itemLabel=this.getItemValue(dataRule.label,itemElement);
                  }
                  if(dataRule.value){
                      itemValue=this.getItemValue(dataRule.value,itemElement);
                  }
                  return {
                    label: itemLabel,
                    value:itemValue
                  }
              },
              selectElement:function(fieldRule,formContainer){
                var elements=this.selectElements(fieldRule,formContainer);
                if(elements.length){
                    return elements[0];
                }
                else{
                  return null;
                }
              },
              selectElements:function(fieldRule,formContainer){
                         var elementSelector={
                              select:function(){
                                  if(typeof fieldRule.selector ==='object'){
                                      return this.matchElementsByRule(fieldRule.selector,formContainer);
                                  }
                                  else{
                                      return formContainer.querySelectorAll(fieldRule.selector);
                                  }
                              },
                              currentRuleMatchElement:function(elementRule,element){
                                  if(elementRule.textContent){
                                        if(element.textContent!==elementRule.textContent){
                                          return false;
                                        }
                                  }
                                  if(elementRule.attributeName && elementRule.attributeValue){
                                      if(element.getAttribute(elementRule.attributeName)!==elementRule.attributeValue){
                                          return false;
                                      }
                                  }
                                  return true;
                              },
                              matchElementsByRule:function(elementRule,formContainer){
                                    var matchingElements=[];
                                    var that=this;

                                    var collectMatchedElements=function(elements){
                                        if(elements.length){
                                              for(var i=0;i<elements.length;i++){
                                                    if(that.currentRuleMatchElement(elementRule,elements[i])){
                                                          if(elementRule.content){
                                                              if(that.matchElementsByRule(elementRule.content,elements[i]).length){
                                                                  matchingElements.push(elements[i]);
                                                              }
                                                          }
                                                          else{
                                                              matchingElements.push(elements[i]);
                                                          }
                                                    }
                                              }
                                        }
                                    };
                                    if(elementRule.element && Array.isArray(elementRule.element)){
                                      for(var i=0;i<elementRule.element.length;i++){
                                            var elements=formContainer.querySelectorAll(elementRule.element[i]);
                                            if(elements.length){
                                                collectMatchedElements(elements);
                                                break;
                                            }
                                      }
                                    }
                                    else{
                                        var elements=formContainer.querySelectorAll(elementRule.element);
                                        collectMatchedElements(elements);
                                    }


                                    return matchingElements;
                              }
                         };
                         return elementSelector.select();
              },


              addItemToList:function(itemRule, element, items){
                  var itemData=this.getData(itemRule.data,element);
                  if(!itemData){
                      return;
                  }
                  for(var i=0;i<items.length;i++){
                      if(items[i].value===itemData.value){
                          return;
                      }
                  }
                  items.push({
                      label:itemData.label,
                      value:itemData.value,
                      element:element
                  });
              },
              buildListFieldProperty:function(fieldRule,formContainer){

                var listElement=this.selectElement(fieldRule,formContainer);
                if(!listElement){
                  return null;
                }
                var listData={
                }
                if(fieldRule.data){
                      listData=this.getData(fieldRule.data,listElement);
                      if(!listData){
                        return null;
                      }
                }
                var items=[];

                for(var i=0;i<fieldRule.items.length;i++){
                      var itemRule=fieldRule.items[i];
                      var elements=this.selectElements(itemRule,listElement);
                      for(var k=0;k<elements.length;k++){
                            this.addItemToList(itemRule,elements[k],items);
                      }
                }
                if(items.length){
                  return {
                         id:fieldRule.id,
                         type:fieldRule.type,
                         label:listData.label,
                         selectType:fieldRule.selectType,
                         matchingRule:fieldRule,
                         items:items,
                         formElement:listElement
                  };
                }
                else{
                      return null;
                }
              },
              buildInfoFieldProperty:function(fieldRule,formContainer){
                var element=this.selectElement(fieldRule,formContainer);
                if(!element){
                    return null;
                }
                var data=this.getData(fieldRule.data,element);
                      return {
                             id:fieldRule.id,
                             label:data.label,
                             type:fieldRule.type,
                             matchingRule:fieldRule,
                             value:data.value,
                             formElement:element,
                      };


              },

              buildFieldProperty:function(fieldRule,formContainer){
                  var element=this.selectElement(fieldRule,formContainer);
                  if(!element){
                      return null;
                  }
                  else{
                    let data={
                      label:fieldRule.id
                    };

                    if(fieldRule.data){
                      data=this.getData(fieldRule.data,element);
                    }
                    else{
                      console.warn("missing data attribute, which is used for label:"+JSON.stringify(fieldRule));
                    }
                    
                    var fieldProperty={
                      id:fieldRule.id,
                      label:data.label,
                      type:fieldRule.type,
                      matchingRule:fieldRule,
                      formElement:element,
                    };
                    if(fieldRule.confirm){
                      var confirmElement=this.selectElement(fieldRule.confirm,formContainer);
                      if(confirmElement){
                        fieldProperty.confirm={
                          formElement:confirmElement
                        }
                      }
                    }
                    return fieldProperty;
                  }
              },
              buildForm:function(formRule){
                var formContainer=document;

                if(formRule.type==='iframe'){
                    var iframe=document.querySelector('iframe');
                    if((!iframe)|| (!iframe.contentWindow) || (!iframe.contentWindow.document)){
                        return null;////iframeNotFound
                    }
                    formContainer=iframe.contentWindow.document;
                }
                var signInForm=formManager.getSignInForm();
                for(var i=0;i<formRule.fields.length;i++){
                    var fieldProperty=null;
                    if(formRule.fields[i].type==='list' || formRule.fields[i].type==='picker' ||formRule.fields[i].type==='select'){
                        fieldProperty=this.buildListFieldProperty(formRule.fields[i],formContainer);
                    }
                    else if(formRule.fields[i].type==='info'){
                        fieldProperty=this.buildInfoFieldProperty(formRule.fields[i],formContainer);
                    }
                    else{
                        fieldProperty=this.buildFieldProperty(formRule.fields[i],formContainer);
                    }
                    if(fieldProperty){
                        signInForm.form.fields.push(fieldProperty);
                    }
                    else{
                          return null;
                    }

                }
                if(formRule.formid){
                      var formidElement=this.selectElement(formRule.formid,formContainer);

                      if(formidElement){
                          var formid=this.getItemValue(formRule.formid.data.value,formidElement);
                          if(formid){
                              signInForm.form.id=signInForm.form.id.replace('###username###',formid);
                          }

                      }
                }
                if(formRule.title){
                  signInForm.form.title=formRule.title;
                }

                return signInForm;
              },
          };
          return domainSpecificFormBuilder.start(message);
     },
     getSignInForm:function(){
        return {
            form:{
              id:"###username###"+"@"+window.location.host, // unique id for saving the form content in mobile automating the form-filling process.
              title: "Sign In on "+window.location.host,  //Title of the form displayed on the mobile
              fields:[],  //the fields to be displayed on the mobile screen, this will be populated in the next step
              setFormFieldValue:function(fieldId, newValue){
                  if(this.fields.length){
                      for(var i=0;i<this.fields.length;i++){
                          if(this.fields[i].id===fieldId){
                              if(this.fields[i].type==='button'){
                                    if(this.fields[i].formElement.disabled){
                                      this.fields[i].formElement.disabled=false;
                                    }
                                  this.fields[i].formElement.click();
                              }
                              else if(this.fields[i].type==='list'){

                                  if(Array.isArray(newValue) && newValue.length){
                                        newValue=newValue[0];
                                        for(var k=0;k<this.fields[i].items.length;k++){
                                              var vitem=this.fields[i].items[k];
                                              if(vitem.value===newValue){
                                                   vitem.element.click();
                                                   return;
                                              }
                                        }
                                  }

                              }                              
                              else{
                                  this.fields[i].formElement.value=newValue;
                                  this.fileInputEvent(this.fields[i].formElement);
                                  if(this.fields[i].confirm){
                                    this.fields[i].confirm.formElement.value=newValue;
                                    this.fileInputEvent(this.fields[i].confirm.formElement);
                                  }
                              }
                          }
                      }
                  }
              },
              fileInputEvent:function(formElement){
                    // var event = new Event('change');
                    // formElement.dispatchEvent(event);
                    //formElement.focus();
                    var event = new Event('input', {
                        'bubbles': true,
                        'cancelable': true
                    });
                    formElement.dispatchEvent(event);

                    event = document.createEvent("HTMLEvents");
                    event.initEvent("change", false, true);
                    formElement.dispatchEvent(event);


                   //  event = document.createEvent("HTMLEvents");
                   // event.initEvent("keypress", true, false);
                   //  event.keyCode=13;
                   //  formElement.dispatchEvent(event);


              }
            }
        };
     },


 };

globalInputFormManager.init();

})();
