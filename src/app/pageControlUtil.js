import * as chromeExtensionUtil from './chromeExtensionUtil';
import applicationControlConfigs from './application-control/configs.json';
import defaultApplicationConfig from './application-control/default.json';
const getCustomApplicationControlConfig = () => {
    var applicationConfigString=localStorage.getItem("iterative.globaliputapp.controlConfigs");
    if(applicationConfigString){
        try{
            return JSON.parse(applicationConfigString);
        }
        catch(error){
              console.log("error in loading the applicationConfig:"+error);
        }
    }
    return null;
};



const applicationConfigMatchHostName = (applicationControlConfig, hostname) => {
    if(!applicationControlConfig){
          return false;
    }
    if(!applicationControlConfig.hostnames){
      return false;
    }
    if(applicationControlConfig.hostnames.type==='single'){
          if(applicationControlConfig.hostnames.value===hostname){
            return true;
          }
    }
    else if(applicationControlConfig.hostnames.type==='array'){
      for(var k=0;k<applicationControlConfig.hostnames.value.length;k++){
          if(applicationControlConfig.hostnames.value[k]===hostname){
              return true;
          }
      }
    }
    return false;
};

export const updateCustomApplicationControlConfig =(newContent,domain)=>{    
    var customApplicationControlConfig=getCustomApplicationControlConfig();
    var newCustomApplicationControlConfig=[];
    var notUpdated=true;
    if(customApplicationControlConfig){
        for(var i=0;i<customApplicationControlConfig.length;i++){
            if(notUpdated && applicationConfigMatchHostName(customApplicationControlConfig[i], domain)){
                   if(newContent){
                      newCustomApplicationControlConfig.push(newContent);
                   }
                   notUpdated=false;
            }
            else{
              newCustomApplicationControlConfig.push(customApplicationControlConfig[i]);
            }
        }
    }
    if(notUpdated && newContent){
        newCustomApplicationControlConfig.push(newContent);
    }
    if(newCustomApplicationControlConfig.length){
        var updateString=JSON.stringify(newCustomApplicationControlConfig);
        localStorage.setItem("iterative.globaliputapp.controlConfigs",updateString);
    }
    else{
        localStorage.removeItem("iterative.globaliputapp.controlConfigs");
    }
};



const selectApplicationControlConfig = (hostname, applicationControlConfigs) => {
    for(var i=0;i<applicationControlConfigs.length;i++){
          if(applicationConfigMatchHostName(applicationControlConfigs[i],hostname)){
              return applicationControlConfigs[i];
          }
    }
    return null;
};

const getApplicationControlSettings =(domain) => {                
        const customApplicationConfigString=getCustomApplicationControlConfig();
        if(customApplicationConfigString){
                const selectedApplicationControlConfig=selectApplicationControlConfig(domain,customApplicationConfigString);
                if(selectedApplicationControlConfig){
                            return {
                                            type:"custom",
                                            applicationConfigs:selectedApplicationControlConfig
                            };
                }
        }        
        if(applicationControlConfigs){
             const selectedApplicationControlConfig=selectApplicationControlConfig(domain,applicationControlConfigs);
            if(selectedApplicationControlConfig){
                    return {
                                          type:"default",
                                          applicationConfigs:selectedApplicationControlConfig
                    };
            }
        }
        return null;
};




const buildFormField=field=>{
    let id=field.id;

    if(field.type==='list'||field.type==='info' || field.type==='picker' || field.type==='select'){
        id=null;
    }
    let value=field.value;


    if(field.type==='info' || field.type==='picker' || field.type==='select'){
          value=field.value;
          if(field.type==='picker'){
              if(typeof field.value ==='undefined'){
                  value=field.items[0].value;
              }
          }

    };
    return {
        id,
        label:field.label,
        type:field.type,
        items:field.items,
        selectType:field.selectType,
        value,
        operations:{                    
          onInput: newValue => {                       
              chromeExtensionUtil.sendFormField(field.id,newValue);
              if(field.matchingRule.nextUI){
                  //displayNextUIOnMobile(field.matchingRule.nextUI)
              }                        
          }
        }
  };
}
const buildContentGlobalInputForm = message => {
    return {
         id:message.content.form.id,
         title:message.content.form.title,
         fields:message.content.form.fields.map(f=>{
             return buildFormField(f);
         })
    };     
};




const getPageControlConfig= async domain=>{
    
    var applicationSettings=getApplicationControlSettings(domain);
    if(!applicationSettings){
        return null;
    }
    if(!applicationSettings.applicationConfigs){
        return null;        
    }
    const applicationControlConfig=applicationSettings.applicationConfigs;
    console.log("----:applicationControlConfig====:"+JSON.stringify(applicationControlConfig));
    const message = await chromeExtensionUtil.getPageControlConfig(applicationControlConfig);
    if(message.status==="success"){
        return buildContentGlobalInputForm(message);        
    }
    else{
        return null;
    }    
};


export const startPageControl=async ({domain, globalInputApp,fieldGoBack,fieldEditApplicationControl})=>{    
    let initData={
        action: "input",
        dataType: "form",
        form: {    
             title:"Mobile Input/Control",
             fields:[fieldGoBack,fieldEditApplicationControl]
        }   
   };

    try{
        const form= await getPageControlConfig(domain);   
        if(form){
            form.fields.push(fieldGoBack);
            form.fields.push(fieldEditApplicationControl);
            initData.form=form;
        }          
    }
    catch(error){
        console.error(error+":::"+error.stack);
    }  
    globalInputApp.setInitData(initData);
};


export const getApplicationControlSettingsForEdit=(domain)=>{
    const hostnames={
        type:"single",
        value:domain
    };
    let applicationConfigs={...defaultApplicationConfig, hostnames};
    let type='new';
    
    let applicationSettings=getApplicationControlSettings(domain); 
    if(applicationSettings && applicationSettings.applicationConfigs){
        type=applicationSettings.type;
        applicationConfigs=applicationSettings.applicationConfigs;
    }            
    
    return {
        type,
        content:JSON.stringify(applicationConfigs,null,2)
    };




}
