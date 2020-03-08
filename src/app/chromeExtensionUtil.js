////main////

const callChromeAPI = ({callback,messageType,content})=>{
    if(!window.chrome || !window.chrome.tabs){            
        callback({status:'failure', content:'chrome is not available'}); 
        return;
    }
    window.chrome.tabs.query({active: true, currentWindow: true}, tabs =>{
        window.chrome.tabs.sendMessage(tabs[0].id, {messageType,content},callback);
    });
}

const sendMessageToContent = async (messageType, content) => {        
    return new Promise((resolve,reject)=>{
        const callback=message=>{
            if(!message){
                reject({status:'failure', content:'empty'});                    
            }
            else if(message.status!=='success'){
                reject(message);
            }
            else{
                resolve(message);                
            }            
        };
        callChromeAPI({callback,messageType,content});////call ChromeAPI////
    });    
};

const registerContentListener = () =>{
    const onContentMessageReceived=(message,sender,sendResponse)=>{    
        console.log("We are not expecting to receive content message");
    } 
    if(!window.chrome || !window.chrome.runtime.onMessage){
        console.log("chrome is not available");
        return;
    }         
    window.chrome.runtime.onMessage.addListener(onContentMessageReceived);
};


export const checkPageStatus = async () => {      
        return sendMessageToContent('check-page-status',null);
};

export const sendFormFieldForCache = async (fieldId,fieldValue) =>{
    return sendMessageToContent('set-cache-field',{fieldId,fieldValue});
};
export const clearCacheFields = async () =>{
    return sendMessageToContent('set-all-cache-fields',{cachefields:[]});
}; 
