import pageControlConfigs from './page-configs/configs.json';

const getEmbeddedPageControlConfigItem = domain => {
    for(let [i,pageConfig] of pageControlConfigs.entries()){    
        if(pageConfig.hostnames && pageConfig.hostnames.value){
            if(Array.isArray(pageConfig.hostnames.value)){
                for(let hostname of pageConfig.hostnames.value){
                    if(hostname===domain){
                        return {pageConfig,index:i};
                    }
                }
            }
            else if(typeof pageConfig.hostnames.value==='string'){                
                    if(pageConfig.hostnames.value===domain){
                        return {pageConfig,index:1};
                    }                
            }
        }
    }
    return null;
};

const getVariableName=domain=>{
    return 'extension.control.'+domain;
}
const getUserPageControlConfig = domain => {
    var pageConfigString=localStorage.getItem(getVariableName(domain));
    if(pageConfigString){
        try{
            return JSON.parse(pageConfigString);
        }
        catch(error){
              console.log("error in loading the pageConfig:"+error);
        }
    }
    return null;
};


export const saveUserPageControlConfig =(userPageControlConfig,domain) => {
    localStorage.setItem(getVariableName(domain), JSON.stringify(userPageControlConfig));   
};

export const removeUserPageControlConfig = (domain) => {
    localStorage.removeItem(getVariableName(domain));   
};

const getDomainFromEmbeddedConfig=pageConfig=>{
    if(pageConfig.hostnames && pageConfig.hostnames.value){
        if(Array.isArray(pageConfig.hostnames.value)){
            return pageConfig.hostnames.value[0];                
        }
        else if(typeof pageConfig.hostnames.value==='string'){                
            return pageConfig.hostnames.value;                
        }        
    }
    return null;
}
const getExampleItems =()=>{
    const items=[]
    for(let [i,pageConfig] of pageControlConfigs.entries()){
        let domain=getDomainFromEmbeddedConfig(pageConfig);        
        items.push({
                index:i,
                domain
        });
    }
    return items;
};
const defaultExampleIndex=7;

const getDefaultExampleItem=()=>{
    const pageConfig=pageControlConfigs[defaultExampleIndex];
    const domain=getDomainFromEmbeddedConfig(pageConfig);
    return {
        index:defaultExampleIndex,
        domain,
        pageConfig
    };
}

const buildEditDataItem=(type,pageConfig,index,domain)=>{
    return {
        type,
        index,
        domain,
        content:JSON.stringify(pageConfig,null,2)
    };
};

export const getDataItemForEdit = domain=>{
    const userPageControlConfig = getUserPageControlConfig(domain);
    if(userPageControlConfig){
        return buildEditDataItem('user',userPageControlConfig,-1,domain);
    };
    const embeddedConfigItem=getEmbeddedPageControlConfigItem(domain);
    if(embeddedConfigItem){
        return buildEditDataItem('embedded',embeddedConfigItem.pageConfig,embeddedConfigItem.index,domain);        
    }
    
    const defaultExampleItem=getDefaultExampleItem();
    return buildEditDataItem('new',defaultExampleItem.pageConfig,defaultExampleItem.index,domain);            
};

export const getPageControlConfig = domain=>{
    const userPageControlConfig=getUserPageControlConfig(domain);    
    if(userPageControlConfig){
        return userPageControlConfig;        
    }        
    const embeddedConfigItem=getEmbeddedPageControlConfigItem(domain);
    if(embeddedConfigItem){
        return embeddedConfigItem.pageConfig
    }
    return null;
}





