(function(){
  globalInputApp_applicationControlConfigs=[{
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
                                                            element:"content span",
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


          },{
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



          },{
                hostnames:{
                      type:"single",
                      value:"github.com"
                },
                forms:[{
                    title:"Sign In to GitHub",
                    fields:[{
                      id:"username",
                      type:"text",
                      selector:'input[id="login_field"]',
                      data:{label:"Username"},
                    },{
                      id:"password",
                      type:"secret",
                      selector:'input[id="password"]',
                      data:{label:"Password"},
                    },{
                      id:"login",
                      type:"button",
                      selector:'input[type="submit"][name="commit"][value="Sign in"]',
                      data:{label:"Sign In"},
                      nextUI:{
                               type:"refresh"
                      }
                    }]
                },{
                    title:"Two-factor authentication",
                    fields:[{
                      id:"twofactorcode",
                      type:"text",
                      selector:'input[id="otp"]',
                      data:{label:"Authentication code"},
                    },{
                      id:"verifyButton",
                      type:"button",
                      selector:'button[type="submit"]',
                      data:{label:"Verify"},
                      nextUI:{
                               type:"refresh"
                      }

                    }]
                }]

          },{
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
          },{
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

          },{
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

      }];
window.globalInputApp_applicationControlConfigs=globalInputApp_applicationControlConfigs;

})();
