(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"login.live.com"
          },
          forms:[{
              title:"Microsoft Sign In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[name="loginfmt"]',
                data:{label:"Email, phone or Skype"},
              },{
                id:"password",
                type:"secret",
                selector:'input[name="passwd"][type="password"]',
                data:{label:"Password"},
              },{
                id:"next",
                type:"button",
                selector:'input[id="idSIButton9"]',
                data:{label:"Next"},
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
