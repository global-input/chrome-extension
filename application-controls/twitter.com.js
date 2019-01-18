(function(){

  applicationControlConfig={

          hostnames:{
                type:"array",
                value:["twitter.com"]
          },
          forms:[{
              title:"Twitter",
              fields:[{
                id:"username",
                type:"text",
                selector:'div[id="page-container"] input[name="session[username_or_email]"]',
                data:{label:"Email address"},
              },{
                id:"password",
                type:"secret",
                selector:'div[id="page-container"]  input[name="session[password]"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:{
                    element:'div[id="page-container"] button[type="submit"]',
                    textContent:"Log In"
                },
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
