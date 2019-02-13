(function(){

  applicationControlConfig={

    hostnames:{
          type:"array",
          value:["www.pexels.com"]
    },
          forms:[{
              title:"Sign Up on Pixels",
              fields:[{
                id:"first_name",
                type:"text",
                selector:'input[id="user_first_name"]',
                data:{label:"First name"},
              },{
                id:"last_name",
                type:"text",
                selector:'input[id="user_last_name"]',
                data:{label:"Last name"},
              },{
                id:"email",
                type:"text",
                selector:'input[id="user_email"]',
                data:{label:"Email"},
              },{
                id:"password",
                type:"secret",
                selector:'input[id="user_password"][type="password"]',
                data:{label:"Password"},
              },{
                id:"Sign Up",
                type:"button",
                selector:'button[data-callback="onSubmit"]',
                data:{label:"Sign Up"},
                nextUI:{
                         type:"refresh"
                }
              }]
          },{
                title:"Login to Pixels",
                fields:[{
                  id:"email",
                  type:"text",
                  selector:'input[id="user_email"]',
                  data:{label:"Email"},
                },{
                  id:"password",
                  type:"secret",
                  selector:'input[id="user_password"][type="password"]',
                  data:{label:"Password"},
                },{
                  id:"Sign Up",
                  type:"button",
                  selector:'input[type="submit"][name="commit"][value="Login"]',
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
