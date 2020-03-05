
const sendMessageToContent = (messageType, content,callback) => {        
    if(!window.chrome || !window.chrome.tabs){
        console.log("chrome is not available");
        return;
    }
    window.chrome.tabs.query({active: true, currentWindow: true}, tabs =>{
        window.chrome.tabs.sendMessage(tabs[0].id, {messageType:messageType,content:content}, callback);
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


export const checkPageStatus = (onSuccess, onFailure) => {        
    sendMessageToContent('check-page-status',null, message => {
        if(!message){          
          onFailure({messageType:"check-page-status",status:'failure'});
        }
        else{
            console.log("-------replied:"+JSON.stringify(message));             
            onSuccess(message);            
        }
    })
};
//{"messageType":"check-page-status","host":"localhost:3000","cacheTTL":60000,"status":"success","content":{"cachefields":null}}