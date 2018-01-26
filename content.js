(function(){



  var globalInputEnabler={

    enableGlobalInput:function(){ //This function will do everything.

          if(document.getElementById("qrcode")){ //Dummy way of checking to see whether globalInput is already enabled
              //If there is a element named qrcode, then we assume the software already support Global Input
              //Atleast we do not want to display another QR code if it is displaying one regardless of whether it is GlobalInput or not
              console.log("globalinput is skipped:qrcode");
              return;
           }
           var allInputElements=document.getElementsByTagName("input"); //Collecting all the input elements

           if(allInputElements.length<2){
               //We assume that the sign In page should hage at least two input elements.
              console.log("globalinput is skipped:input element missing");
              return;
           }

           var allButtonElements=document.getElementsByTagName("button"); //Collecting all the input elements

           var allAElements=document.getElementsByTagName("a"); //Collecting all the input elements

           var signInForm=this.findSignInElements(allInputElements,allButtonElements,allAElements); //find the sign in form elements

           if(!signInForm){
               //this means we did not find the sign in form elements
               console.log("globalinput is skipped:sign in form missing");
               return;
           }
           var globalinputConfig={
                                 onSenderConnected:function(){
                                     //It comes here when the Global Input App has Connected.
                                     document.getElementById("globalInputMessage").innerHTML="Device connected";
                                 },
                                 onSenderDisconnected:function(){
                                   //It comes here when the Global Input App has Disconnected.
                                     document.getElementById("globalInputMessage").innerHTML="Device disconnected";
                                 },
                                 initData:{
                                     form:{
                                       id:    "###username###"+"@"+window.location.host,
                                       title: "Sign In",
                                       fields:[{
                                                 label:"Username",
                                                 id:"username",
                                                 operations:{
                                                     onInput:function(username){
                                                          //Comes here when you type something on the username field on your mobile
                                                          signInForm.usernameElement.value=username;
                                                     }
                                                 }
                                               },{
                                                  label:"Password",
                                                  id:"password",
                                                  type:"secret",
                                                  operations:{
                                                    onInput:function(password){
                                                      //Comes here when you type something on the password field on your mobile
                                                      signInForm.passwordElement.value=password;
                                                    }
                                                  }

                                               },{
                                                  label:"Login",
                                                  type:"button",
                                                  operations:{
                                                     onInput:function(){
                                                       //Comes here when you click on the "Login" button on your mobile
                                                        signInForm.submitElement.click();
                                                     }
                                                  }

                                               }]
                                           }
                                     }

                             };
      if(signInForm.accountElement){

        globalinputConfig.initData.form.fields.unshift({

                    label:"Account",
                    id:"account",
                    operations:{
                        onInput:function(account){
                             //Comes here when you type something on the username field on your mobile
                             signInForm.accountElement.value=account;
                        }
                    }

        });
      }

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
       find the sign in form from allInputElements and allButtonElements.
       allInputElements is an array that contains all the input elements in the page.
       allButtonElements is an array that contains all the button elements in the page.

    **/

    findSignInElements:function(allInputElements, allButtonElements,allAElements){



      /*This array is a collections of all possible types of Sign In form.
      Each elements describes the elements contained the sign in form.
      You can add more to support even more software and websites.*/
        var possibleSignInFormTypes=[
              {   //from confluence
                    username:{name:"os_username"},
                    password:{name:"os_password"},
                    signIn:  {element:"input", type:"submit",id:"loginButton"},
                    container:{parentDepth:5}
              },{   //from jira
                    username:{name:"os_username"},
                    password:{name:"os_password"},
                    signIn:  {element:"input", type:"submit",id:"login"},
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
                    signIn:  {element:"input", type:"submit", id:"signin"},
                    container:{parentDepth:2}
              },{
                    //dropbox
                    username:{name:"login_email"},
                    password:{name:"login_password"},
                    signIn:  {element:"button", type:"submit",className:"login-button button-primary"},
                    container:{parentDepth:3}
              },{
                    //wordpress
                    username:{id:"user_login"},
                    password:{id:"user_pass"},
                    signIn:  {element:"input", type:"submit",id:"wp-submit"},
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
                    signIn:  {element:"button", type:"submit",id:"submitButton2"},
                    container:{parentDepth:4}
              },{
                    //aws
                    account:{id:"account"},
                    username:{id:"username"},
                    password:{id:"password"},
                    signIn:  {element:"a", id:"signin_button"},
                    container:{parentDepth:2}
              }

       ];

       for(var i=0;i<possibleSignInFormTypes.length;i++){
                    var signInElements={};
                    signInElements.usernameElement=this.findUsernameElement(allInputElements,possibleSignInFormTypes[i]); //find the userame element
                    if(!signInElements.usernameElement){
                        continue; //try the next
                    }
                    signInElements.passwordElement=this.findPasswordElement(allInputElements,possibleSignInFormTypes[i]); //find the password element
                    if(!signInElements.passwordElement){
                          continue;//try the next
                    }
                    signInElements.submitElement=this.findSubmitElement(allInputElements,allButtonElements,allAElements,possibleSignInFormTypes[i]); //find the submit element
                    if(!signInElements.submitElement){
                        continue;//try the next
                    }
                    signInElements.accountElement=this.findAccountElement(allInputElements,possibleSignInFormTypes[i]); //find the account element, account may require in AWS
                    //Container for placing the QR Code
                    signInElements.container=this.findParentElement(signInElements.usernameElement,possibleSignInFormTypes[i].container.parentDepth);
                    return signInElements;
       }
       return null;
    },


    /**
       find the Account element from allInputElements.
       allInputElements is an array that contains all the input elements in the page.
    **/

    findAccountElement(allInputElements,possibleSignInFormType){
      var accountElement=null;
      if(!possibleSignInFormType.account){
        return null;
      }
      if(possibleSignInFormType.account.id){
          accountElement=this.findElementsByAttribute(allInputElements,"id",possibleSignInFormType.account.id);
      }
      if(accountElement){
        return accountElement;
      }
      accountElement=this.findElementsByAttribute(allInputElements,"name",possibleSignInFormType.account.name);
      return accountElement;
    },



    /**
       find the Username element from allInputElements.
       allInputElements is an array that contains all the input elements in the page.
    **/

    findUsernameElement(allInputElements,possibleSignInFormType){
      var userNameElement=null;
      if(possibleSignInFormType.username.id){
          userNameElement=this.findElementsByAttribute(allInputElements,"id",possibleSignInFormType.username.id);
      }
      if(userNameElement){
        return userNameElement;
      }
      userNameElement=this.findElementsByAttribute(allInputElements,"name",possibleSignInFormType.username.name);
      return userNameElement;
    },




    /**
       find the password element from allInputElements.
       allInputElements is an array that contains all the input elements in the page.
    **/
    findPasswordElement(allInputElements,possibleSignInFormType){
      var passwordElement=null;
      if(possibleSignInFormType.password.id){
          passwordElement=this.findElementsByAttribute(allInputElements,"id",possibleSignInFormType.password.id);
      }
      if(passwordElement){
        return passwordElement;
      }
      passwordElement=this.findElementsByAttribute(allInputElements,"name",possibleSignInFormType.password.name);
      return passwordElement;
    },




    /**
       find the submit button from allInputElements and allButtonElements.
       allInputElements is an array that contains all the input elements in the page.
       allButtonElements is an array that contains all the button elements in the page.

    **/


    findSubmitElement:function(allInputElements,allButtonElements,allAElements, possibleSignInFormType){
          var submitElement=null;
          var elementsToSearch=null;

          if(possibleSignInFormType.signIn.element ==='input'){
                elementsToSearch=allInputElements;
          }
          else if(possibleSignInFormType.signIn.element ==='button'){
                elementsToSearch=allButtonElements;
          }
          else if(possibleSignInFormType.signIn.element ==='a'){
                elementsToSearch=allAElements;
          }
          else{
              console.log("sign in element type is not concifgured:"+JSON.stringify(possibleSignInFormType));
              return null;
          }

          if(possibleSignInFormType.signIn.id && possibleSignInFormType.signIn.type){
                submitElement=this.findElementsByTwoAttribute(elementsToSearch,"id", possibleSignInFormType.signIn.id, "type", possibleSignInFormType.signIn.type);

          }
          else if(possibleSignInFormType.signIn.id){
                submitElement=this.findElementsByAttribute(elementsToSearch,"id", possibleSignInFormType.signIn.id);
          }
          else if(possibleSignInFormType.signIn.name && possibleSignInFormType.signIn.type){
                submitElement=this.findElementsByTwoAttribute(elementsToSearch,"name", possibleSignInFormType.signIn.name, "type", possibleSignInFormType.signIn.type);
          }
          else if(possibleSignInFormType.signIn.name){
                submitElement=this.findElementsByAttribute(elementsToSearch,"name", possibleSignInFormType.signIn.name);
          }
          else if(possibleSignInFormType.signIn.className && possibleSignInFormType.signIn.type){
                submitElement=this.findElementsByTwoAttribute(elementsToSearch,"class", possibleSignInFormType.signIn.className, "type", possibleSignInFormType.signIn.type);
          }
          return   submitElement;
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
