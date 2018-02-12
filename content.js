(function(){

  var globalInputManager={

    /**
        only this method should be called from the content script to start listenning messages.
        The message will be coming from the extension script (popup.js)
    **/
     init:function(){
            var that=this;
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                      if(!request){
                            console.error("empty request is received");
                      }
                      else if(request.action==='connect'){
                          //When the user clicked on the button in the popup window,
                          //extension script sends the 'connect' message.
                          //Here we have received this message, so we will do globalInput connect and send back the QR code data to the extension script
                          var response=that.requestConnect(request);
                          sendResponse(response);
                      }
                      else if(request.action==='onPopWindowOpenned'){
                          //When the popwindow openned, the extension script will send the 'onPopWindowOpenned' message.
                          //Here will try to send back the status back to extension script, because extension script does not preserve status after it is closed.
                          var response=that.onPopWindowOpenned(request);
                          sendResponse(response);
                      }
                      else{
                            //Unrecognized message
                            console.error("unrecognized request:"+JSON.stringify(request));
                      }
           });
      },

      /*
          first try to get the controllable elements from the page and configure the globalInput accordingly.
          If the controllable elements are not found, will configure the globalInput with custom form that is to be displayed in popup window
      */
      requestConnect:function(message){
             var onSenderConnected=null;
             var onSenderDisconnected=null;
             var signInForm=this.buildSignInFormFromPage(); //find the sign form from the page.
             if(!signInForm){
                   signInForm=this.buildCustomSignInForm();//If it cound't find any sign in form, then create a custom form that is to be displayed in the popup window
             }
             var globalinputConfig={
                            onSenderConnected:signInForm.onSenderConnected,
                            onSenderDisconnected:signInForm.onSenderDisconnected,
                            initData:{
                                form:signInForm.form
                            }
             };
           var globalInputApi=require("global-input-message"); //get the Global Input Api
           if(this.globalInputConnector){
               this.globalInputConnector.disconnect();
               this.globalInputConnector=null;
           }
           this.globalInputConnector=globalInputApi.createMessageConnector(); //Create the connector
           this.globalInputConnector.connect(globalinputConfig);  //connect to the proxy.
           var qrcodedata=this.globalInputConnector.buildInputCodeData(); //Get the QR Code value generated that includes the end-to-end encryption key and the other information necessary for the app to establish the communication
           console.log("code data:[["+qrcodedata+"]]");
           this.globalInputConnector.signInForm=signInForm;
           return {qrcodedata:qrcodedata,action:"displayQRCode",hostname:window.location.host, formType:signInForm.type};
      },


    /**
        find the sign in form element so that the events received from the Global Input app running on mobile
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
                   var that=this;
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
                              this.passwordElement.value=password; //pass the password value received from mobile to the username element
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
                      },
                      onSenderConnected:function(sender, senders){
                            that.sendMessageToExtension({action: "senderConnected",senders:senders,formType:signInForm.type});
                      },
                      onSenderDisconnected:function(sender, senders){
                            that.sendMessageToExtension({action: "senderDisconnected",senders:senders,formType:signInForm.type});
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

  /*
    send message to the extension script
  */
   sendMessageToExtension:function(message){
        chrome.runtime.sendMessage(message, function(response) {
            console.log("message sent to extension");
        });
   },

   /*
   Called when the popup window is openned
   */
   onPopWindowOpenned:function(message){
        if(this.globalInputConnector){
              if(this.globalInputConnector.connectedSenders && this.globalInputConnector.connectedSenders.length>0){
                  //mobile is already connected
                  return {action: "senderConnected",senders:this.globalInputConnector.connectedSenders, formType:this.globalInputConnector.signInForm.type,data:this.globalInputConnector.signInForm.data};
              }
              else{
                 //No mobile is connected, but the globalInput is already initialized.
                  var qrcodedata=this.globalInputConnector.buildInputCodeData(); //Get the QR Code value generated that includes the end-to-end encryption key and the other information necessary for the app to establish the communication
                  return {qrcodedata:qrcodedata,action:"displayQRCode",hostname:window.location.host, formType:this.globalInputConnector.signInForm.type,data:this.globalInputConnector.signInForm.data};
              }
        }
        else {
             //globalInput is not initialized.
            return {action:"notConnected"};
        }
   },

  /*
  Sign In Form initization for the form to be displayed in the popup window.
  */
   buildCustomSignInForm:function(){
     var that=this;
     var signInForm = {
         type:"usernamepassword",
         data:{username:"",password:"", account:"", note:""}, //this is the storage to be send to the popwimdow, if it reopenned after closed.
         form:{
                 id:    "###username###"+"@"+window.location.host, // unique id for saving the form content on mobile automating the form-filling process.
                 title: "Sign In on "+window.location.host,  //Title of the form displayed on the mobile
                 fields:[{
                       label:"Username",
                       id:"username",
                       type:"text",
                       operations:{
                             onInput:function(username){
                               signInForm.data.username=username;
                               that.sendMessageToExtension({action: "setformvalue",fieldname:"username", fieldvalue:username});
                             }
                       }
                  },{
                       label:"Password",
                       id:"password",
                       type:"secret",
                       operations:{
                             onInput:function(password){
                                signInForm.data.password=password;
                                that.sendMessageToExtension({action: "setformvalue",fieldname:"password", fieldvalue:password});
                             }
                       }
               },{
                    label:"Account",
                    id:"account",
                    type:"text",
                    operations:{
                          onInput:function(account){
                             signInForm.data.account=account;
                             that.sendMessageToExtension({action: "setformvalue",fieldname:"account", fieldvalue:account});
                          }
                    }
                },{
                     label:"Note",
                     id:"note",
                     type:"text",
                     operations:{
                           onInput:function(note){
                              signInForm.data.note=note;
                              that.sendMessageToExtension({action: "setformvalue",fieldname:"note", fieldvalue:note});
                           }
                     }
                 }]
           },
           onSenderConnected:function(sender, senders){
                 that.sendMessageToExtension({action: "senderConnected",senders:senders,formType:signInForm.type,data:signInForm.data});
           },
           onSenderDisconnected:function(sender, senders){
                 that.sendMessageToExtension({action: "senderDisconnected",senders:senders,formType:signInForm.type,data:signInForm.data});
           }
        };
        return signInForm;
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
   /**
     find the sign in element by tag name from the document, instead from the list of elements that are already collected
   **/
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
   }




 };

globalInputManager.init();







})();
