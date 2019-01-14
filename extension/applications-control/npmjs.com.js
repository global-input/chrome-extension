(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"www.npmjs.com"
          },
          forms:[{
              title:"Log In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="login_username"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="login_password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:{element:'form button[type="submit"]', textContent:"Login"},
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
