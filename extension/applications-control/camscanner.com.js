(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"www.camscanner.com"
          },
          forms:[{
              title:"Sign In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="id_input_username"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="id_input_pwd"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'form a[id="id_btn_login"]',
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
