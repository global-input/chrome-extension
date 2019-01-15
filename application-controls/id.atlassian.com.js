(function(){

  applicationControlConfig={

            hostnames:{type:"single",value:"id.atlassian.com"},
            forms:[{
                      title:"Username for Atlassian",
                      fields:[{
                        id:"username",
                        type:"text",
                        selector:'input[id="username"]',
                        data:{label:"Username"},
                      },{
                        id:"continue",
                        type:"button",
                        selector:'button[id="login-submit"]',
                        data:{label:"Continue"},
                        nextUI:{
                                 type:"refresh"
                        }

                      }]
            },{
                       title:"Enter Password",
                       formid:{
                          selector:'form[id="form-login"] div[tabindex="0"] span',
                          data:{
                                 value:{
                                       type:"textContent"
                                 }
                          }
                        },
                        fields:[{
                             id:"username",
                             type:"info",
                             selector:'form[id="form-login"] div[tabindex="0"] span',
                             data:{
                                label:"Username",
                                value:{
                                  type:"textContent"
                                }
                             }
                         },{
                                id:"password",
                                type:"secret",
                                selector:'input[id="password"]',
                                data:{label:"Password"},
                            },{
                                 id:"submit",

                                 type:"button",
                                 selector:'button[id="login-submit"]',
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
