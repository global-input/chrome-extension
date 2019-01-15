(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"www.papajohns.co.uk"
          },
          forms:[{
              title:"Sign In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="ctl00__objHeader_txtEmail1"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="ctl00__objHeader_txtPassword"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'a[id="ctl00__objHeader_lbSignIn"]',
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
