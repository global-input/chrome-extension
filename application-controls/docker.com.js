(function(){

  applicationControlConfig={
            hostnames:{
                  type:"single",
                  value:"id.docker.com"
            },
            forms:[{
                    title:"Welcome to Docker",
                    fields:[{
                          id:"username",
                          type:"text",
                          selector:'input[id="nw_username"]',
                          data:{label:"Docker ID"},
                    },{
                        id:"password",
                        type:"secret",
                        selector:'input[id="nw_password"][type="password"]',
                        data:{label:"Password"},
                    },{
                        id:"submit",
                        type:"button",
                        selector:'button[id="nw_submit"][type="submit"]',
                        data:{label:"Login"},
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
