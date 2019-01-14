(function(){

  applicationControlConfig={

          hostnames:{
                type:"array",
                value:["evernote.com","www.evernote.com"]
          },
        forms:[{
                  title:"Sign In",
                  fields:[{
                    id:"username",
                    type:"text",
                    selector:'input[id="username"]',
                    data:{label:"Email or username"},
                  },{

                    id:"password",
                    type:"secret",
                    selector:'input[id="password"][type="password"]',
                    data:{label:"Password"},
                  },{
                    id:"next",
                    type:"button",
                    selector:'input[id="loginButton"]',
                    data:{label:"Continue"},
                    nextUI:{
                             type:"refresh"
                    }

                  }]
        }]

      };
      if(!window.globalInputApp_applicationControlConfigs){
              window.globalInputApp_applicationControlConfigs=[];
      }
      window.globalInputApp_applicationControlConfigs.push(applicationControlConfig);
})();
