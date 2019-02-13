(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"anypoint.mulesoft.com"
          },
          forms:[{
              title:"Anypoint",
              fields:[{
                id:"username",
                type:"text",
                selector:'form input[data-test-id="SignIn-Username"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'form input[data-test-id="SignIn-Password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'form button[data-test-id="SignIn-Submit"]',
                data:{label:"Sign in"},
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
