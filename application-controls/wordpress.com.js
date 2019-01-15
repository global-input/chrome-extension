(function(){

  applicationControlConfig={

            hostnames:{type:"single",value:"wordpress.com"},
            forms:[{
                      title:"Log in to your account",
                      fields:[{
                        id:"username",
                        type:"text",
                        selector:'input[id="usernameOrEmail"]',
                        data:{label:"Username"},
                      },{
                        id:"continue",
                        type:"button",
                        selector:{
                            element:'button[type="submit"]',
                            textContent:"Continue"
                          },
                        data:{label:"Continue"},
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
