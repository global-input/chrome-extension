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

export const getApplicationControlSettings=(domain)=>{
        let applicationConfigs=null;
        let type=null;    
        let customApplicationConfigs=getCustomApplicationControlConfig();
        if(customApplicationConfigs){
                const selectedApplicationControlConfig=selectApplicationControlConfig(domain,customApplicationConfigs);
                if(selectedApplicationControlConfig){                        
                        type="custom";                    
                        applicationConfigs=selectedApplicationControlConfig;
                }
        }        
        if(!applicationConfigs){
            const selectedApplicationControlConfig=selectApplicationControlConfig(domain,applicationControlConfigs);
            if(selectedApplicationControlConfig){
                    type="embedded";
                    applicationConfigs=selectedApplicationControlConfig;
            }
        }
        if(!applicationConfigs){                
                const hostnames={
                    type:"single",
                    value:domain
                };
                applicationConfigs={...defaultApplicationConfig, hostnames};
                type='new';
        }    
        return {
            type,
            applicationConfigs
        };
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



