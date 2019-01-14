(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"www.wisepay.co.uk"
          },
          forms:[{
              title:"Sign In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="inputEmail3"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="inputPassword3"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:{
                  element:'button[type="submit"]',
                  textContent:"Sign in"
                },
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
