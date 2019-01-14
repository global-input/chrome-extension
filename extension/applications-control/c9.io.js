(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"c9.io"
          },
          forms:[{
              title:"Cloud9",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="id-username"]',
                data:{label:"Username or email"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="id-password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'button[label="Sign in"][type="submit"]',
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
