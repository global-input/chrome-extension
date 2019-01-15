(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"login.wordpress.org"
          },
          forms:[{
              title:"Log In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="user_login"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="user_pass"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'input[type="submit"][id="wp-submit"]',
                data:{label:"Log In"},
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
