import * as chromeExtensionUtil from './chromeExtensionUtil';
import applicationControlConfigs from './application-control/configs.json';
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

const buildContentGlobalInputForm = message => {
    var form={
         id:message.content.form.id,
         title:message.content.form.title,
         fields:[]
    };    
    for(var i=0;i<message.content.form.fields.length;i++){
            var field=message.content.form.fields[i];
            var fieldProperty={
                  id:field.id,
                  label:field.label,
                  type:field.type,
                  items:field.items,
                  selectType:field.selectType,
                  operations:{                    
                    onInput: newValue => {                       
                        chromeExtensionUtil.sendFormField(field.id,newValue);
                        if(field.matchingRule.nextUI){
                            //displayNextUIOnMobile(field.matchingRule.nextUI)
                        }                        
                    }
                  }
            };
            if(field.type==='button'||field.type==='list'||field.type==='info' || field.type==='picker' || field.type==='select'){
                fieldProperty.id=null;
            }
            if(field.type==='info' || field.type==='picker' || field.type==='select'){
              fieldProperty.value=field.value;
                  if(field.type==='picker'){
                      if(typeof field.value ==='undefined'){
                          fieldProperty.value=fieldProperty.items[0].value;
                      }
                  }

            }

            form.fields.push(fieldProperty);
         }
    return form;
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


export const startPageControl=async ({domain, globalInputApp,fieldGoBack})=>{
    const initData={
         action: "input",
         dataType: "form",
         form: {    
              title:"Page Control",
              fields:[fieldGoBack]
         }   
    };  
    try{
        const form= await getPageControlConfig(domain);   
        if(form){
            initData.form=form;                
        }
        console.log("********::::form:"+JSON.stringify(form));
        globalInputApp.setInitData(initData)
    }
    catch(error){
        console.error(error+":::"+error.stack);
    }  
    return initData;

}
