(function(){

  applicationControlConfig={

                hostnames:{
                      type:"array",
                      value:["www.lucidchart.com","store.logmein.com"]
                },
                forms:[{
                          title:"Account Update",
                          formid:{
                                  selector:'input[id="user-username"]',
                                  data:{
                                        value:{
                                                    type:"textContent"
                                        }
                                  }
                          },
                          fields:[{
                                     id:"username",
                                     type:"info",
                                     selector:'input[id="user-username"]',
                                     data:{
                                        label:"Username",
                                        value:{
                                               type:"attribute",
                                               attributeName:"value"
                                        }
                                     }

                                },{

                              id:"password",
                              type:"secret",
                              selector:'input[id="user-password-new"]',
                              data:{label:"New Password"},
                              confirm:{
                                  selector:'input[id="user-password-repeat"]'
                              }
                     },{
                            id:"oldPassword",
                            type:"secret",
                            selector:'input[id="password-settings-password"]',
                            data:{label:"Current Password"}
                     },{
                            id:"submit",
                            type:"button",
                            selector:'input[type="submit"][value="Save changes"]',
                            data:{label:"Save Changes"}
                     }]

                },{
                            title:"Sign Up",
                            fields:[{
                                      id:"name",
                                      type:"text",
                                      selector:'input[id="name"]',
                                      data:{label:"Your name"}
                                    },{
                                      id:"username",
                                      type:"text",
                                      selector:'input[id="email"]',
                                      data:{label:"Work Email"},
                                    },{
                                       id:"password",
                                       type:"secret",
                                       selector:'input[id="password"]',
                                       data:{label:"Password"},
                                     },{
                                       id:"register",
                                       type:"button",
                                       selector:'input[id="register_submit"]',
                                       data:{label:"Register"},
                                       nextUI:{
                                                type:"refresh"
                                       }
                                     }]

                 },{
                      title:"Log in",
                      fields:[{
                                id:"username",
                                type:"text",
                                selector:'input[id="username"]',
                                data:{label:"Username"},
                              },{
                                 id:"password",
                                 type:"secret",
                                 selector:'input[id="password"]',
                                 data:{label:"Password"},
                               },{
                                 id:"signin",
                                 type:"button",
                                 selector:'input[id="signin"][type="submit"]',
                                 data:{label:"Login"},
                                 nextUI:{
                                          type:"refresh"
                                 }
                               }]

                 },{
                              title:"Choose Actions",
                              fields:[{
                                   id:"login",
                                   type:"button",
                                   data:{label:"Log in"},
                                   selector:'a[id="nav-login-button"]',
                                   nextUI:{
                                            type:"refresh"
                                   }
                              },{
                                   id:"signup",
                                   type:"button",
                                   selector:'a[id="nav-signup-button"]',
                                   data:{label:"Sign Up"},
                                   nextUI:{
                                            type:"refresh"
                                   }
                              }]
                 },{
                              title:"Start Free Account",
                              fields:[{
                                  id:"signup",
                                  type:"button",
                                  selector:'a[id="free"]',
                                  data:{label:"Start Free Account"},
                                  nextUI:{
                                           type:"refresh"
                                  }
                              }]
                 },{
                             title:"Billing Information",
                             fields:[{
                                 id:"first_name",
                                 type:"text",
                                 selector:'input[id="FirstName"]',
                                 data:{label:"First Name"}
                              },{
                                 id:"last_name",
                                 type:"text",
                                 selector:'input[id="LastName"]',
                                 data:{label:"Last Name"}
                              },{
                                  id:"company_name",
                                  type:"text",
                                  selector:'input[id="CompanyName"]',
                                  data:{label:"Company Name"},

                              },{
                                 id:"email",
                                 type:"text",
                                 selector:'input[id="Email"]',
                                 data:{label:"Email"},
                               },{
                                 id:"address1",
                                 type:"text",
                                 selector:'input[id="Address1"]',
                                 data:{label:"Address1"},
                               },{
                                 id:"address2",
                                 type:"text",
                                 selector:'input[id="Address2"]',
                                 data:{label:"Address2"},
                               },{
                                 id:"city",
                                 type:"text",
                                 selector:'input[id="City"]',
                                 data:{label:"City"},
                               },{
                                 id:"postal_code",
                                 type:"text",
                                 selector:'input[id="PostalCode"]',
                                 data:{label:"Postal Code"},
                               },{
                                 id:"phone",
                                 type:"text",
                                 selector:'input[id="Phone"]',
                                 data:{label:"Phone"},
                               },{
                                  id:"pay",
                                  type:"button",
                                  selector:'input[id="btn-continue"]',
                                  data:{label:"Continue To Payment"},
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
