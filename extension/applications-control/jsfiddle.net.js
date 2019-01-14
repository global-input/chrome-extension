(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"jsfiddle.net"
          },
          forms:[{
              title:"JSFiddle Sign In",
              fields:[{
                id:"username",
                type:"text",
                selector:'form input[id="id_username"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'form input[id="id_password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'form input[type="submit"][value="Log in"]',
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
