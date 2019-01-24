(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"www.sololearn.com"
          },
          forms:[{
            title:"SOLOLEARN",
            fields:[{
              id:"username",
              type:"text",
              selector:'form input[id="Email"]',
              data:{label:"Email"},
            },{
              id:"password",
              type:"secret",
              selector:'form input[id="Password"][type="password"]',
              data:{label:"Password"},
            },{
              id:"login",
              type:"button",
              selector:'form button[type="submit"]',
              data:{label:"SIGN IN"},
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
