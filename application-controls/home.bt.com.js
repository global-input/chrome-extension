(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"home.bt.com"
          },
          forms:[{
              title:"BT Sign In",
              fields:[{
                id:"username",
                type:"text",
                selector:'form input[name="USER"]',
                data:{label:"BT ID"},
              },{
                id:"password",
                type:"secret",
                selector:'form input[name="PASSWORD"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'form input[type="submit"][value="Log in to My BT"]',
                data:{label:"Log in to My BT"},
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
