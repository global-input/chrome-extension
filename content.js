(function(){

  var globalInputManager={



    /**
   find the sign in text fields elements and submit button element so that the events received from the Global Input app running on mobile
   can be routed to the corresponding elements.
**/

buildSignInFormFromPage:function(){
              /*Matching Rules for finding the the Sign In Form.
              Each entry is a rule for matching the Sign In elements contained the sign in form.
              You can easily modify to support more websites/web applications.*/
              var signInFormMatchingRules=[{
                     //from confluence
                          username:{name:"os_username"},
                          password:{name:"os_password"},
                          signIn:  {element:"input", id:"loginButton"}
                    },{   //from jira
                          username:{name:"os_username"},
                          password:{name:"os_password"},
                          signIn:  {element:"input", id:"login"}
                    },{
                          //from gitlab
                          username:{name:"user[login]"},
                          password:{name:"user[password]"},
                          signIn:  {element:"input", type:"submit", name:"commit"}
                    },{
                            //from github
                            username:{id:"login_field"},
                            password:{id:"password"},
                            signIn:  {element:"input", type:"submit",name:"commit"}
                    },{
                         //123-reg
                          username:{name:"username"},
                          password:{name:"password"},
                          signIn:  {element:"button", type:"submit", name:"login"}
                    },{
                         //lona.co.uk
                          username:{name:"username"},
                          password:{name:"password"},
                          signIn:  {element:"button", type:"submit", className:"btn btn-primary"}
                    },{
                          //lucidchart
                          username:{name:"username"},
                          password:{name:"password"},
                          signIn:  {element:"input", id:"signin"}
                    },{
                          //dropbox
                          username:{name:"login_email"},
                          password:{name:"login_password"},
                          signIn:  {element:"button", type:"submit", className:"login-button button-primary"}
                    },{
                          //wordpress
                          username:{id:"user_login"},
                          password:{id:"user_pass"},
                          signIn:  {element:"input", id:"wp-submit"}
                    },{
                          //developer.apple.com
                          username:{id:"accountname"},
                          password:{id:"accountpassword"},
                          signIn:  {element:"button", id:"submitButton2"}
                    },{
                          //itunesconnect.apple.com
                          username:{id:"appleId"},
                          password:{id:"pwd"},
                          signIn:  {element:"button", id:"sign-in"}
                    },{
                          //wisepay
                          username:{id:"inputEmail3"},
                          password:{id:"inputPassword3"},
                          signIn:  {element:"button", type:"submit", className:"btn btn-primary bodytext"}
                    },{
                          //aws
                          account:{id:"account"},
                          username:{id:"username"},
                          password:{id:"password"},
                          signIn:  {element:"a", id:"signin_button"}
                    },{
                          //aws
                          password:{id:"ap_password"},
                          signIn: {element:"input", id:"signInSubmit-input"}
                    },{
                          //jira on atlassian.com
                          username:{id:"username"},
                          password:{id:"password"},
                          signIn: {element:"button", id:"login-submit"}
                    },{
                          //gmail
                          password:{element:"input", name:"password", type:"password"},
                          signIn: {element:"div", id:"#passwordNext"}
                    }];


                    var allInputElements=document.getElementsByTagName("input"); //Collecting all the input elements
                    var allButtonElements=document.getElementsByTagName("button"); //All the button elements
                    var allALinkElements=document.getElementsByTagName("a"); //All the a tag elements
                    if(allInputElements.length<1 && allButtonElements.length<1 && allALinkElements.length<1){
                          //if there is no any controllable elements in the page, it will not operate
                          return null;
                    }
             for(var i=0;i<signInFormMatchingRules.length;i++){
                   var matchingRule=signInFormMatchingRules[i]; //iterate through each rule to find the sign in form
                   var passwordElement=null;
                   var usernameElement=null;
                   var accountElement=null;
                   var submitElement=null;
                   if(matchingRule.password){
                        var passwordElement=this.findSignInElement(allInputElements,matchingRule.password); //find the password element
                        if(!passwordElement){
                              continue;//try the next matching rule, for the password element could not be found with the current rule.
                        }
                   }
                   if(matchingRule.username){
                        usernameElement=this.findSignInElement(allInputElements,matchingRule.username); //find the userame element
                        if(!usernameElement){
                                    continue; //try the next rule
                        }
                   }
                  if(matchingRule.account){
                       accountElement=this.findSignInElement(allInputElements,matchingRule.account); //find the account element, i.e. aws uses this
                       if(!accountElement){
                                    continue; //try the next
                       }
                  }
                  if(matchingRule.signIn){
                        if(matchingRule.signIn.element==="input"){
                             submitElement=this.findSignInElement(allInputElements,matchingRule.signIn); //find the submit element from the input tags
                        }
                        else if(matchingRule.signIn.element==="button"){
                            submitElement=this.findSignInElement(allButtonElements,matchingRule.signIn); //find the submit element from the button tags
                        }
                        else if(matchingRule.signIn.element==="a"){
                            submitElement=this.findSignInElement(allALinkElements,matchingRule.signIn); //find the submit element from the a tags
                        }
                        else{
                                submitElement=this.findSignInElementByTagname(matchingRule.signIn.element,matchingRule.signIn); //find the submit element from the any tags
                        }
                        if(!submitElement){
                            continue; //try the next
                        }
                   }
                   //coming here means that a sign in form is found, so trying to buld signInForm object.

                  var signInForm={
                      type:"pageControl",
                      usernameElement:usernameElement,
                      passwordElement:passwordElement,
                      accountElement:accountElement,
                      submitElement:submitElement,
                      onUsernameChanged:function(username){
                              this.usernameElement.value=username; //pass the username value received from mobile to the username element
                      },
                      onPasswordChanged:function(password){
                              this.passwordElement.value=username; //pass the password value received from mobile to the username element
                      },
                      onAccountChanged:function(account){
                              this.accountElement.value=account; //pass the account value received from mobile to the username element
                      },
                      onSubmit:function(){
                                this.submitElement.click();  //click on submit element when the same action happenned in mobile
                      },
                      form:{    //this is the onconfiguration passed to the global input library
                            id:"###username###"+"@"+window.location.host, // unique id for saving the form content in mobile automating the form-filling process.
                            title: "Sign In on "+window.location.host,  //Title of the form displayed on the mobile
                            fields:[]  //the fields to be displayed on the mobile screen, this will be populated in the next step
                      }
                  };

                  if(signInForm.usernameElement){
                      signInForm.form.fields.push({
                                id:"username",
                                label:"Username",
                                type:"text",
                                operations:{
                                    onInput:function(username){
                                         signInForm.onUsernameChanged(username);
                                    }
                                }
                        });
                  }
                  if(signInForm.passwordElement){
                      signInForm.form.fields.push({
                                id:"password",
                                label:"Password",
                                type:"secret",
                                operations:{
                                    onInput:function(password){
                                         signInForm.onPasswordChanged(password);
                                    }
                                }
                        });
                  }
                  if(signInForm.accountElement){
                      signInForm.form.fields.push({
                                id:"account",
                                label:"Account",
                                type:"text",
                                operations:{
                                    onInput:function(account){
                                         signInForm.onAccountChanged(account);
                                    }
                                }
                        });
                  }
                  if(signInForm.submitElement){
                      signInForm.form.fields.push({
                                label:"Login",
                                type:"button",
                                operations:{
                                    onInput:function(){
                                         signInForm.onSubmit();
                                    }
                                }
                        });
                  }
                  return signInForm;

             }
             return null;
     },

    /**
       find the form element from allInputElements.
       allInputElements is an array that contains all the input elements in the page.
       matchCriteria specifies the criteria for example id, name attribute of the input element.
    **/

    findSignInElement(allElements,matchCriteria){
        if(matchCriteria.id){ //find element by id
              return this.findElementsByAttribute(allElements,"id",matchCriteria.id);
        }
        else if(matchCriteria.type && matchCriteria.name){//find element by type and name attributes
              return this.findElementsByTwoAttribute(allElements,"type", matchCriteria.type, "name", matchCriteria.name);
        }
        else if(matchCriteria.name){ //find element by type and name attribute
              return this.findElementsByAttribute(allElements,"name",matchCriteria.name);
         }
        else if(matchCriteria.className && matchCriteria.type){ //find element by class and type attribute
              return this.findElementsByTwoAttribute(allElements,"class", matchCriteria.className, "type", matchCriteria.type);
        }

         else{
              return null;
         }
    },
    findSignInElementByTagname(tagName,matchCriteria){
        var allElements=document.getElementsByTagName(tagName); //Collecting all the elements
        if((!allElements) || (!allElements.length)){
              return null;
        }
        if(matchCriteria.id){ //find element by id
              return this.findElementsByAttribute(allElements,"id",matchCriteria.id);
        }
        else if(matchCriteria.type && matchCriteria.name){//find element by type and name attributes
              return this.findElementsByTwoAttribute(allElements,"type", matchCriteria.type, "name", matchCriteria.name);
        }
        else if(matchCriteria.name){ //find element by type and name attribute
              return this.findElementsByAttribute(allElements,"name",matchCriteria.name);
         }
        else if(matchCriteria.className && matchCriteria.type){ //find element by class and type attribute
              return this.findElementsByTwoAttribute(allElements,"class", matchCriteria.className, "type", matchCriteria.type);
        }

         else{
              return null;
         }
    },



    /**
       looking for element from allInputElements, the element should satisfy the condition: the value of attributename equals to attributevalue
    **/

    findElementsByAttribute:function(allInputElements, attributename, attributevalue){
        for(var x=0;x<allInputElements.length;x++){
            if(allInputElements[x].getAttribute(attributename) === attributevalue){
                return allInputElements[x];
            }
        }
        return null;
   },

   /**
      looking for element from allInputElements, the element should satisfy the condition: the value of attributename1 equals to attributevalue1, and value of  attributename2 equals to attributevalue2
   **/

   findElementsByTwoAttribute:function(allInputElements, attributename1, attributevalue1,attributename2, attributevalue2){
       for(var x=0;x<allInputElements.length;x++){
           if(allInputElements[x].getAttribute(attributename1) === attributevalue1 && allInputElements[x].getAttribute(attributename2) === attributevalue2){
               return allInputElements[x];
           }
       }
       return null;
  },


   sendMessageToExtension:function(message){
        chrome.runtime.sendMessage(message, function(response) {
            console.log("message sent to extension");
        });
   },

   onPopWindowOpenned:function(message){
        if(this.globalInputConnector){
              if(this.globalInputConnector.connectedSenders && this.globalInputConnector.connectedSenders.length>0){
                  return {action: "senderConnectedForPageControl",senders:this.globalInputConnector.connectedSenders};
              }
              else{
                  var qrcodedata=this.globalInputConnector.buildInputCodeData(); //Get the QR Code value generated that includes the end-to-end encryption key and the other information necessary for the app to establish the communication
                  return {qrcodedata:qrcodedata,action:"displayQRCode",hostname:window.location.host};
              }
        }
        else {
            return {action:"notConnected"};
        }
   },
   buildGlobalInputConfigFromSignInForm:function(signInForm){
             var that=this;
             var globalinputConfig={
                              onSenderConnected:function(sender, senders){
                                    /*This will be executed when the Global Input App has Connected.*/
                                    that.sendMessageToExtension({action: "senderConnectedForPageControl",senders:senders});
                              },
                              onSenderDisconnected:function(sender, senders){
                                     that.sendMessageToExtension({action: "senderDisconnectedForPageControl",senders:senders});
                              },
                              initData:{
                                  form:{
                                    id:    "###username###"+"@"+window.location.host, // unique id for saving the form content on mobile automating the form-filling process.
                                    title: "Sign In on "+window.location.host,  //Title of the form displayed on the mobile
                                    fields:[]          //Form elements displayed on the mobile, this will be populated in the next step.
                                        }
                                  }

           };
           if(signInForm.accountElement){   //The page has account element, so it should display one as well on the mobile.
                 globalinputConfig.initData.form.fields.push({
                             label:"Account", //Label of the text field
                             id:"account",    //Unique Id for saving the field value.
                             operations:{
                                 onInput:function(account){
                                      //Executes this when you interacted with this form element.
                                      signInForm.accountElement.value=account;
                                 }
                             }

                     });
          }
          if(signInForm.usernameElement){
                       globalinputConfig.initData.form.fields.push({
                             label:"Username",
                             id:"username",
                             operations:{
                                 onInput:function(username){
                                      //callback same as above.
                                      signInForm.usernameElement.value=username;
                                 }
                             }
                       });
          }
          globalinputConfig.initData.form.fields.push({
                  label:"Password",
                  id:"password",
                  type:"secret",
                  operations:{
                    onInput:function(password){
                      //Comes here when you type something on the password field on your mobile
                      signInForm.passwordElement.value=password;
                    }
                  }
           });
           globalinputConfig.initData.form.fields.push({
                    label:"Login",
                    type:"button",
                    operations:{
                       onInput:function(){
                         //Comes here when you have clicked on the "Login" button on your mobile
                          signInForm.submitElement.click();
                       }
                    }

         });
         return globalinputConfig;
   },
   buildGlobalInputForCustomForm:function(signInForm){
          var that=this;

          var globalinputConfig={
                      onSenderConnected:function(sender, senders){
                            /*This will be executed when the Global Input App has Connected.*/
                            that.sendMessageToExtension({action: "senderConnectedForPageControl",senders:senders});
                      },
                      onSenderDisconnected:function(sender, senders){
                            that.sendMessageToExtension({action: "senderDisconnectedForPageControl",senders:senders});
                      },
                      initData:{
                          form:{
                            id:    "###username###"+"@"+window.location.host, // unique id for saving the form content on mobile automating the form-filling process.
                            title: "Sign In on "+window.location.host,  //Title of the form displayed on the mobile
                            fields:[{
                                      label:"Username",
                                      id:"username",

                                      operations:{
                                            onInput:function(username){
                                                  that.sendMessageToExtension({action: "setformvalue",fieldname:"username", fieldvalue:username});
                                            }
                                       }
                                  },{
                                      label:"Password",
                                      id:"password",
                                      operations:{
                                            onInput:function(password){
                                                  that.sendMessageToExtension({action: "setformvalue",fieldname:"password", fieldvalue:password});
                                            }
                                      }
                                  }]          //Form elements displayed on the mobile.
                          }
                      }

          };
          return globalinputConfig;
   },



   requestConnect:function(message){
          var that=this;
          var signInForm=this.buildSignInFormFromPage(); //find all the sign in form elements from the page.
          globalinputConfig=null;

          if(signInForm){
               globalinputConfig={
                         onSenderConnected:function(sender, senders){
                                that.sendMessageToExtension({action: "senderConnectedForPageControl",senders:senders});
                         },
                         onSenderDisconnected:function(sender, senders){
                                that.sendMessageToExtension({action: "senderDisconnectedForPageControl",senders:senders});
                         },
                         initData:{
                             form:signInForm.form
                        }
              };
          }
          else{

              globalinputConfig={
                        onSenderConnected:function(sender, senders){
                                  that.sendMessageToExtension({action: "senderConnectedForPageControl",senders:senders});
                        },
                        onSenderDisconnected:function(sender, senders){
                                  that.sendMessageToExtension({action: "senderDisconnectedForPageControl",senders:senders});
                       },
                       initData:{
                                form:{
                                        id:    "###username###"+"@"+window.location.host, // unique id for saving the form content on mobile automating the form-filling process.
                                        title: "Sign In on "+window.location.host,  //Title of the form displayed on the mobile
                                        fields:[{
                                              label:"Username",
                                              id:"username",
                                              operations:{
                                                    onInput:function(username){
                                                    that.sendMessageToExtension({action: "setformvalue",fieldname:"username", fieldvalue:username});
                                                    }
                                              }
                                         },{
                                              label:"Password",
                                              id:"password",
                                              operations:{
                                                    onInput:function(password){
                                                    that.sendMessageToExtension({action: "setformvalue",fieldname:"password", fieldvalue:password});
                                                    }
                                              }
                                      }]
                         }
                     }
            };
       }

       var globalInputApi=require("global-input-message"); //get the Global Input Api
       if(this.globalInputConnector){
          this.globalInputConnector.disconnect();
          this.globalInputConnector=null;
        }
        this.globalInputConnector=globalInputApi.createMessageConnector(); //Create the connector

        this.globalInputConnector.connect(globalinputConfig);  //connect to the proxy.
        var qrcodedata=this.globalInputConnector.buildInputCodeData(); //Get the QR Code value generated that includes the end-to-end encryption key and the other information necessary for the app to establish the communication

        console.log("code data:[["+qrcodedata+"]]");
        return {qrcodedata:qrcodedata,action:"displayQRCode",hostname:window.location.host};
  },
  processRequest:function(request,sendResponse){
        if(!request){
          console.error("empty request is received");
        }
        else if(request.action==='connect'){
            var response=this.requestConnect(request);
            sendResponse(response);
        }
        else if(request.action==='onPopWindowOpenned'){
            var response=this.onPopWindowOpenned(request);
            sendResponse(response);
        }
        else{
          console.error("unrecognized request:"+JSON.stringify(request));
        }
  },


   init:function(){
           var that=this;
           chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
              that.processRequest(request,sendResponse);
          });
   }


 };

globalInputManager.init();







})();
