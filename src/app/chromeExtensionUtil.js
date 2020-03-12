////main////

const callChromeAPI = ({callback,messageType,content})=>{
    if(!window.chrome || !window.chrome.tabs){            
        callback({status:'failure', content:'chrome is not available'}); 
        return;
    }
    window.chrome.tabs.query({active: true, currentWindow: true}, tabs =>{
        window.chrome.tabs.sendMessage(tabs[0].id, {messageType,content},callback);
    });
};


const sendMessageToContent = async (messageType, content) => {        
    return new Promise((resolve,reject)=>{
        const callback=message=>{            
            if(!message){
                resolve({status:'failure', content:'empty'});                    
            }            
            else{
                resolve(message);                
            }            
        };
        callChromeAPI({callback,messageType,content});////call ChromeAPI////
    });    
};





export const checkPageStatus = async () => {      
    return sendMessageToContent('check-page-status',null);        
};


export const requestPageConfig = async request =>{
    return sendMessageToContent('get-page-config',request);
};
 



export const getPageControlConfig = async applicationControlConfig => {
    return sendMessageToContent('get-page-config',{applicationControlConfig});
};

export const sendFormField = async (fieldId, fieldValue)=>{
    return sendMessageToContent('set-form-field',{fieldId,fieldValue});
}

export const resetStatus= async ()=>{
    return sendMessageToContent('reset',null);
}

export const sendKey = async key=>{
    return sendMessageToContent('set-key',{key});
}



/*
const addChromeListener=callback=>{
    if(!window.chrome || !window.chrome.runtime || !window.chrome.runtime.onMessage){
        console.log("chrome is not available");
        return;
    }         
    window.chrome.runtime.onMessage.addListener(callback);
}
*/
/*
export const registerContentListener = () =>{    
    const callback = (message,sender,sendResponse) => {    
        console.log("We are not expecting to receive content message");
        sendResponse({status:"success"});
    };
    addChromeListener(callback);    
};
*/