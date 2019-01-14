(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"gitlab.com"
          },
          forms:[{
              title:"Sign In to GitLab",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="user_login"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="user_password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'input[type="submit"][name="commit"][value="Sign in"]',
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
