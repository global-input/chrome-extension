(function(){

  applicationControlConfig={
                    hostnames:{
                          type:"single",
                          value:"accounts.google.com"
                    },
                    forms:[{
                              title:"Choose an Account",
                              fields:[{
                                        id:"account",
                                        type:"list",
                                        selectType:"single",
                                        selector:{
                                            element:'form ul',
                                            content:{
                                                element:'li div[role="button"] div p[data-email]'
                                            }
                                        },
                                        data:{
                                            label:"Choose an account"
                                        },
                                        items:[{
                                              selector:'li div[role="button"]',
                                              data:{
                                                    selector:'div p[data-email]',
                                                    label:{
                                                          type:"attribute",
                                                          attributeName:"data-email"
                                                    },
                                                    value:{
                                                          type:"attribute",
                                                          attributeName:"data-email"
                                                    }
                                              }
                                        },{
                                              selector:{
                                                  element:'li div[role="button"] p',
                                                  textContent:"Use another account"
                                              },
                                              data:{
                                                  label:"Use another account",
                                                  value:"Use another account"
                                              }
                                        }],
                                        nextUI:{
                                            type:"refresh"
                                         }

                                      }],

                          },{
                                    title:"Choose an Account",
                                    fields:[{
                                              id:"account",
                                              type:"list",
                                              selectType:"single",
                                              selector:{
                                                  element:'form ul',
                                                  content:{
                                                      element:'li div[role="link"][data-identifier]'
                                                  }
                                              },
                                              data:{
                                                  label:"Choose an account"
                                              },
                                              items:[{
                                                    selector:'li div[role="link"][data-identifier]',
                                                    data:{
                                                          label:{
                                                                type:"attribute",
                                                                attributeName:"data-identifier"
                                                          },
                                                          value:{
                                                                type:"attribute",
                                                                attributeName:"data-identifier"
                                                          }
                                                    }
                                              },{
                                                    selector:{
                                                        element:'li div[role="link"] div',
                                                        textContent:"Use another account"
                                                    },
                                                    data:{
                                                        label:"Use another account",
                                                        value:"Use another account"
                                                    }
                                              }],
                                              nextUI:{
                                                  type:"refresh"
                                               }

                                            }],

                                },{
                                    title:"Enter Password",
                                                            formid:{
                                                               selector:'div[id="profileIdentifier"]',
                                                               data:{
                                                                      value:{
                                                                            type:"textContent"
                                                                      }
                                                               }
                                                             },
                                                               fields:[{
                                                                     id:"username",
                                                                     type:"info",
                                                                     selector:'div[id="profileIdentifier"]',
                                                                     data:{
                                                                         label:"Username",
                                                                         value:{
                                                                             type:"textContent"
                                                                         }
                                                                     },
                                                                 },{
                                                                        id:"password",
                                                                        type:"secret",
                                                                        selector:'input[type="password"][name="password"]',
                                                                        data:{
                                                                            label:"Password",
                                                                        }

                                                                 },{
                                                                         id:"next",
                                                                         type:"button",
                                                                         selector:'div[id="passwordNext"]',
                                                                         data:{
                                                                           label:"Next",
                                                                         },
                                                                         nextUI:{
                                                                                  type:"refresh"
                                                                         }

                                                                  }]

                             },{
                                title:"Enter Email",
                                fields:[{
                                            id:"username",
                                            type:"text",
                                            selector:'input[id="identifierId"]',
                                            data:{
                                                  label:"Email or phone"
                                            },
                                        },{
                                              id:"next",
                                              type:"button",
                                              data:{
                                                  label:"Next",
                                              },
                                              selector:'div[id="identifierNext"]',
                                              nextUI:{
                                                       type:"refresh"
                                              }
                                        },{
                                              id:"createAccount",
                                              type:"button",
                                              data:{
                                                  label:"Create account",
                                              },
                                              selector:{
                                                        element:'div[role="button"]',
                                                        content:{
                                                            element:"span",
                                                            textContent:"Create account"
                                                        }
                                              },
                                              nextUI:{
                                                       type:"refresh"
                                              }
                                        }]



                             },{
                                    title:"2-step Verification",
                                    fields:[{
                                            id:"username",
                                            type:"info",
                                            selector:'div[id="profileIdentifier"]',
                                            data:{
                                                label:"Username",
                                                value:{
                                                    type:"textContent"
                                                }
                                            },
                                    },{
                                            id:"twofactorcode",
                                            selector:'input[id="totpPin"]',
                                            type:"text",
                                            data:{
                                                label:"Enter Code",
                                            }
                                    },{
                                            id:"next",
                                            type:"button",
                                            selector:'div[role="button"][id="totpNext"]',
                                            data:{
                                              label:"Next",
                                            },
                                            nextUI:{
                                                type:"refresh"
                                            }
                                }]


                             },{
                                    title:"2-step Verification",
                                    fields:[{
                                        id:"twofactorcode",
                                        type:"text",
                                        selector:'input[id="idvPin"]',
                                        data:{label:"Enter Code"}
                                    },{
                                        id:"next",
                                        type:"button",
                                        selector:'div[id="idvPreregisteredPhoneNext"]',
                                        data:{label:"Next"},
                                        nextUI:{
                                                 type:"refresh"
                                        }
                                    }]
                             },{
                                title:"Create your Google Account",
                                fields:[{
                                  id:"first_name",
                                  type:"text",
                                  selector:'input[id="firstName"]',
                                  data:{label:"First name"}
                                },{
                                  id:"last_name",
                                  type:"text",
                                  selector:'input[id="lastName"]',
                                  data:{label:"Last name"}
                                },{
                                  id:"username",
                                  type:"text",
                                  selector:'input[id="username"]',
                                  data:{label:"username"}
                                },{

                                  id:"password",
                                  type:"secret",
                                  selector:'input[type="password"][name="Passwd"]',
                                  confirm:{
                                      selector:'input[type="password"][name="ConfirmPasswd"]'
                                  },
                                  data:{label:"Password"}
                                },{
                                        id:"next",
                                        type:"button",
                                        selector:'div[id="accountDetailsNext"]',
                                        data:{label:"Next"},
                                        nextUI:{
                                                 type:"refresh"
                                        }
                                }]
                             },{
                                title:"Welcome to Google",
                                fields:[{
                                  id:"phone_number",
                                  type:"text",
                                  selector:'input[id="phoneNumberId"]',
                                  data:{label:"Phone number"}
                                },{
                                  id:"recovery_email",
                                  type:"text",
                                  selector:'input[aria-label="Recovery email address (optional)"]',
                                  data:{label:"Recovery Email"}
                                },{
                                  id:"birthday_month",
                                  type:"picker",
                                  selector:'select[id="month"]',
                                  data:{label:"Birthday Month"},
                                  items:[{
                                      selector:'option',
                                      data:{
                                        label:{type:"textContent"},
                                        value:{type:"attribute",attributeName:"value"}
                                      }
                                  }]
                                },{
                                  id:"birthday_day",
                                  type:"text",
                                  data:{label:"Birthday Day"},
                                  selector:'input[id="day"]',
                                },{
                                  id:"birthday_year",
                                  type:"text",
                                  selector:'input[id="year"]',
                                  data:{label:"Birthday Year"},
                                },{
                                  id:"gender",
                                  type:"select",
                                  selectType:"single",
                                  selector:'select[id="gender"]',
                                  data:{label:"Gender"},
                                  items:[{
                                        selector:'option',
                                        data:{
                                            label:{type:"textContent"},
                                            value:{type:"attribute",  attributeName:"value"}
                                        }
                                  }]

                                },{
                                  id:"next",
                                  type:"button",
                                  selector:'div[id="personalDetailsNext"]',
                                  data:{label:"Next"},
                                  nextUI:{
                                           type:"refresh"
                                  }
                                }]


                             },{
                                    title:"Verification Mobile Number",
                                    fields:[{
                                            id:"phoneNumber",
                                            type:"text",
                                            selector:'input[id="phoneNumberId"]',
                                            data:{label:"Phone number"}
                                      },{
                                            id:"next",
                                            type:"button",
                                            selector:'div[id="gradsIdvPhoneNext"]',
                                            data:{label:"Next"},
                                            nextUI:{
                                                     type:"refresh"
                                            }
                                      }]

                             },{
                                      title:"Verifying Code",
                                      fields:[{
                                        id:"verification_code",
                                        type:"text",
                                        selector:'input[id="code"]',
                                        data:{label:"Verfication Code"}
                                      },{
                                        id:"next",
                                        type:"button",
                                        selector:'div[id="gradsIdvVerifyNext"]',
                                        data:{label:"Next"},
                                        nextUI:{
                                                 type:"refresh"
                                        }
                                      }]
                             },{
                                      title:"Verify your phone number",
                                      fields:[{
                                        id:"send",
                                        type:"button",
                                        selector:'div[id="idvConsentNext"]',
                                        data:{label:"Send"},
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
