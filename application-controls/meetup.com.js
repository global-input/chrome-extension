(function(){

  applicationControlConfig={

          hostnames:{
                type:"single",
                value:"secure.meetup.com"
          },
          forms:[{
              title:"Meetup",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="email"]',
                data:{label:"Username"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:'form input[type="submit"][value="Log in"]',
                data:{label:"Log In"},
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
