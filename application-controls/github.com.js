(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"github.com"
          },
          forms:[{
              title:"Sign In to GitHub",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="login_field"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'input[type="submit"][name="commit"][value="Sign in"]',
                data:{label:"Sign In"},
                nextUI:{
                         type:"refresh"
                }
              }]
          },{
              title:"Two-factor authentication",
              fields:[{
                id:"twofactorcode",
                type:"secret",
                selector:'input[id="otp"]',
                data:{label:"Authentication code"},
              },{
                id:"verifyButton",
                type:"button",
                selector:'button[type="submit"]',
                data:{label:"Verify"},
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
