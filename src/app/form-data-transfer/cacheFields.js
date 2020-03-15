import {generateRandomString, encrypt, decrypt} from 'global-input-react';

export const generateEncryptionKey=()=>{
    return generateRandomString(20);    
}

const getVariableNames=domain=>{        
    return {
        cacheFields:'extension.content.cacheFields.'+domain,
        cachedTime:'extension.content.cachedTime.'+domain
    }

};

export const clearFields= domain=>{
    try{
            if(domain){
                const variableNames=getVariableNames(domain);
                localStorage.removeItem(variableNames.cacheFields);
                localStorage.removeItem(variableNames.cachedTime);    
                return;
            }
            const prefix= getVariableNames('');             
            const keys=Object.keys(localStorage);
            for (let i=0; i<keys.length;i++){
                const key=keys[i];            
                if(key.startsWith(prefix.cacheFields) || key.startsWith(prefix.cachedTime)){
                        localStorage.removeItem(key);
                }
            }    
    }
    catch(error){
        console.error("failed to clear the cache:"+error);
        console.error(error.stack);
    }
}


const cacheTTL=60000;

export const cacheIfMultipleFields = (domain,formFields)=>{    
        if(!domain){
            return null;
        }
        const numberOfNotEmptyFields=formFields.reduce((count,f)=>f.value?count+1:count,0);
        if(numberOfNotEmptyFields<2){
                return null;
        }
        const key=generateEncryptionKey();        
        const contentBlob=JSON.stringify(formFields);
        const encryptedContent=encrypt(contentBlob,key+'Tjg0MfNGYr');
        const variableNames=getVariableNames(domain);
        localStorage.setItem(variableNames.cachedTime,(new Date()).getTime());
        localStorage.setItem(variableNames.cacheFields,encryptedContent);        
        return key;    

}
export const loadFormFields = (domain, key)=>{
    const variableNames=getVariableNames(domain);
    const cachedTime=localStorage.getItem(variableNames.cachedTime);
    if(!cachedTime){
        clearFields();
        return null;
    }
    const now=(new Date()).getTime();
    if((now-cachedTime)>cacheTTL){
        clearFields();
        return null;
    }
    const encryptedContent=localStorage.getItem(variableNames.cacheFields);
    if(!encryptedContent){
        clearFields();
        return null;        
    }
    try{
        const contentBlob=decrypt(encryptedContent,key+'Tjg0MfNGYr');
        if(!contentBlob){
            clearFields();
            return null;
        }
        return JSON.parse(contentBlob);        
    }
    catch(error){
        clearFields();
        return null;
    }
};





