(function(){

  applicationControlConfig={
            hostnames:{
                  type:"single",
                  value:"www.dropbox.com"
            },
            forms:[{
                    title:"Sign In",
                    fields:[{
                          id:"username",
                          type:"text",
                          selector:'input[name="login_email"]',
                          data:{label:"Email"},
                    },{
                        id:"password",
                        type:"secret",
                        selector:'input[name="login_password"][type="password"]',
                        data:{label:"Password"},
                    },{
                        id:"submit",
                        type:"button",
                        selector:'button[class="login-button signin-button button-primary"][type="submit"]',
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
