(function(){

  applicationControlConfig={

          hostnames:{
                type:"array",
                value:["www.linkedin.com","uk.linkedin.com","fr.linkedin.com"]
          },
          forms:[{
              title:"Linked In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="login-email"]',
                data:{label:"Email"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="login-password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'input[id="login-submit"][type="submit"]',
                data:{label:"Sign In"},
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
