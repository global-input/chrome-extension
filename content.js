(function(){

  var getConfluence=function(){
    var confluence={
       loginContainer:{
          element:document.getElementById("login-container")
       },
       username:{
                    element:document.getElementById("os_username"),
                    label:"Username"
           },
       password:{
            element:document.getElementById("os_password"),
            label:"Password"
       },
       loginButton:{
             element:document.getElementById("loginButton"),
             label:"Log In"
        },
       id:  "xxdi@confluence"+window.location.host,
       title: "Sign In on "+window.location.host,
       isValid:function(){
            return this.loginContainer.element && this.username.element && this.password.element;
       }
    };
    if(confluence.isValid()){
      console.log("is confluece");
      return confluence;
    }
    else{
      console.log("not confluece");
      return null;
    }
  };
  var getJira=function(){

    var loginform=document.getElementById("login-form");
    if(!loginform){
      loginform=document.getElementById("loginform");
    }
    if(!loginform){
      console.log("not jira");
      return null;
    }
    var loginContainer=loginform.parentElement.parentElement.parentElement;

    var jira={
       loginContainer:{element:loginContainer},
       username:{
                    element:document.getElementById("login-form-username"),
                    label:"Username"
           },
       password:{
            element:document.getElementById("login-form-password"),
            label:"Password"
       },
       loginButton:{
             element:document.getElementById("login-form-submit"),
             label:"Log In"
        },
       id:  "ydgs@jira"+window.location.host,
       title: "Sign In on "+window.location.host,
       isValid:function(){
            return this.loginContainer.element && this.username.element && this.password.element;
       }
    };
    if(!jira.loginButton.element){
      jira.loginButton.element=document.getElementById("login");
    }

    if(jira.isValid()){
      var h=jira.loginContainer.element.offsetHeight+500;
      jira.loginContainer.element.style.height=h+'px';
      console.log("is jira");
      return jira;
    }
    else{
      console.log("not jira");
      return null;
    }

  };


  var getGitlab=function(){

    var loginform=document.getElementById("login-pane");

    if(!loginform){
      console.log("not gitlab");
      return null;
    }


    var gitlab={
       loginContainer:{element:loginform},
       username:{
                    element:document.getElementById("user_login"),
                    label:"Username"
           },
       password:{
            element:document.getElementById("user_password"),
            label:"Password"
       },
       loginButton:{
             label:"Log In"
        },
       id:  "uid@gitlab"+window.location.host,
       title: "Sign In on "+window.location.host,
       isValid:function(){
            return this.loginContainer.element && this.username.element && this.password.element;
       }
    };
    var inputButtons=document.getElementsByTagName("input");
    var loginButton=null;
    for(var x=0;x<inputButtons.length;x++){
        if(inputButtons[x].value === 'Sign in'){
            loginButton=inputButtons[x];
        }
    }
    gitlab.loginButton.element=loginButton;

    if(gitlab.isValid()){
      console.log("is gitlab");
      return gitlab;
    }
    else{
      console.log("is gitlab jira");
      return null;
    }

  };





  var formSelector=function(){
      var formdata=getConfluence();
      if(formdata){
        return formdata;
      }
      formdata=getJira();
      if(formdata){
        return formdata;
      }
      formdata=getGitlab();
      if(formdata){
        return formdata;
      }
        return null;
  };

  var createQRCodePlaceHolder=function(logincontainer){
    var div = document.createElement('div');
    div.id="qrcode";
    div.style.display='flex';
    div.style['display-direction']='row';
    div.style['justify-content']='center';
    div.style['z-index']=1000;



    div.textContent = '';
    logincontainer.appendChild(div);

    div = document.createElement('div');
    div.id="globalInputMessage";
    div.textContent = '';
    logincontainer.appendChild(div);
  };
  var enableGlobalInput=function(){
      var formSelected=formSelector();
      if(!formSelected){
        console.log("Global Input is disabled for this page");
        return;
      }
     var existingqrcodeelement=document.getElementById("qrcode");
     if(existingqrcodeelement){
       console.log("qrcode element exists, Global Input is disabled");
       return;
     }
     createQRCodePlaceHolder(formSelected.loginContainer.element);
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

  };

  enableGlobalInput();



})();
