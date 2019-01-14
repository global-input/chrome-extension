(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"id.heroku.com"
          },
          forms:[{
              title:"HEROKU",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="email"]',
                data:{label:"Email address"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'button[value="Log In"][type="submit"]',
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
