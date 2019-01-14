(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"wable.com"
          },
          forms:[{
              title:"Wable Sign In",
              fields:[{
                id:"username",
                type:"text",
                selector:'form input[id="txtUsername"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'form input[id="txtPassword"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:{
                    element:'form button',
                    textContent:"Sign In"
                },
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
