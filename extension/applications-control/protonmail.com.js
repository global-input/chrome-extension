(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"mail.protonmail.com"
          },
          forms:[{
              title:"Create ProtonMail Account",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="username"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="password"][type="password"]',
                data:{label:"Password"},
                confirm:{
                    selector:'input[type="password"][id="passwordc"]'
                }
              },{
                id:"recovery_email",
                type:"text",
                selector:'input[id="notificationEmail"]',
                data:{label:"Recovery Email"}
              },{
                id:"createAccount",
                type:"button",
                selector:{element:'button[type="submit"]',
                         textContent:"Create Account"},
                data:{label:"CREATE ACCOUNT"},
                nextUI:{
                         type:"refresh"
                }
              }]
          },{
            title:"ProtonMail",
            fields:[{
              id:"username",
              type:"text",
              selector:'input[id="username"]',
              data:{label:"Username"},
            },{
              id:"password",
              type:"secret",
              selector:'input[id="password"][type="password"]',
              data:{label:"Password"},
            },{
              id:"login",
              type:"button",
              selector:'button[id="login_btn"][type="submit"]',
              data:{label:"LOGIN"},
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
