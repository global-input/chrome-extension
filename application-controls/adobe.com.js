(function(){

  applicationControlConfig={

          hostnames:{
                type:"array",
                value:["adobeid-na1.services.adobe.com"]
          },
        forms:[{
                  title:"Adobe ID",
                  fields:[{
                    id:"username",
                    type:"text",
                    selector:'input[id="adobeid_username"]',
                    data:{label:"Email address"},
                  },{

                    id:"password",
                    type:"secret",
                    selector:'input[id="adobeid_password"][type="password"]',
                    data:{label:"Password"},
                  },{
                    id:"next",
                    type:"button",
                    selector:'button[id="sign_in"]',
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
