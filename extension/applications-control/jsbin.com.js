(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"jsbin.com"
          },
          forms:[{
              title:"JS Bin Login",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="login-username"]',
                data:{label:"Email address or username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="login-key"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'input[value="Log in"][type="submit"]',
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
