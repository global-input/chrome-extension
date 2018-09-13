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
                      else if(request.action==='sendInputMessage'){
                         var value=request.value;
                         var index=request.index;
                         if(this.globalInputConnector){
                              this.globalInputConnector.sendInputMessage(value,index);
                         }
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
                                form:signInForm.form,
                                action:"input",
                                dataType:"form",
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
                //gmail
                username:{element:"div", id:"profileIdentifier"},
                password:{name:"password",type:"password"},
                signIn: {element:"div", role:"button", id:"passwordNext"}
              },{
                     //from confluence || jira
                          username:{id:["os_username","login-form-username"]},
                          password:{id:["os_password","login-form-password"]},
                          signIn:  {element:"input", id:["loginButton","login","login-form-submit"]}
                    },{
                          //jira on atlassian.com
                          username:{id:"username"},
                          password:{id:"password"},
                          signIn: {element:"button", id:"login-submit"}
                    },{
                          //from gitlab
                          username:{name:"user[login]"},
                          password:{name:"user[password]"},
                          signIn:  {element:"input", type:"submit", name:"commit"}
                    },{
                          //signup on github
                          username:{id:"user[login]"},
                          password:{id:"user[password]"},
                          signIn:  {element:"button", type:"submit"}
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
                          username:{id:["accountname","appleId","account_name_text_field"]},
                          password:{id:["accountpassword","pwd","password_text_field"]},
                          signIn:  {element:"button", id:["submitButton2","sign-in"]}
                    },{
                          //wisepay
                          username:{id:"inputEmail3"},
                          password:{id:"inputPassword3"},
                          signIn:  {element:"button", type:"submit", className:"btn btn-primary bodytext"}
                    },{
                          //paparjohns
                          username:{id:"ctl00__objHeader_txtEmail1"},
                          password:{id:"ctl00__objHeader_txtPassword"},
                          signIn:  {element:"a", id:"ctl00__objHeader_lbSignIn"}
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
                          //binance
                          username:{id:"email"},
                          password:{id:"pwd"},
                          signIn: {element:"input", type:"submit",id:"login-btn",enableButton:true}
                    },{
                          //https://www.okex.com/account/login
                          username:{name:"username",type:"email", rel:"account"},
                          password:{name:"password", type:"password", rel:"password"},
                          signIn: {element:"button", className:"login-btn",enableButton:true}
                    },{
                        //https://bittrex.com/Account/Login?ReturnUrl=%2fbalance
                        username:{id:"UserName"},
                        password:{id:"Password"},
                        signIn: {element:"button", dataCallback:"OnSubmit"}

                    },{
                        //https://www.kraken.com/login
                        username:{name:"username",type:"text"},
                        password:{name:"password",type:"password"},
                        twofactor:{name:"otp",type:"password"},
                        signIn: {element:"button", id:"btn-login"}

                    },{
                        //https://www.kraken.com/login
                        username:{name:"username",type:"text"},
                        password:{name:"password",type:"password"},
                        twofactor:{name:"otp",type:"password"},
                        signIn: {element:"button", id:"btn-login"}

                    },{
                        //https://www.huobi.pro/zh-cn/login/
                        username:{name:"login_name"},
                        password:{name:"password",type:"password"},
                        signIn: {element:"button", type:"submit", className:"btn btn_submit"}

                    },{
                      //https://www.coinbase.com/signin
                      username:{id:"email"},
                      password:{id:"password"},
                      signIn: {element:"input", id:"signin_button"}
                    },{
                      //facebook
                      username:{id:"email"},
                      password:{id:"pass"},
                      signIn: {element:"input", value:"Log In", type:"submit"}
                    },{
                      //auth.hitbtc.com
                      username:{name:"username"},
                      password:{name:"password"},
                      signIn: {element:"button", id:"signin_button", type:"submit"}
                    },{
                      //www.bitfinex.com
                      username:{id:"login"},
                      password:{id:"auth-password"},
                      signIn: {element:"button", name:"action", type:"submit"}
                    },{
                      //global.americanexpress.com
                      username:{id:"lilo_userName"},
                      password:{id:"lilo_password"},
                      signIn: {element:"input", id:"lilo_formSubmit"}
                    },{
                      //www.americanexpress.com/de/
                      username:{id:"login-user"},
                      password:{id:"login-password"},
                      signIn: {element:"button", id:"login-submit"}
                    },{
                      //id.docker.com
                      username:{id:"nw_username"},
                      password:{id:"nw_password"},
                      signIn: {element:"button", type:"submit",id:"nw_submit"}
                    },{
                      //www.npmjs.com/login
                      username:{id:"login_username"},
                      password:{id:"login_password"},
                      signIn: {element:"button", type:"submit",textContent:"Login"}
                    },{
                      //www.camscanner.com
                      username:{id:"id_input_username"},
                      password:{id:"id_input_pwd"},
                      signIn: {element:"a", id:"id_btn_login"}
                    },{
                      //www.evernote.com
                      username:{id:"username"},
                      password:{id:"password"},
                      signIn: {element:"input", id:"loginButton", type:"submit"}
                    },{
                      //myregus.com
                      username:{name:"email",type:"text"},
                      password:{name:"password",type:"password"},
                      signIn: {element:"button",textContent:"Log in"}
                    },{
                      //my.vultr.com
                      username:{name:"username",type:"text"},
                      password:{name:"password",type:"password"},
                      signIn: {element:"input",type:"submit",value:"Login"}
                    },{
                      //wable.com
                      username:{id:"txtUsername",type:"text"},
                      password:{id:"txtPassword",type:"password"},
                      signIn: {element:"button",textContent:"Sign In"}
                    },{
                      //jsfiddler
                      username:{id:"id_username",type:"text"},
                      password:{id:"id_password",type:"password"},
                      signIn: {element:"input",type:"submit",value:"Log in"}
                    },{
                      //join me
                      username:{id:"email",type:"email"},
                      password:{id:"password",type:"password"},
                      signIn: {element:"button",textContent:"Log in"}
                    },{
                      //home.bt.com/login
                      username:{id:"inputIdEmail",type:"email"},
                      password:{id:"inputPassword",type:"password"},
                      signIn: {element:"input",type:"submit",value:"Sign in"}
                    },{
                      //login.live.com
                      username:{name:["login","loginfmt"]},
                      password:{name:"passwd",type:"password",placeholder:"Password"},
                      signIn: {element:"input",type:"submit",value:"Sign in"}
                    },{
                      //cloud.digitalocean.com
                      username:{id:"user_email"},
                      password:{id:"user_password"},
                      signIn: {element:"input",type:"submit",value:"Log In"}
                    },{
                      //c9.io
                      username:{id:"id-username"},
                      password:{id:"id-password"},
                      signIn: {element:"button",type:"submit",textContent:"Sign in"}
                    },{
                      //id.heroku.com
                      username:{id:"email"},
                      password:{id:"password"},
                      signIn: {element:"button",type:"submit",textContent:"Log In"}
                    },{
                      //jsbin.com
                      username:{id:"login-username"},
                      password:{id:"login-key"},
                      signIn: {element:"input",type:"submit",value:"Log in"}
                    },{
                      //linkedin
                      username:{id:"login-email"},
                      password:{id:"login-password"},
                      signIn: {element:"input",type:"submit",id:"login-submit"}
                    },{
                      //tesco
                      username:{id:"username"},
                      password:{id:"password"},
                      signIn: {element:"button",childElement:{tagName:"span",textContent:"Sign in"}}
                    }];

                    var data={

                    };
             for(var i=0;i<signInFormMatchingRules.length;i++){
                   var matchingRule=signInFormMatchingRules[i]; //iterate through each rule to find the sign in form
                   var passwordElement=null;
                   var usernameElement=null;
                   var accountElement=null;
                   var twoFactorElement=null;

                   var submitElement=null;
                   if(matchingRule.password){
                        var passwordElement=this.findSignInElement(data,matchingRule.password); //find the password element
                        if(!passwordElement){
                              continue;//try the next matching rule, for the password element could not be found with the current rule.
                        }
                   }
                   if(matchingRule.username){
                        usernameElement=this.findSignInElement(data,matchingRule.username); //find the userame element
                        if(!usernameElement){
                                    continue; //try the next rule
                        }
                   }
                  if(matchingRule.account){
                       accountElement=this.findSignInElement(data,matchingRule.account); //find the account element, i.e. aws uses this
                       if(!accountElement){
                                    continue; //try the next
                       }
                  }
                  if(matchingRule.twofactor){
                       twoFactorElement=this.findSignInElement(data,matchingRule.twofactor); //find the account element, i.e. aws uses this
                       if(!twoFactorElement){
                                    continue; //try the next
                       }
                  }

                  if(matchingRule.signIn){
                        submitElement=this.findSignInElement(data,matchingRule.signIn); //find the submit element from the input tags
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
                      twoFactorElement:twoFactorElement,
                      submitElement:submitElement,
                      matchingRule:matchingRule,
                      onUsernameChanged:function(username){
                              this.usernameElement.value=username; //pass the username value received from mobile to the username element
                      },
                      onPasswordChanged:function(password){
                              this.passwordElement.value=password; //pass the password value received from mobile to the username element
                              if(password && this.submitElement && this.matchingRule.signIn.enableButton){
                                  this.submitElement.disabled=false;
                              }
                      },
                      onAccountChanged:function(account){
                              this.accountElement.value=account; //pass the account value received from mobile to the username element
                      },
                      onTwoFacorChanged:function(tfc){
                            this.twoFactorElement.value=tfc; //pass the account value received from mobile to the username element
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
                  if(signInForm.twoFactorElement){
                      signInForm.form.fields.push({
                                id:"twofactor",
                                label:"Two Factor",
                                type:"text",
                                operations:{
                                    onInput:function(account){
                                         signInForm.onTwoFacorChanged(account);
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
      matchCriteria specifies the criteria for example id, name attribute of the input element.
      data is the catch holder object to speed up the search.
   **/

   findSignInElement(data,matchCriteria){
            var elemmentToSearch="input";
            if(matchCriteria.element){
                  elemmentToSearch=matchCriteria.element;
            }
            if(!data[elemmentToSearch]){
                data[elemmentToSearch]={
                    elements:document.getElementsByTagName(elemmentToSearch)
                };
            }
            var elementsToMatch=data[elemmentToSearch].elements;

            if((!elementsToMatch) || (!elementsToMatch.length)){
                  //if there is no any controllable elements in the page, it will not operate
                  return null;
            }


            for(var x=0;x<elementsToMatch.length;x++){
                  var currentElement=elementsToMatch[x];
                  var attrData={matched:0};
                  this.matchAttribute(attrData,currentElement,"id",matchCriteria.id);
                  this.matchAttribute(attrData,currentElement,"name",matchCriteria.name);
                  this.matchAttribute(attrData,currentElement,"type",matchCriteria.type);
                  this.matchAttribute(attrData,currentElement,"class",matchCriteria.className);
                  this.matchAttribute(attrData,currentElement,"data-callback",matchCriteria.dataCallback);
                  this.matchAttribute(attrData,currentElement,"value",matchCriteria.value);
                  this.matchAttribute(attrData,currentElement,".textContent",matchCriteria.textContent);
                  this.matchChildElement(attrData,currentElement,matchCriteria.childElement);
                  if(attrData.matched===1){
                          return currentElement;
                  }
           }
        return null;
   },
   matchAttribute:function(attrData,currentElement,attributeName,matchValue){
          if(typeof matchValue === 'undefined'){
                return;
          }
          if(attrData.matched===2){
              return;
          }
          var attrValue=null;
          if(attributeName==='.textContent'){
              attrValue=currentElement.textContent;
          }
          else{
              attrValue=currentElement.getAttribute(attributeName);
          }
          if(attrValue){
            attrValue=attrValue.trim();
          }

          if(typeof matchValue ==='object' && Array.isArray(matchValue)){
                  for(var i=0;i<matchValue.length;i++){
                    if(attrValue === matchValue[i]){
                         attrData.matched=1;
                         return;
                    }
                  }
                  attrData.matched=2;
          }
          else{
                if(attrValue === matchValue){
                     attrData.matched=1;
                }
                else{
                   attrData.matched=2;
                }
          }

   },
   matchChildElement:function(attrData,currentElement,childElement){
          if(typeof childElement === 'undefined'){
                return;
          }
          if(attrData.matched===2){
              return;
          }
          if((!currentElement.children) || (!currentElement.children.length) ){
                attrData.matched=2;
                return;
          }
          if(childElement.tagName && childElement.textContent){
              if(this.matchElementsByTagNameAndTextContent(currentElement.children,childElement.tagName,childElement.textContent)){
                attrData.matched=1;
              }
              else{
                attrData.matched=2;
              }
          }
   },
   matchElementsByTagNameAndTextContent:function(elements,matchTagName,matchTextContent){
     matchTagName=matchTagName.toUpperCase();
     for(var i=0;i<elements.length;i++){
         if(elements[i].tagName===matchTagName){
                 if(matchTextContent===elements[i].textContent){
                    return true;
                 }
             }
    }
    return false;
   }

 };

globalInputManager.init();







})();
