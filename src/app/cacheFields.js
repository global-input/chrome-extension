import {generateRandomString, encrypt, decrypt} from 'global-input-react';

export const generateEncryptionKey=()=>{
    return generateRandomString(20);    
}
const keyNames={
    cacheFields:'extension.content.cacheFields',
    cachedTimes:'extension.content.cachedTime'
};
const cacheTTL=60000;

export const cacheIfMultipleFields = formFields=>{    
        const numberOfNotEmptyFields=formFields.reduce((count,f)=>f.value?count+1:count,0);
        if(numberOfNotEmptyFields<0){
                return null;
        }
        const key=generateEncryptionKey();        
        const contentBlob=JSON.stringify(formFields);
        const encryptedContent=encrypt(contentBlob,key);
        localStorage.setItem(keyNames.cachedTimes,(new Date()).getTime());
        localStorage.setItem(keyNames.cacheFields,encryptedContent);        
        return key;    

}
export const clearFields= ()=>{
    localStorage.removeItem(keyNames.cacheFields);
    localStorage.removeItem(keyNames.cachedTimes);    
}
export const loadFormFields = key=>{
    const cachedTime=localStorage.getItem(keyNames.cachedTimes);
    if(!cachedTime){
        return null;
    }
    const now=(new Date()).getTime();
    if((now-cachedTime)>cacheTTL){
        clearFields();
        return null;
    }
    const encryptedContent=localStorage.getItem(keyNames.cacheFields);
    if(!encryptedContent){
        clearFields();
        return null;        
    }
    try{
        const contentBlob=decrypt(encryptedContent,key);
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





