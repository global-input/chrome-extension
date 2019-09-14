(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"auth.apply-for-innovation-funding.service.gov.uk"
          },
          forms:[{
              title:"GOV.UK",
              fields:[{
                id:"username",
                type:"text",
                selector:'form input[id="username"]',
                data:{label:"Email"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'button[type="submit"][id="sign-in-cta"]',
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
