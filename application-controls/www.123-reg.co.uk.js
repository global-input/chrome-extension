(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"www.123-reg.co.uk"
          },
          forms:[{
              title:"Log In to 123-reg",
              fields:[{
                id:"username",
                type:"text",
                selector:'form input[name="username"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'form input[name="password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'button[type="submit"][id="login"]',
                data:{label:"Log Me In"},
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
