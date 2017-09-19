(function(){

  function findAllInputElements(){
    return document.getElementsByTagName("input");
  }
  function findElementByName(inputs, namevalue){
    for(var x=0;x<inputs.length;x++){
        if(inputs[x].getAttribute('name') === namevalue){
            return inputs[x];
        }
    }
    return null;
  }
  function findElementByNameAndType(inputs, namevalue, typevalue){
    var foundelement=findElementByName(inputs,namevalue);
    if(!foundelement){
      return null;
    }
    if(foundelement.getAttribute("type")!==typevalue){
      return false;
    }
    return foundelement;
  }
  function findElementByNameAndTypeAndValue(inputs, namevalue, typevalue, valuevalue){
    var foundelement=findElementByName(inputs,namevalue);
    if(!foundelement){
      return null;
    }
    if(foundelement.getAttribute("type")!==typevalue){
      return false;
    }
    if(foundelement.getAttribute("value")!==valuevalue){
      return false;
    }
    return foundelement;
  }
  function findElementByTypeAndValue(inputs, typevalue, valuevalue){

    for(var x=0;x<inputs.length;x++){
        if(inputs[x].getAttribute('type') === typevalue && inputs[x].getAttribute('value') === valuevalue ){
            return inputs[x];
        }
    }
    return null;
  }
  function findLoginContainerFromInput(inputElement, nParent){
    var currentElement=inputElement;
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




  function processConfluencePage(inputs,config){
        var usernameelement=findElementByNameAndType(inputs,"os_username", "text");
        if(!usernameelement){
          console.log("not a confluence: username");
          return false;
        }
        var passwordlement=findElementByNameAndType(inputs,"os_password", "password");
        if(!passwordlement){
          console.log("not a confluence");
          return false;
        }
        var submitButton=findElementByNameAndTypeAndValue(inputs,"login", "submit","Log in");
        if(!submitButton){
          console.log("not a confluence:missing submit button");
          return false;
        }
        var parentContainer=findLoginContainerFromInput(usernameelement,4);
        config.username={
          element:usernameelement,
          label:"Username"
        };
        config.password={
          element:passwordlement,
          label:"Password",
        };
        config.loginButton={
          element:submitButton,
          label:"Log in"
        }
        config.qrCodeContainer={
          element:parentContainer
        }
        config.id="confluence"+config.id;
        return true;
  }

  function processJIRAPage(inputs,config){
        var usernameelement=findElementByNameAndType(inputs,"os_username", "text");
        if(!usernameelement){
          console.log("not a JIRA: username");
          return false;
        }
        var passwordlement=findElementByNameAndType(inputs,"os_password", "password");
        if(!passwordlement){
          console.log("not a JIRA");
          return false;
        }
        var submitButton=findElementByNameAndTypeAndValue(inputs,"login", "submit","Log In");
        if(!submitButton){
          console.log("not a JIRA:missing submit button");
          return false;
        }
        var parentContainer=findLoginContainerFromInput(usernameelement,5);
        config.username={
          element:usernameelement,
          label:"Username"
        };
        config.password={
          element:passwordlement,
          label:"Password",
        };
        config.loginButton={
          element:submitButton,
          label:"Log in"
        }
        config.qrCodeContainer={
          element:parentContainer
        }
        config.id="jira"+config.id;
        return true;
  }

  function processGitLabPage(inputs,config){
        var usernameelement=findElementByNameAndType(inputs,"user[login]", "text");
        if(!usernameelement){
          console.log("not a GitLab: username");
          return false;
        }
        var passwordlement=findElementByNameAndType(inputs,"user[password]", "password");
        if(!passwordlement){
          console.log("not a GitLab");
          return false;
        }
        var submitButton=findElementByNameAndTypeAndValue(inputs,"commit", "submit","Sign in");
        if(!submitButton){
          console.log("not a GitLab:missing submit button");
          return false;
        }
        var parentContainer=findLoginContainerFromInput(usernameelement,5);
        config.username={
          element:usernameelement,
          label:"Username"
        };
        config.password={
          element:passwordlement,
          label:"Password",
        };
        config.loginButton={
          element:submitButton,
          label:"Sign in"
        }
        config.qrCodeContainer={
          element:parentContainer
        }
        config.id="GitLab"+config.id;
        return true;
  }

  function processGithubPage(inputs,config){
        var usernameelement=findElementByNameAndType(inputs,"login", "text");
        if(!usernameelement){
          console.log("not a Github: username");
          return false;
        }
        var passwordlement=findElementByNameAndType(inputs,"password", "password");
        if(!passwordlement){
          console.log("not a Guthub");
          return false;
        }
        var submitButton=findElementByNameAndTypeAndValue(inputs,"commit", "submit","Sign in");
        if(!submitButton){
          console.log("not a GitLab:missing submit button");
          return false;
        }
        var parentContainer=findLoginContainerFromInput(usernameelement,2);
        config.username={
          element:usernameelement,
          label:"Username"
        };
        config.password={
          element:passwordlement,
          label:"Password",
        };
        config.loginButton={
          element:submitButton,
          label:"Sign in"
        }
        config.qrCodeContainer={
          element:parentContainer
        }
        config.id="Github"+config.id;
        return true;
  }

  function processLucidchartPage(inputs,config){
        var usernameelement=findElementByNameAndType(inputs,"username", "text");
        if(!usernameelement){
          console.log("not a Lucidchart: username");
          return false;
        }
        var passwordlement=findElementByNameAndType(inputs,"password", "password");
        if(!passwordlement){
          console.log("not a Lucidchart");
          return false;
        }
        var submitButton=findElementByTypeAndValue(inputs,"submit","Log in");
        if(!submitButton){
          console.log("not a Lucidchart:missing submit button");
          return false;
        }
        var parentContainer=findLoginContainerFromInput(usernameelement,2);
        config.username={
          element:usernameelement,
          label:"Username"
        };
        config.password={
          element:passwordlement,
          label:"Password",
        };
        config.loginButton={
          element:submitButton,
          label:"Log in"
        }
        config.qrCodeContainer={
          element:parentContainer
        }
        config.id="Lucidchart"+config.id;
        return true;
  }

  function isAlreadyGlobalInputEnable(){
        var existingqrcodeelement=document.getElementById("qrcode");
        return existingqrcodeelement
  }


  function createQRCodePlaceHolder(qrcodecontainer){
           var div = document.createElement('div');
           div.id="qrcode";
           div.style.display='flex';
           div.style['display-direction']='row';
           div.style['justify-content']='center';
           div.style['z-index']=1000;

           div.textContent = '';
           qrcodecontainer.appendChild(div);

           div = document.createElement('div');
           div.id="globalInputMessage";
           div.textContent = '';
           qrcodecontainer.appendChild(div);
   };

   function formSelector(){
       var config={id:"@"+window.location.host, title: "Sign In on "+window.location.host};
       var inputs=findAllInputElements();
       if(processConfluencePage(inputs,config)){
         return config;
       }
       if(processJIRAPage(inputs,config)){
         return config;
       }
       if(processGitLabPage(inputs,config)){
         return config;
       }
       if(processGithubPage(inputs,config)){
         return config;
       }
       if(processLucidchartPage(inputs,config)){
         return config;
       }

       return null;
   }


   function createGlobalInput(formSelected){
       var globalinput={
           api:require("global-input-message")
       };
     globalinput.config={
                           onSenderConnected:function(){
                               document.getElementById("globalInputMessage").innerHTML="Device connected";
                           },
                           onSenderDisconnected:function(){
                               document.getElementById("globalInputMessage").innerHTML="Device disconnected";
                           },
                           initData:{

                               form:{
                                 id:  formSelected.id,
                                 title: formSelected.title,
                                 fields:[{
                                           label:formSelected.username.label,
                                           id:"username",
                                           operations:{
                                               onInput:function(username){
                                                    formSelected.username.element.value=username;
                                               }
                                           }
                                         },{
                                            label:formSelected.password.label,
                                            id:"password",
                                            type:"secret",
                                            operations:{
                                              onInput:function(password){
                                                formSelected.password.element.value=password;
                                              }
                                            }

                                         },{
                                            label:formSelected.loginButton.label,
                                            type:"button",
                                            operations:{
                                               onInput:function(){
                                                 if(formSelected.loginButton.element){
                                                   formSelected.loginButton.element.click();
                                                 }
                                               }
                                            }

                                         }]
                                     }
                               }

                       };
           return globalinput;
   }

  function enableGlobalInput(){
      if(isAlreadyGlobalInputEnable()){
        console.log("Global input seems enabled already!");
        return;
      }
      var formSelected=formSelector();
      if(!formSelected){
        console.log("Global Input is disabled for this page");
        return;
      }
     createQRCodePlaceHolder(formSelected.qrCodeContainer.element);
     var globalinput=createGlobalInput(formSelected);
     globalinput.connector=globalinput.api.createMessageConnector();
     globalinput.connector.connect(globalinput.config);
     var codedata=globalinput.connector.buildInputCodeData();
     var qrcode = new QRCode(document.getElementById("qrcode"), {
                         text: codedata,
                         width:250,
                         height: 250,
                         colorDark : "#000000",
                         colorLight : "#ffffff",
                         correctLevel : QRCode.CorrectLevel.H
     });

  }
  enableGlobalInput();



})();
