(function(){

  var globalInputFormManager={
    /* Matching rules for locating a form in a pge
    the comment indicates the name of the application
    where the rule is coming from */
    pageFormMatchingRules:[{
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
          },{
            //proton
            username:{id:"username"},
            password:{id:"password"},
            signIn: {element:"button",type:"submit", id:"login_btn"}
          },{
            //proton
            username:{id:"username"},
            password:{id:"password"},
            confirmPassword:{id:"passwordc"},
            createAccount: {element:"button",type:"submit", textContent:"Create Account"}
          }],
          pagedata:{
              cachefieldvalues:[],
              clearachefieldvalues:{
                    ttl:60000,
                    timer:null,
              },
              pageForm:null,
          },
          getCacheFields(){
                  var isEmpty=true;
                  for(i=0;i<this.pagedata.cachefieldvalues.length;i++){
                    if(this.pagedata.cachefieldvalues[i].value.length){
                        isEmpty=false;
                        break;
                    }
                  }
                  if(isEmpty){
                      return null;
                  }
                  else{
                      return this.pagedata.cachefieldvalues;
                  }
            },
            clearClearCacheTimer:function(){
              if(this.pagedata.clearachefieldvalues.timer){
                   var timer=this.pagedata.clearachefieldvalues.timer;
                   this.pagedata.clearachefieldvalues.timer=null;
                   clearTimeout(timer);
              }
            },
          updateClearCacheTime:function(){
            var that=this;
            this.clearClearCacheTimer();
            this.pagedata.clearachefieldvalues.timer=setTimeout(function(){
                that.pagedata.clearachefieldvalues.timer=null;
                that.resetAll();
            },this.pagedata.clearachefieldvalues.ttl);
          },
          setFieldCacheValue:function(fieldId, fieldValue){
                for(var i=0;i<this.pagedata.cachefieldvalues.length;i++){
                    if(this.pagedata.cachefieldvalues[i].id===fieldId){
                        this.pagedata.cachefieldvalues[i].value=fieldValue;
                        return;
                    }
                }
                this.pagedata.cachefieldvalues.push({id:fieldId,value:fieldValue});
          },
          setCacheFields:function(cachefields){
              this.pagedata.cachefieldvalues=cachefields;
          },

          /* find a specific form element from the pageForm
              @cache: passing the cache object to speed up the search on a same page
              @matchCriteria:rule for locating the element */
          findPageFormElement:function(cache,matchCriteria){
                   var elemmentToSearch="input";
                   if(matchCriteria.element){
                         elemmentToSearch=matchCriteria.element;
                   }
                   if(!cache[elemmentToSearch]){
                       cache[elemmentToSearch]={
                           elements:document.getElementsByTagName(elemmentToSearch)
                       };
                   }
                   var elementsToMatch=cache[elemmentToSearch].elements;

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
    /* The entry function when this script file is loaded */
     init:function(){
            chrome.runtime.onMessage.addListener(this.onExtensionMessageReceived.bind(this));
     },
     resetAll:function(){
       this.pagedata.cachefieldvalues=[];
       this.pagedata.pageForm=null;
       this.clearClearCacheTimer();
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
         else if(message.messageType==='update-cache-time'){
               this.updateClearCacheTime();
               replyBack({
                           messageType:message.messageType,
                           status:"success",
                           host:window.location.host,
                           content:null
                         });
         }

         else if(message.messageType==='get-page-config'){
              var pageConfig=this.getPageConfig();
              if(!pageConfig){
                replyBack({
                  messageType:message.messageType,
                  host:window.location.host,
                  status:"failed",
                  content:"no recognized form",
                  cacheTTL:this.pagedata.clearachefieldvalues.ttl
                });
              }
              else{
                replyBack({
                  messageType:message.messageType,
                  host:window.location.host,
                  cacheTTL:this.pagedata.clearachefieldvalues.ttl,
                  status:"success",
                  content:pageConfig
                });
              }

         }
         else if(message.messageType==='set-form-field'){
                if(!this.pagedata.pageForm){
                      replyBack({
                        messageType:message.messageType,
                        host:window.location.host,
                        status:"error",
                        content:"no form in the page"
                      });
                      return;
                }
                this.pagedata.pageForm.form.setFormFieldValue(message.content.fieldId,message.content.fieldValue);
                replyBack({
                            messageType:message.messageType,
                            host:window.location.host,
                            status:"success"
                           });
         }
         else if(message.messageType==='set-cache-field'){
            this.setFieldCacheValue(message.content.fieldId,message.content.fieldValue);
            replyBack({
                        messageType:message.messageType,
                        host:window.location.host,
                        status:"success"
                       });
         }
         else if(message.messageType==='set-all-cache-fields'){
            this.setCacheFields(message.content.cachefields);
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
                       cacheTTL:this.pagedata.clearachefieldvalues.ttl,
                       status:"success",
                       content:{
                                cachefields:this.getCacheFields()
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
     getPageConfig(){
        var pageForm=this.findMatchingPageForm();
        this.pagedata.pageForm=pageForm; //save it to use to set the value in the form when received input evens from mobile
        if(!pageForm){
              return null;
        }
        var pageConfig={
              host:window.location.host,
              form:{
                id:pageForm.form.id,
                title:pageForm.form.title,
                fields:[]
              }
        };
        for(var i=0;i<pageForm.form.fields.length;i++){
            var field=pageForm.form.fields[i];
            pageConfig.form.fields.push({
                id:field.id,
                label:field.label,
                type:field.type,
            });
        }
        return pageConfig;

     },


     /*find the form from page via the defined rule */
     findMatchingPageForm:function(){
               /*Matching Rules for finding the the Sign In Form.
               Each entry is a rule for matching the Sign In elements contained the sign in form.
               You can easily modify to support more websites/web applications.*/

              var cache={};
              for(var i=0;i<this.pageFormMatchingRules.length;i++){
                    var pageFormData={
                        matchingRule:this.pageFormMatchingRules[i],
                        form:{
                          id:"###username###"+"@"+window.location.host, // unique id for saving the form content in mobile automating the form-filling process.
                          title: "Sign In on "+window.location.host,  //Title of the form displayed on the mobile
                          fields:[],  //the fields to be displayed on the mobile screen, this will be populated in the next step
                          setFormFieldValue:function(fieldId, newValue){
                              if(this.fields.length){
                                  for(var i=0;i<this.fields.length;i++){
                                      if(this.fields[i].id===fieldId){
                                          if(this.fields[i].type==='button'){
                                              this.fields[i].formElement.click();
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
                                var event = new Event('change');
                                formElement.dispatchEvent(event);
                          }
                        }
                    };
                    var foundElement=null;
                    var matchingRule=null;

                    if(pageFormData.matchingRule.username){
                         matchingRule=pageFormData.matchingRule.username;
                         foundElement=this.findPageFormElement(cache,matchingRule); //find the userame element
                         if(foundElement){
                             pageFormData.form.fields.push({
                                    id:"username",
                                    label:"Username",
                                    type:"text",
                                    matchingRule:matchingRule,
                                    formElement:foundElement

                             });
                         }
                         else{
                           continue; //try the next rule
                         }
                    }
                    if(pageFormData.matchingRule.password){
                         matchingRule=pageFormData.matchingRule.password;
                         foundElement=this.findPageFormElement(cache,matchingRule); //find the password element
                         if(foundElement){
                           var passwordProperty={
                             id:"password",
                             label:"Password",
                             type:"secret",
                             matchingRule:matchingRule,
                             formElement:foundElement
                           };

                           if(pageFormData.matchingRule.confirmPassword){
                                matchingRule=pageFormData.matchingRule.confirmPassword;
                                foundElement=this.findPageFormElement(cache,matchingRule); //find the password element
                                if(foundElement){
                                  passwordProperty.confirm={
                                      formElement:foundElement
                                  };
                                }
                           }
                           pageFormData.form.fields.push(passwordProperty);
                         }
                         else{
                               continue;//try the next matching rule, for the password element could not be found with the current rule.
                         }
                    }




                   if(pageFormData.matchingRule.account){
                        matchingRule=pageFormData.matchingRule.account;
                        foundElement=this.findPageFormElement(cache,matchingRule); //find the account element, i.e. aws uses this
                        if(foundElement){
                            pageFormData.form.fields.push({
                                   id:"account",
                                   label:"Account",
                                   type:"text",
                                   matchingRule:matchingRule,
                                   formElement:foundElement

                            });
                        }
                        else{
                          continue; //try the next rule
                        }
                   }
                   if(pageFormData.matchingRule.twofactor){
                        matchingRule=pageFormData.matchingRule.twofactor;
                        foundElement=this.findPageFormElement(cache,matchingRule); //find the account element, i.e. aws uses this
                        if(foundElement){
                            pageFormData.form.fields.push({
                                   id:"twofactor",
                                   label:"Two Factor",
                                   type:"text",
                                   matchingRule:matchingRule,
                                   formElement:foundElement
                            });
                        }
                        else{
                          continue; //try the next rule
                        }
                   }

                   if(pageFormData.matchingRule.signIn){
                         matchingRule=pageFormData.matchingRule.signIn;
                         foundElement=this.findPageFormElement(cache,matchingRule); //find the submit element from the input tags
                         if(foundElement){
                             pageFormData.form.fields.push({
                                    id:"submit",
                                    label:"Login",
                                    type:"button",
                                    matchingRule:matchingRule,
                                    formElement:foundElement,
                             });
                         }
                         else{
                           continue; //try the next rule
                         }

                    }

                    if(pageFormData.matchingRule.createAccount){
                          matchingRule=pageFormData.matchingRule.createAccount;
                          foundElement=this.findPageFormElement(cache,matchingRule); //find the submit element from the input tags
                          if(foundElement){
                              pageFormData.form.fields.push({
                                     id:"createAccount",
                                     label:"Create Account",
                                     type:"button",
                                     matchingRule:matchingRule,
                                     formElement:foundElement,
                              });
                          }
                          else{
                            continue; //try the next rule
                          }

                     }


                    return pageFormData;

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

globalInputFormManager.init();







})();
