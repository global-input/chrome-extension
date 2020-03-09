////main////
import {generateRandomString, encrypt, decrypt} from 'global-input-react';



export const generatedEncryptionKey=()=>{
    const encryptionKey= generateRandomString(20);    
    localStorage.setItem('extension.content.tmpKey',encryptionKey);
};
export const getEncryptionKey=()=>{    
    return localStorage.getItem('extension.content.tmpKey');
}

const cacheTTL=60000;
const callChromeAPI = ({callback,messageType,content})=>{
    if(!window.chrome || !window.chrome.tabs){            
        callback({status:'failure', content:'chrome is not available'}); 
        return;
    }
    window.chrome.tabs.query({active: true, currentWindow: true}, tabs =>{
        window.chrome.tabs.sendMessage(tabs[0].id, {messageType,content},callback);
    });
};
const addChromeListener=callback=>{
    if(!window.chrome || !window.chrome.runtime || !window.chrome.runtime.onMessage){
        console.log("chrome is not available");
        return;
    }         
    window.chrome.runtime.onMessage.addListener(callback);
}

export const registerContentListener = () =>{    
    const callback = (message,sender,sendResponse) => {    
        console.log("We are not expecting to receive content message");
        sendResponse({status:"success"});
    };
    addChromeListener(callback);    
};

const sendMessageToContent = async (messageType, content) => {        
    return new Promise((resolve,reject)=>{
        const callback=message=>{
            console.log("--------****-----callback");
            if(!message){
                resolve({status:'failure', content:'empty'});                    
            }
            else if(message.status!=='success'){
                resolve(message);
            }
            else{
                resolve(message);                
            }            
        };
        callChromeAPI({callback,messageType,content});////call ChromeAPI////
    });    
};




export const checkPageStatus = async () => {      
        const message=await sendMessageToContent('check-page-status',null);
        const encryptionKey=getEncryptionKey();
    
        if(!encryptionKey){
            console.log("encryption key is missing");
            return message;
        }
        
        if(message.content && message.content.cachefields && message.content.cachefields.length){                         
            try{
                console.log("going to decruypt:"+encryptionKey);
                const cachefields=message.content.cachefields.map(f=>{
                   const value=decrypt(f.value,encryptionKey);                
                    return {...f,value};
                });
                const content={...message.content,cachefields};                 
            return {...message,content};
           }
           catch(error){
               console.error("failed to decrypt chrome cached value:"+error);
               return message;
           }
        }
        
        return message;
};

export const sendFormFieldForCache = async (fieldId,value) =>{
    const key=getEncryptionKey();
    console.log("----key:("+key+")value:("+value+")");

    const fieldValue=encrypt(value,key);
    return sendMessageToContent('set-cache-field',{fieldId,fieldValue});
};
export const clearCacheFields = async () =>{
    return sendMessageToContent('reset',null);
}; 
export const requestPageConfig = async request =>{
    return sendMessageToContent('get-page-config',request);
};
 



let cacheTimer=null;
const clearCacheTimer=() => {
    if(cacheTimer){
        const  timer=cacheTimer;
        cacheTimer=null;
        clearTimeout(timer);
    }
};
export const updateCacheTimer = async () => {
    
    if(cacheTimer){
        console.log("already have started.........");
        return;
    }
    const timeValue=cacheTTL-3000;
    if(timeValue<1000){
        console.log("ttl is too small");
        return;
    }
    sendMessageToContent('update-cache-time',{cacheTTL});
    cacheTimer=setInterval(()=>{
        sendMessageToContent('update-cache-time',{cacheTTL});
    },timeValue);    
};


export const resetCache = async request =>{    
    clearCacheTimer();    
    return sendMessageToContent('reset',request);
};


export const getPageControlConfig = async applicationControlConfig => {
    return sendMessageToContent('get-page-config',{applicationControlConfig});
};

export const sendFormField = async (fieldId, fieldValue)=>{
    return sendMessageToContent('get-page-config',{fieldId,fieldValue});
}
