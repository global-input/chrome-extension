(function(){

  applicationControlConfig={

          hostnames:{
                type:"array",
                value:["www.digitalocean.com","cloud.digitalocean.com"]
          },
          forms:[{
              title:"Digital Ocean",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="user_email"]',
                data:{label:"Email Address"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="user_password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'input[value="Log In"][type="submit"]',
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
