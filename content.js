(function(){



  var globalInputEnabler={

    enableGlobalInput:function(){
          if(document.getElementById("qrcode")){
              //If there is a element named qrcode, then we assume the software already support Global Input
              console.log("globalinput is skipped:qrcode");
              return;
           }
           var allInputElements=document.getElementsByTagName("input");
           if(allInputElements.length<2){
               //We assume the sign In page should hage at least two input elenents.
              console.log("globalinput is skipped:input element missing");
              return;
           }
           var possibleSignInFeatures=[
                   {
                         username:"os_username",
                         password:"os_password",
                         signIn:"login",
                         parentDepth:5
                   },{
                         username:"user[login]",
                         password:"user[password]",
                         signIn:  "commit",
                         parentDepth:5
                   },{
                         username:"login",
                         password:"password",
                         signIn:  "commit",
                         parentDepth:2
                   },{
                         username:"username",
                         password:"password",
                         signIn:  "submit",
                         parentDepth:2
                   },{
                         username:"username",
                         password:"password",
                         signIn:  "login",
                         parentDepth:3
                   }
            ];
            var signInForm=null;
            var signInFormParentDepth=1;

            for(var i=0;i<possibleSignInFeatures.length;i++){
                  signInForm=this.findSignInElementsByNames(possibleSignInFeatures[i].username,
                                                 possibleSignInFeatures[i].password,
                                                 possibleSignInFeatures[i].signIn,
                                                 allInputElements);
                  if(signInForm){
                        signInFormParentDepth=possibleSignInFeatures[i].parentDepth;
                        break;
                  }
            }


           if(!signInForm){
               console.log("globalinput is skipped:sign in form missing");
               return;
           }


           var globalinputConfig={
                                 onSenderConnected:function(){
                                     document.getElementById("globalInputMessage").innerHTML="Device connected";
                                 },
                                 onSenderDisconnected:function(){
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
                                                          signInForm.usernameElement.value=username;
                                                     }
                                                 }
                                               },{
                                                  label:"Password",
                                                  id:"password",
                                                  type:"secret",
                                                  operations:{
                                                    onInput:function(password){
                                                      signInForm.passwordElement.value=password;
                                                    }
                                                  }

                                               },{
                                                  label:"Login",
                                                  type:"button",
                                                  operations:{
                                                     onInput:function(){
                                                        signInForm.submitElement.click();
                                                     }
                                                  }

                                               }]
                                           }
                                     }

                             };


      var globalInputApi=require("global-input-message");
      var globalInputConnector=globalInputApi.createMessageConnector();
      globalInputConnector.connect(globalinputConfig);
      var qrCodedata=globalInputConnector.buildInputCodeData();



      var parentElement=this.findParentElement(signInForm.usernameElement,signInFormParentDepth); //Container for placing the QR Code
             var qrCodeContainer = document.createElement('div');
             qrCodeContainer.id="qrcode"; //this is where the QR code will be generated


             qrCodeContainer.style.display='flex';
             qrCodeContainer.style['display-direction']='row';
             qrCodeContainer.style['justify-content']='center';

             qrCodeContainer.style['z-index']=1000;
             qrCodeContainer.textContent = '';

      parentElement.appendChild(qrCodeContainer);
             var messageContainer = document.createElement('div');
             messageContainer.id="globalInputMessage";
             messageContainer.textContent = '';
      parentElement.appendChild(messageContainer);

      var qrcode = new QRCode(qrCodeContainer, {
                    text: qrCodedata,
                    width:250,
                    height: 250,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                 });

    },







    findSignInElementsByNames:function(nameValueForUsername, nameValueForPassword, nameValueForSubmit,allInputElements){
      var signInElements={};
      signInElements.usernameElement=this.findElementsByAttribute(allInputElements,"name",nameValueForUsername);
      if(!signInElements.usernameElement){
        return null;
      }
      signInElements.passwordElement=this.findElementsByAttribute(allInputElements,"name",nameValueForPassword);
      if(!signInElements.passwordElement){
        return null;
      }
      signInElements.submitElement=this.findElementsByTwoAttribute(allInputElements,"name", nameValueForSubmit, "type", "submit");
      if(!signInElements.submitElement){
          return null;
      }
      return signInElements;
    },
    findElementsByAttribute:function(allInputElements, attributename, attributevalue){
        for(var x=0;x<allInputElements.length;x++){
            if(allInputElements[x].getAttribute(attributename) === attributevalue){
                return allInputElements[x];
            }
        }
        return null;
   },
   findElementsByTwoAttribute:function(allInputElements, attributename1, attributevalue1,attributename2, attributevalue2){
       for(var x=0;x<allInputElements.length;x++){
           if(allInputElements[x].getAttribute(attributename1) === attributevalue1 && allInputElements[x].getAttribute(attributename2) === attributevalue2){
               return allInputElements[x];
           }
       }
       return null;
  },
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

      globalInputEnabler.enableGlobalInput();


})();
