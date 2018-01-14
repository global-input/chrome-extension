(function(){

  function findAllInputElements(){
    return document.getElementsByTagName("input");
  }

  function findButtonByTypeNameAndValue(typevalue,namevalue,valuevalue){
    var buttons=document.getElementsByTagName("button");
    for(var x=0;x<buttons.length;x++){
        if(buttons[x].getAttribute('type') === typevalue && buttons[x].getAttribute('name') === namevalue && buttons[x].getAttribute('value') === valuevalue){
            return buttons[x];
        }
    }
    return null;
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

    for(var x=0;x<inputs.length;x++){
        if(inputs[x].getAttribute('name') === namevalue && inputs[x].getAttribute('type') === typevalue){
            return inputs[x];
        }
    }
    return null
  }
  function findElementByNameAndTypeAndValue(inputs, namevalue, typevalue, valuevalue){
    for(var x=0;x<inputs.length;x++){
        if(inputs[x].getAttribute('name') === namevalue && inputs[x].getAttribute('type') === typevalue && inputs[x].getAttribute('value') === valuevalue){
            return inputs[x];
        }
    }
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

var formDataBuilders=[{
build:function(){
        return {

               id:    "confluence",
               username:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"os_username", "text");
                           },
                           label:"Username",
                           container:function(inputs){
                              var usernameelement=this.find(inputs);
                              return findLoginContainerFromInput(usernameelement,4);
                           }
               },
               password:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"os_password", "password");
                           },
                           label:"Password"
               },
               submit:{
                           find:function(inputs){
                                          return findElementByNameAndTypeAndValue(inputs,"login", "submit","Log in");
                           },
                           label:"Log in"
               }
        }
    }

  },{
  build:function(){
        return {
               id:    "jira",
               username:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"os_username", "text");
                           },
                           label:"Username",
                           container:function(inputs){
                              var usernameelement=this.find(inputs);
                              return findLoginContainerFromInput(usernameelement,5);
                           }
               },
               password:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"os_password", "password");
                           },
                           label:"Password"
               },
               submit:{
                           find:function(inputs){
                                          return findElementByNameAndTypeAndValue(inputs,"login", "submit","Log In");
                           },
                           label:"Log in"
               }
        }
     }
  },{
  build:function(){
        return {
               id:    "gitlab",
               username:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"user[login]", "text");
                           },
                           label:"Username",
                           container:function(inputs){
                              var usernameelement=this.find();
                              return findLoginContainerFromInput(usernameelement,5);
                           }
               },
               password:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"user[password]", "password");
                           },
                           label:"Password"
               },
               submit:{
                           find:function(inputs){
                                          return findElementByNameAndTypeAndValue(inputs,"commit", "submit","Sign in");
                           },
                           label:"Sign in"
               }
        }
     }
  },{

  build:function(){
        return {
               id:    "github",
               username:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"login", "text");
                           },
                           label:"Username",
                           container:function(inputs){
                              var usernameelement=this.find(inputs);
                              return findLoginContainerFromInput(usernameelement,2);
                           }
               },
               password:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"password", "password");
                           },
                           label:"Password"
               },
               submit:{
                           find:function(inputs){
                                          return findElementByNameAndTypeAndValue(inputs,"commit", "submit","Sign in");
                           },
                           label:"Sign in"
               }
        }
     }
  },{


  build:function(){
        return {
               id:    "lucidchart",
               username:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"username", "text");
                           },
                           label:"Username",
                           container:function(inputs){
                              var usernameelement=this.find(inputs);
                              return findLoginContainerFromInput(usernameelement,2);
                           }
               },
               password:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"password", "password");
                           },
                           label:"Password"
               },
               submit:{
                           find:function(inputs){
                                          return findElementByTypeAndValue(inputs,"submit","Log in");
                           },
                           label:"Log in"
               }
        }
     }
  },{
  build:function(){
        return {
               id:    "123reg",
               username:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"username", "text");
                           },
                           label:"Username",
                           container:function(inputs){
                              var usernameelement=this.find(inputs);
                              return findLoginContainerFromInput(usernameelement,3);
                           }
               },
               password:{
                           find:function(inputs){
                                          return findElementByNameAndType(inputs,"password", "password");
                           },
                           label:"Password"
               },
               submit:{
                           find:function(inputs){
                                          return findButtonByTypeNameAndValue("submit","login","Log Me In");
                           },
                           label:"Log in"
               }
        }
    }

}];


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

   function findFormData(){

       var inputs=findAllInputElements();
       var selectedFormBuilder=null;
       for(var i=0;i<formDataBuilders.length;i++){
         var formData=formDataBuilders[i].build();
         if(!formData.username.find(inputs)){
           console.log("no "+formData.id+":username");
           continue;
         }
         if(!formData.password.find(inputs)){
           console.log("no "+formData.id+":password");
           continue;
         }
         if(!formData.submit.find(inputs)){
           console.log("no "+formData.id+":submit");
           continue;
         }
         return formData;
       }
       return null;
    }

   function createGlobalInput(formData){
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
                                 id:    "###username###"+"@"+window.location.host+"_"+formData.id,
                                 title: "Sign In",
                                 fields:[{
                                           label:formData.username.label,
                                           id:"username",
                                           operations:{
                                               onInput:function(username){
                                                    var inputs=findAllInputElements();
                                                    formData.username.find(inputs).value=username;
                                               }
                                           }
                                         },{
                                            label:formData.password.label,
                                            id:"password",
                                            type:"secret",
                                            operations:{
                                              onInput:function(password){
                                                var inputs=findAllInputElements();
                                                formData.password.find(inputs).value=password;
                                              }
                                            }

                                         },{
                                            label:formData.submit.label,
                                            type:"button",
                                            operations:{
                                               onInput:function(){
                                                 var inputs=findAllInputElements();
                                                   formData.submit.find(inputs).click();
                                               }
                                            }

                                         }]
                                     }
                               }

                       };
            console.log(""+globalinput.config.initData.form.id);
           return globalinput;
   }

  function enableGlobalInput(){
      if(isAlreadyGlobalInputEnable()){
        console.log("Global input seems enabled already!");
        return;
      }
      var formData=findFormData();
      if(!formData){
        console.log("Global Input is disabled for this page");
        return;
      }
      var inputs=findAllInputElements();
      if(!inputs ||inputs.length==0){
        console.log("Globa Input disabled for this page: no input");
        return;
      }
     createQRCodePlaceHolder(formData.username.container(inputs));
     var globalinput=createGlobalInput(formData);
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
