(function(){

  applicationControlConfig={    
                 hostnames:{
                       type:"single",
                       value:"www.join.me"
                 },
                 forms:[{
                      title:"Log In (Join Me)",
                      fields:[{
                                    id:"username",
                                    type:"text",
                                    selector:'input[id="email"]',
                                    data:{label:"Email"},

                              },{
                                    id:"password",
                                    type:"secret",
                                    selector:'input[id="password"]',
                                    data:{label:"Password"},

                              },{
                                id:"submit",
                                type:"button",
                                selector:'button[id="btnSubmit"]',
                                data:{label:"Log in"},
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
