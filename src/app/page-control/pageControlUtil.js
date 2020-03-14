import applicationControlConfigs from './page-configs/configs.json';


export const getEmbeddedApplicationControlConfig = domain => {
    for(let appConfig of applicationControlConfigs){
        if(appConfig.hostnames && appConfig.hostnames.value){
            if(Array.isArray(appConfig.hostnames.value)){
                for(let hostname of appConfig.hostnames.value){
                    if(hostname===domain){
                        return appConfig;
                    }
                }
            }
            else if(typeof appConfig.hostnames.value==='string'){                
                    if(appConfig.hostnames.value===domain){
                        return appConfig;
                    }                
            }
        }
    }
    return null;
};

const getVariableName=domain=>{
    return 'extension.control.'+domain;
}
export const getUserApplicationControlConfig = domain => {
    var applicationConfigString=localStorage.getItem(getVariableName(domain));
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


export const saveUserApplicationControlConfig =(userApplicationControlConfig,domain) => {
    localStorage.setItem(getVariableName(domain), JSON.stringify(userApplicationControlConfig));   
};

export const removeUserApplicationControlConfig = (domain) => {
    localStorage.removeItem(getVariableName(domain));   
};






