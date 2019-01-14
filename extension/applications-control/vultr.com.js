(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"my.vultr.com"
          },
          forms:[{
              title:"Vultr",
              fields:[{
                id:"username",
                type:"text",
                selector:'form input[name="username"]',
                data:{label:"Email Address"},
              },{
                id:"password",
                type:"secret",
                selector:'form input[name="password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'form input[type="submit"][value="Login"]',
                data:{label:"Login"},
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
