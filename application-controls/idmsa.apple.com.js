(function(){

  applicationControlConfig={

            hostnames:{
                  type:"single",
                  value:"idmsa.apple.com"
            },
            forms:[{
                      title:"Apple Sign in",
                      type:"iframe",
                      fields:[{
                        id:"username",
                        type:"text",
                        selector:'input[id="account_name_text_field"]',
                        data:{label:"Apple ID"},
                      },{
                             id:"password",
                             type:"secret",
                             selector:'input[id="password_text_field"]',
                             data:{label:"Password"},
                      },{
                        id:"next",
                        type:"button",
                        selector:'button[id="sign-in"]',
                        data:{label:"Next"},
                        nextUI:{
                                 type:"refresh"
                        }

                      }]
            },{
                       title:"Password for Amazon",
                       formid:{
                          selector:'input[id="ap_email"]',
                          data:{
                                 value:{
                                       type:"value"
                                 }
                          }
                        },
                        fields:[{
                             id:"username",
                             type:"info",
                             selector:'input[id="ap_email"]',
                             data:{
                                label:"Username",
                                value:{
                                  type:"value"
                                }
                             }
                         },{
                                id:"password",
                                type:"secret",
                                selector:'input[id="ap_password"]',
                                data:{label:"Password"},
                            },{
                                 id:"submit",
                                 type:"button",
                                 selector:'input[id="signInSubmit-input"]',
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
