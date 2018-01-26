(function(){



  var globalInputEnabler={

    /*
    This will do the following:
       1. Find the Sign In Form Elements from the page.
       2. Display a QR Code beside or below the Sign In Form.
          The QR Code contains the necessary information for the Global Input App to connect.
       3. When the Global Input App has connected, the JS library sends the JSON data to the app describing the Sign In UI so that Global Input App can display
          the corresponding Sign IN form on the mobile screen.
       4. When the user has interacted with the form, the call back methods will be invoked.
       5. The callback method can be implemented to set the value in the Sign In Form etc.
    */
    enableGlobalInput:function(){

          if(document.getElementById("qrcode")){ //Dummy way of checking to see whether globalInput is already enabled
              //If there is a element named qrcode, then we assume the software already support Global Input
              //Atleast we do not want to display another QR code if it is displaying one regardless of whether it is GlobalInput or not
              console.log("globalinput is skipped:qrcode");
              return;
           }
           var allInputElements=document.getElementsByTagName("input"); //Collecting all the input elements

           if(allInputElements.length<2){
               //We assume that the sign In page should have at least two input elements.
              console.log("globalinput is skipped: input elements are missing");
              return;
           }

           var allButtonElements=document.getElementsByTagName("button"); //All the button elements

           var allALinkElements=document.getElementsByTagName("a"); //All the a tag elements

           var signInForm=this.findSignInForm(allInputElements,allButtonElements,allALinkElements); //find all the sign in form elements from the page.

           if(!signInForm){
               //No sign in form elements
               console.log("globalinput is skipped: sign in form is missing.");
               return;
           }
           var globalinputConfig={
                                 onSenderConnected:function(){
                                     //This will be executed when the Global Input App has Connected.
                                     document.getElementById("globalInputMessage").innerHTML="Device connected";
                                 },
                                 onSenderDisconnected:function(){
                                   //This will be executed when the Global Input App has disconnected.
                                     document.getElementById("globalInputMessage").innerHTML="Device disconnected";
                                 },
                                 initData:{
                                     form:{
                                       id:    "###username###"+"@"+window.location.host, // unique id for saving the form content on mobile automating the form-filling process.
                                       title: "Sign In",  //Title of the form displayed on the mobile
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

      var globalInputApi=require("global-input-message"); //get the Global Input Api
      var globalInputConnector=globalInputApi.createMessageConnector(); //Create the connector
      globalInputConnector.connect(globalinputConfig);  //connect to the proxy.
      var qrCodedata=globalInputConnector.buildInputCodeData(); //Get the QR Code value generated that includes the end-to-end encryption key and the other information necessary for the app to establish the communication
      console.log("code data:[["+qrCodedata+"]]");

             var qrCodeContainer = document.createElement('div');
             qrCodeContainer.id="qrcode"; //this is where the QR code will be generated


             qrCodeContainer.style.display='flex';
             qrCodeContainer.style['display-direction']='row';
             qrCodeContainer.style['justify-content']='center';

             qrCodeContainer.style['z-index']=1000;
             qrCodeContainer.textContent = '';

      signInForm.container.appendChild(qrCodeContainer); //signInForm.container is the container of the sign in form, so we can insert the qrcode container into the container.
             var messageContainer = document.createElement('div');
             messageContainer.id="globalInputMessage";
             messageContainer.textContent = '';
      signInForm.container.appendChild(messageContainer);//we  also insert the message container that displays the connected message when the global input app is connected.

      //Now we can create and display a QR Code inside the element qrCodeContainer with the value specified in qrCodedata
      var qrcode = new QRCode(qrCodeContainer, {
                    text: qrCodedata,
                    width:250,
                    height: 250,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                 });

    },





    /**
       find the sign in text fields from the allInputElements, allButtonElements and allALinkElements.
    **/

    findSignInForm:function(allInputElements, allButtonElements,allALinkElements){
        /*Matching Rules for finding the the Sign In Form.
        Each entry is a rule for matching the Sign In elements contained the sign in form.
        You can easily modify to support more websites/web applications.*/
        var signInFormMatchingRules=[
              {   //from confluence
                    username:{name:"os_username"},
                    password:{name:"os_password"},
                    signIn:  {element:"input", id:"loginButton"},
                    container:{parentDepth:5}
              },{   //from jira
                    username:{name:"os_username"},
                    password:{name:"os_password"},
                    signIn:  {element:"input", id:"login"},
                    container:{parentDepth:5}
              },{
                    //from gitlab
                    username:{name:"user[login]"},
                    password:{name:"user[password]"},
                    signIn:  {element:"input", type:"submit", name:"commit"},
                    container:{parentDepth:5}
              },{   //from github
                    username:{name:"login"},
                    password:{name:"password"},
                    signIn:  {element:"input", type:"submit",name:"commit"},
                    container:{parentDepth:2}
              },{
                   //123-reg
                    username:{name:"username"},
                    password:{name:"password"},
                    signIn:  {element:"button", type:"submit", name:"login"},
                    container:{parentDepth:3}
              },{
                   //lona.co.uk
                    username:{name:"username"},
                    password:{name:"password"},
                    signIn:  {element:"button", type:"submit", className:"btn btn-primary"},
                    container:{parentDepth:3}
              },{
                    //lucidchart
                    username:{name:"username"},
                    password:{name:"password"},
                    signIn:  {element:"input", id:"signin"},
                    container:{parentDepth:2}
              },{
                    //dropbox
                    username:{name:"login_email"},
                    password:{name:"login_password"},
                    signIn:  {element:"button", type:"submit", className:"login-button button-primary"},
                    container:{parentDepth:3}
              },{
                    //wordpress
                    username:{id:"user_login"},
                    password:{id:"user_pass"},
                    signIn:  {element:"input", id:"wp-submit"},
                    container:{parentDepth:3}
              },{
                    username:{id:"input-username"},
                    password:{id:"input-password"},
                    signIn:  {element:"button", type:"submit", className:"btn btn-primary"},
                    container:{parentDepth:3}
              },{
                    //developer.apple.com
                    username:{id:"accountname"},
                    password:{id:"accountpassword"},
                    signIn:  {element:"button", id:"submitButton2"},
                    container:{parentDepth:4}
              },{
                    //aws
                    account:{id:"account"},
                    username:{id:"username"},
                    password:{id:"password"},
                    signIn:  {element:"a", id:"signin_button"},
                    container:{parentDepth:2}
              },{
                    //aws
                    password:{id:"ap_password"},
                    signIn: {element:"input", id:"signInSubmit-input"},
                    container:{parentDepth:3}
              }

       ];

       for(var i=0;i<signInFormMatchingRules.length;i++){
             var matchingRule=signInFormMatchingRules[i];
             var signInElements={};
             signInElements.passwordElement=this.findSignInElement(allInputElements,matchingRule.password); //find the password element
             if(!signInElements.passwordElement){
                  continue;//try the next matching rule, for the password element could not be found with the current rule.
             }
             if(matchingRule.username){
                  signInElements.usernameElement=this.findSignInElement(allInputElements,matchingRule.username); //find the userame element
                  if(!signInElements.usernameElement){
                              continue; //try the next rule
                  }
             }
            if(matchingRule.account){
                 signInElements.accountElement=this.findSignInElement(allInputElements,matchingRule.account); //find the account element, i.e. aws uses this
                 if(!signInElements.accountElement){
                              continue; //try the next
                 }
            }
            if(matchingRule.signIn.element==="input"){
                 signInElements.submitElement=this.findSignInElement(allInputElements,matchingRule.signIn); //find the submit element from the input tags
                 if(!signInElements.submitElement){
                      continue; //try the next
                }

            }
            else if(matchingRule.signIn.element==="button"){
                signInElements.submitElement=this.findSignInElement(allButtonElements,matchingRule.signIn); //find the submit element from the button tags
                if(!signInElements.submitElement){
                        continue; //try the next
                }
            }
            else if(matchingRule.signIn.element==="a"){
                signInElements.submitElement=this.findSignInElement(allALinkElements,matchingRule.signIn); //find the submit element from the a tags
                if(!signInElements.submitElement){
                    continue; //try the next
                }
            }
            //Container for placing the QR Code
            signInElements.container=this.findParentElement(signInElements.passwordElement,matchingRule.container.parentDepth);
            return signInElements;
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
              submitElement=this.findElementsByTwoAttribute(allElements,"type", matchCriteria.type, "name", matchCriteria.name);
        }
        else if(matchCriteria.name){ //find element by type and name attribute
              return this.findElementsByAttribute(allElements,"name",matchCriteria.name);
         }
        else if(matchCriteria.className && matchCriteria.type){ //find element by class and type attribute
              submitElement=this.findElementsByTwoAttribute(allElements,"class", matchCriteria.className, "type", matchCriteria.type);
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

  /**
  find the parent element by travelling upwards nParent times
  **/
  findParentElement:function(currentElement, nParent){
      for(var i=0;i<nParent;i++){
            if(currentElement.parentElement){
                  currentElement=currentElement.parentElement;
            }
            else{
                break;
            }
      }
      return currentElement;
   }


 };

      globalInputEnabler.enableGlobalInput(); //This is the entry point for the chrome extension


})();
