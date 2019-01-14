(function(){

  applicationControlConfig={

          hostnames:{
                type:"array",
                value:["secure.tesco.com","www.tesco.com"]
          },
          forms:[{
              title:"Tesco In",
              fields:[{
                id:"username",
                type:"text",
                selector:'input[id="username"]',
                data:{label:"Email address"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"login",
                type:"button",
                selector:{
                    element:'button',
                    content:{
                        element:"span",
                        textContent:"Sign in"
                    }
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
