
var globalInput={
        onDocumentLoaded:function(){
              this.contentContainer=document.getElementById('content');
              var operateOnThisPageButton = document.getElementById('operateOnThisPage');
              globalInputButton.addEventListener("click", this.onEnableButtonClicked.bind(this));
        },
        onEnableButtonClicked:function(){
            chrome.tabs.query({active: true, currentWindow: true}, this.enableGlobalInputOnTab.bind(this));
        },
        enableGlobalInputOnTab:function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "enable"}, this.processEnableGlobalInputOnTabResponse.bind(this));
        },
        processEnableGlobalInputOnTabResponse:function(response){
              if(!response){
                      this.onTabConnectionFailed();
              }
              else if(response.success){
                      this.hostname=response.hostname;
                      this.onTabGlobalInputEnabled();
              }
              else{
                      this.hostname=response.hostname;
                      this.onTabGlobalInputFailed(response);
              }
        },
        onTabConnectionFailed:function(){
            this.contentContainer.innerHTML="Unable to communicate with the page content, please reload/refresh the page and try again.";
        },
        onTabGlobalInputEnabled:function(response){
            var messageContainer=document.getElementById('message');
            messageContainer.innerHTML="Global Input is now enabled! The page should be displaying a QR Code. Now you can scan it with the Global Input App on your mobile to connect to the page";
        },
        onTabGlobalInputFailed:function(response){
             console.log(response.error);
             this.contentContainer.innerHTML="";
             var messageElement=this.createMessageElement("No form is identified in this page. For the time being, you can scan the following QR code with the Global Input app on your mobile to transfer the content to this popup window first and then copy and paste the content into the form in the page. If you would like to interact with the page directly with your mobile, the footprint of this page needs to be added to the script. This can be done easily with a little bit of Javascript knowledge. If you need help on this, please send a message to dilshat@iterativesolution.co.uk.");
             this.contentContainer.appendChild(messageElement);

             this.globalInputConnector=this.createGlobalInputConnector();
             var codeData=this.globalInputConnector.buildInputCodeData();//Get the QR Code value generated that includes the end-to-end encryption key and the other information necessary for the app to establish the communication
             console.log("code data:[["+codeData+"]]");
             var qrCodeContainerElement=this.createQRCode(codeData);
             this.contentContainer.appendChild(qrCodeContainerElement);
             document.body.style.height="500px";

        },


        createMessageElement:function(message){
              var messageContainer = document.createElement('div');
              messageContainer.id="message";
              messageContainer.innerHTML=message;
              return messageContainer;
        },

        createQRCode:function(qrCodedata){

            var qrCodeContainer = document.createElement('div');
            qrCodeContainer.id="qrcode"; //this is where the QR code will be generated
            qrCodeContainer.style.display='flex';
            qrCodeContainer.style['display-direction']='row';
            qrCodeContainer.style['justify-content']='center';
            qrCodeContainer.style['z-index']=1000;
            qrCodeContainer.textContent = '';
            var qrcode = new QRCode(qrCodeContainer, {
                          text: qrCodedata,
                          width:300,
                          height: 300,
                          colorDark : "#000000",
                          colorLight : "#ffffff",
                          correctLevel : QRCode.CorrectLevel.H
                       });

            return qrCodeContainer;
        },
        createGlobalInputConnector:function(){
                  var globalInputConfig=this.buildGlobalInputConfig();

                  var globalInputApi=require("global-input-message"); //get the Global Input Api
                  var globalInputConnector=globalInputApi.createMessageConnector(); //Create the connector
                  globalInputConnector.connect(globalInputConfig);  //connect to the proxy.
                  return globalInputConnector;
        },
        buildGlobalInputConfig:function(){
              var globalinputConfig={
                                onSenderConnected:this.onSenderConnected.bind(this),
                                onSenderDisconnected:this.onSenderDisconnected.bind(this),
                                initData:{
                                      form:{
                                              id:    "###username###"+"@"+this.hostname, // unique id for saving the form content on mobile automating the form-filling process.
                                              title: "Sign In on "+this.hostname,  //Title of the form displayed on the mobile
                                              fields:[{
                                                  label:"Username",
                                                  id:"username",
                                                  operations:{
                                                        onInput:this.onInputUsername.bind(this)
                                                   }
                                              },{
                                                  label:"Password",
                                                  id:"password",
                                                  operations:{
                                                        onInput:this.onInputPassword.bind(this)
                                                  }
                                              }]
                                          }
                                    }
               };
               return globalinputConfig;
        },

        onSenderConnected:function(){
              this.createInputForm();
        },
        createInputForm:function(){
              var formContainer = document.createElement('div');
              formContainer.id="form";
                  var messageElement = document.createElement('div');
                  messageElement.id="message";
                  messageElement.innerHTML="";
              formContainer.appendChild(messageElement);

                  var inputContainer=document.createElement('div');
                  inputContainer.className = "field";
                      var labelElement = document.createElement('label');
                      labelElement.innerHTML="<b>Username</b>";
                  inputContainer.appendChild(labelElement);
                      this.usernameElement = document.createElement('input');
                      this.usernameElement.id="username";
                      this.usernameElement.type="text";
                      this.usernameElement.value = '';
                      this.usernameElement.placeholder = 'Enter Username';
                   inputContainer.appendChild(this.usernameElement);


                       var copyButtonElement = document.createElement('button');


                       copyButtonElement.id="copyusername";


                       copyButtonElement.innerHTML="Copy to Clipboard";

                       var that=this;
                       copyButtonElement.onclick=function(){
                              that.usernameElement.select();
                              document.execCommand("Copy");
                              messageElement.innerHTML="The username is copied into the clipboard";
                       };
                    inputContainer.appendChild(copyButtonElement);

             formContainer.appendChild(inputContainer);

                   var inputContainer=document.createElement('div');
                   inputContainer.className = "field";
                       var labelElement = document.createElement('label');
                       labelElement.innerHTML="<b>Password</b>";
                   inputContainer.appendChild(labelElement);
                       this.passwordElement = document.createElement('input');
                       this.passwordElement.id="password";
                       this.passwordElement.type="password";
                       this.passwordElement.value = '';
                       this.passwordElement.placeholder = 'Enter Password';
                    inputContainer.appendChild(this.passwordElement);


                    var copyButtonElement = document.createElement('button');


                    copyButtonElement.id="copypassword";


                    copyButtonElement.innerHTML="Copy to Clipboard";

                    var that=this;
                    copyButtonElement.onclick=function(){
                           that.passwordElement.select();
                           document.execCommand("Copy");
                           messageElement.innerHTML="The password is copied into the clipboard";
                    };
                 inputContainer.appendChild(copyButtonElement);
                 inputContainer.appendChild(messageElement);

              formContainer.appendChild(inputContainer);
              return formContainer;
        },

        onSenderConnected:function(){
            this.contentContainer.innerHTML="";
            var inputForm=this.createInputForm();
            this.contentContainer.appendChild(inputForm);
            document.body.style.height="100px";
        },
        onSenderDisconnected:function(){

        },
        onInputUsername:function(username){
          if(this.usernameElement){
              this.usernameElement.value=username;
          }

        },
        onInputPassword:function(password){
          if(this.passwordElement){
              this.passwordElement.value=password;
          }
        }

};
document.addEventListener('DOMContentLoaded',  globalInput.onDocumentLoaded.bind(globalInput));
