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


           var possibleSignInFeatures=[
             //This array is a collections of all possible names of Sign In form elements.
             //You can add more to support more software and websites.
                   {
                         username:{name:"os_username"},
                         password:{name:"os_password"},
                         signIn:  {name:"login"},
                         container:{parentDepth:5}
                   },{
                         username:{name:"user[login]"},
                         password:{name:"user[password]"},
                         signIn:  {name:"commit"},
                         container:{parentDepth:5}
                   },{
                         username:{name:"login"},
                         password:{name:"password"},
                         signIn:  {name:"commit"},
                         container:{parentDepth:2}
                   },{
                         username:{name:"username"},
                         password:{name:"password"},
                         signIn:  {name:"submit"},
                         container:{parentDepth:2}
                   },{
                         username:{name:"username"},
                         password:{name:"password"},
                         signIn:  {name:"login"},
                         container:{parentDepth:3}
                   },{
                         username:{name:"username"},
                         password:{name:"password"},
                         signIn:  {id:"signin"},
                         container:{parentDepth:2}
                   },{
                         username:{name:"login_email"},
                         password:{name:"login_password"},
                         signIn:  {className:"login-button button-primary"},
                         container:{parentDepth:3}
                   },{
                         username:{id:"user_login"},
                         password:{id:"user_pass"},
                         signIn:  {id:"wp-submit"},
                         container:{parentDepth:3}
                   },{
                         username:{id:"input-username"},
                         password:{id:"input-password"},
                         signIn:  {type:"button", className:"btn btn-primary"},
                         container:{parentDepth:3}
                   }

            ];
            var signInForm=null;



            for(var i=0;i<possibleSignInFeatures.length;i++){
                  //Finding the sign in form elements
                  signInForm=this.findSignInElements(possibleSignInFeatures[i],allInputElements, allButtonElements);
                  if(signInForm){//found the Sign In Form Elements
                        break;
                  }
            }
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

    findSignInElements:function(possibleSignInFeature,allInputElements, allButtonElements){
      var signInElements={};
      signInElements.usernameElement=this.findUsernameElement(allInputElements,possibleSignInFeature); //find the userame element
      if(!signInElements.usernameElement){
        return null;
      }
      signInElements.passwordElement=this.findPasswordElement(allInputElements,possibleSignInFeature); //find the password element
      if(!signInElements.passwordElement){
          return null;
      }
      signInElements.submitElement=this.findSubmitElement(allInputElements,allButtonElements,possibleSignInFeature); //find the submit element
      if(!signInElements.submitElement){
              return null;
       }
       //Container for placing the QR Code
      signInElements.container=this.findParentElement(signInElements.usernameElement,possibleSignInFeature.container.parentDepth);
      return signInElements;
    },


    /**
       find the Username element from allInputElements.
       allInputElements is an array that contains all the input elements in the page.
    **/

    findUsernameElement(allInputElements,possibleSignInFeature){
      var userNameElement=null;
      if(possibleSignInFeature.username.id){
          userNameElement=this.findElementsByAttribute(allInputElements,"id",possibleSignInFeature.username.id);
      }
      if(userNameElement){
        return userNameElement;
      }
      userNameElement=this.findElementsByAttribute(allInputElements,"name",possibleSignInFeature.username.name);
      return userNameElement;
    },


    /**
       find the password element from allInputElements.
       allInputElements is an array that contains all the input elements in the page.
    **/
    findPasswordElement(allInputElements,possibleSignInFeature){
      var passwordElement=null;
      if(possibleSignInFeature.password.id){
          passwordElement=this.findElementsByAttribute(allInputElements,"id",possibleSignInFeature.password.id);
      }
      if(passwordElement){
        return passwordElement;
      }
      passwordElement=this.findElementsByAttribute(allInputElements,"name",possibleSignInFeature.password.name);
      return passwordElement;
    },




    /**
       find the submit button from allInputElements and allButtonElements.
       allInputElements is an array that contains all the input elements in the page.
       allButtonElements is an array that contains all the button elements in the page.

    **/


    findSubmitElement:function(allInputElements,allButtonElements,possibleSignInFeature){
      var submitElement=null;
      if((!possibleSignInFeature.signIn.type) || possibleSignInFeature.signIn.type ==='input'){
                if(possibleSignInFeature.signIn.id){
                      submitElement=this.findElementsByTwoAttribute(allInputElements,"id", possibleSignInFeature.signIn.id, "type", "submit");
                }
                else {
                      submitElement=this.findElementsByTwoAttribute(allInputElements,"name", possibleSignInFeature.signIn.name, "type", "submit");
                }
                if(submitElement){
                  return submitElement;
                }
      }
      if((!possibleSignInFeature.signIn.type) || possibleSignInFeature.signIn.type ==='button'){
          if(possibleSignInFeature.signIn.id){
                submitElement=this.findElementsByTwoAttribute(allButtonElements,"id", possibleSignInFeature.signIn.id, "type", "submit");
          }
          else if(possibleSignInFeature.signIn.className){
                submitElement=this.findElementsByTwoAttribute(allButtonElements,"class", possibleSignInFeature.signIn.className, "type", "submit");
          }
          else {
                submitElement=this.findElementsByTwoAttribute(allButtonElements,"name", possibleSignInFeature.signIn.name, "type", "submit");
          }
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
