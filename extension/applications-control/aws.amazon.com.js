(function(){

  applicationControlConfig={

            hostnames:{
                  type:"array",
                  value:["signin.aws.amazon.com","www.amazon.com","www.amazon.co.uk"]
            },
            forms:[{
                      title:"Sign In",
                      fields:[{
                        id:"username",
                        type:"text",
                        selector:'input[id="resolving_input"]',
                        data:{label:"Email"},
                      },{
                        id:"next",
                        type:"button",
                        selector:'button[id="next_button"]',
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
                },{
                           title:"Amazon Sign In",
                            fields:[{
                                 id:"username",
                                 type:"text",
                                 selector:'input[id="ap_email"]',
                                 data:{
                                    label:"Username"
                                 }
                             },{
                                    id:"password",
                                    type:"secret",
                                    selector:'input[id="ap_password"]',
                                    data:{label:"Password"},
                                },{
                                     id:"submit",
                                     type:"button",
                                     selector:'input[id="signInSubmit"]',
                                     data:{label:"Sign in"},
                                     nextUI:{
                                              type:"refresh"
                                     }
                                }]
                    },{

                          title:"Verifying that it's you",
                          fields:[{
                                id:"code",
                                type:"text",
                                selector:'input[name="code"]',
                                data:{
                                   label:"Enter code"
                                }
                          },{
                               id:"continue",
                               type:"button",
                               selector:'input[type="submit"][class="a-button-input"]',
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
