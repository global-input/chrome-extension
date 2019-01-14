(function(){

  applicationControlConfig={

          hostnames:{
                type:"array",
                value:["en-gb.facebook.com","www.facebook.com"]
          },
          forms:[{
              title:"Sign In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="email"]',
                data:{label:"Email or Phone"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="pass"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'input[value="Log In"][type="submit"]',                  
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
