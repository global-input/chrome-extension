import React, {useEffect, useState} from 'react';
import {InputWithLabel,InputWithCopy,TextButton,MessageContainer,DisplayErrorMessage,FormContainer,FormFooter} from './app-layout';

const ACTIONS={
    COMPOSE_CONTENT_ON_COMPUTER:1,
    COMPOSE_CONTENT_ON_MOBILE:2,
    SEND_TO_MOBILE:3,
    LOAD_RESULT_ON_MOBILE:4
};

const fields={
    back:{
        id:"backToHome",
        type:"button",
        label:"Back",        
        viewId:"row1"
    },
    compose:{
        computer:{
            info:{
                type:'info',
                value: 'Please operate on the browser extension to enter the content you would like to encrypt.',
            },
            toMobile:{
                id:"ComposeOnMobile",
                type:"button",            
                label:"Compose on Mobile",
                viewId:"row1"
            }
        },
        mobile:{
            content:{
                id:"contentOnMobile",
                type:'text',
                nLines:5,
                value: 'null',
            },
            back:{
                id:'backToComposeOnComputer',
                type:'button',
                label:'back',
                viewId:"row1"
            },
            encrypt:{
                id:"toEncrypt",
                type:"button",            
                label:"Encrypt",
                viewId:"row1"
            }
        }
    },
    encrypt:{
        content:{                
                id:   "content",
                label :"Content",
                type: 'encrypt',    
                value:''
        },
        info:{            
                type:"info",
                value:'Please operate on the browser extension to copy the encrypted content into your clipboard. You can do so by pressing the "Copy" button there.'
        },
        loadOnMobile:{
            id:"loadOnMobile",
            label:"Load On Mobile",
            type:"button",            
            viewId:"row1"
        },
        finish:{
            id:"finish",
            label:"Finish",            
            type:"button",
            viewId:"row1"                       
        },
    },
    loadResultOnMobile:{        
        content:{                
            id:   "content",
            label :"Content",
            type: 'text', 
            nLines:5,   
            value:''
        },

        finish:{
            id:"finish",
            label:"Finish",            
            type:"button"                        
        },
        info:{            
            type:"info",
            value:'The text box above contains the encrypted content, this content can only decrypted with the encryption key that you have used to encrypt the content.'
        },

    }
};
const initDataForComputerCompose= {
    action:"input",
    dataType:"form", 
    form:{
        title:"Waiting for Content",
        fields:[fields.compose.computer.info,fields.back,fields.compose.computer.toMobile]
    }
};

const initDataForMobileCompose= value=>{
    const fContent={...fields.compose.mobile.content,value};    
    return{
        action:"input",
        dataType:"form", 
        form:{
            title:"Content To Encrypt",
            fields:[fContent,fields.compose.mobile.back,fields.compose.mobile.encrypt]
        }
    };
    
};


const initDataForSendToMobile= value=> {
    const fContent={...fields.encrypt.content,value};    
    return{        
        action:"input",
        dataType:"form",
        key:"general",
        form:{
            title:"Content Encryption",
            fields:[fContent,fields.encrypt.info,fields.encrypt.loadOnMobile,fields.encrypt.finish]
        }
     };
};

const initDataForLoadResultOnMobile=value=>{
    const fContent={...fields.loadResultOnMobile.content,value};    
    return{        
        action:"input",
        dataType:"form",        
        form:{
            title:"Encrypted Content",
            fields:[fContent,fields.loadResultOnMobile.finish,fields.loadResultOnMobile.info]
        }
     }
}


export default ({globalInputApp,toMobileIntegrationHome})=>{
    const [action,setAction]=useState(ACTIONS.COMPOSE_CONTENT_ON_COMPUTER);
    const [content, setContent]=useState('');  
    const [encryptedContent, setEncryptedContent]=useState('');
    
    switch(action){
        case ACTIONS.SEND_TO_MOBILE:{
            const props={setAction,content,globalInputApp,encryptedContent, setEncryptedContent,toMobileIntegrationHome};
            return (<SendToMobile {...props}/>);  
        }            
        case ACTIONS.COMPOSE_CONTENT_ON_COMPUTER:{
            const props={content, setContent,globalInputApp,
                toMobileIntegrationHome,setAction};
          return (<ComputerComposeContentContent {...props}/>);    
        }
        case ACTIONS.COMPOSE_CONTENT_ON_MOBILE:{
            const props={content, setContent,globalInputApp,
                toMobileIntegrationHome,setAction};
          return (<ComposeContentOnMobile {...props}/>);    

        }
        case ACTIONS.LOAD_RESULT_ON_MOBILE:{
            const props={globalInputApp,
                toMobileIntegrationHome,setAction,encryptedContent};
            return (<LoadResultOnMobile {...props}/>);    
        }

            
        default:
    }
};



const ComputerComposeContentContent= ({content, setContent,globalInputApp,toMobileIntegrationHome,setAction})=>{
    const [errorMessage, setErrorMessage]=useState(null);

    useEffect(()=>{                  
        globalInputApp.setInitData(initDataForComputerCompose);          
    },[]);     
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
                  case fields.back.id:
                       toMobileIntegrationHome();
                       break;
                  case fields.compose.computer.toMobile.id:
                       setAction(ACTIONS.COMPOSE_CONTENT_ON_MOBILE);
                       break;
                  default:

        }             
    
   },[globalInputApp.field]);
   const onSendToMobile=()=>{
       if(content.trim().length){
            setAction(ACTIONS.SEND_TO_MOBILE);
       }
       else{
           setErrorMessage('Please provide content in the text box above. The content will be send to your mobile for encryption.');
       }
       
   }
    return(
        <FormContainer title="Mobile Encryption">              
                    <InputWithLabel label="Content to encrypt" id="content"
                            onChange={value=>{
                                setErrorMessage(null);
                                setContent(value);
                            }}
                            type="textarea"
                            value={content}/>   
            <DisplayErrorMessage errorMessage={errorMessage}/>
                            <FormFooter>
            <TextButton onClick={()=>{                
                toMobileIntegrationHome()
            }
            } label='Back'/>
            <TextButton onClick={onSendToMobile} label='Send To Mobile'/>

            </FormFooter>
                  </FormContainer>
         );

};

const ComposeContentOnMobile= ({content, setContent,globalInputApp,toMobileIntegrationHome,setAction})=>{    
    const [errorMessage, setErrorMessage]=useState(null); 
    useEffect(()=>{                  
        globalInputApp.setInitData(initDataForMobileCompose(content));          
    },[]);  
    const onSendToMobile=()=>{
        if(content.trim().length){
             setAction(ACTIONS.SEND_TO_MOBILE);
        }
        else{
            setErrorMessage('Please provide content in the text box above. The content will be send to your mobile for encryption.');
        }
        
    }   
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
                  case fields.compose.mobile.back.id:
                       setAction(ACTIONS.COMPOSE_CONTENT_ON_COMPUTER);
                       break;
                  case fields.compose.mobile.content.id:
                        setErrorMessage(null);
                        setContent(field.value);                        
                        break;
                  case fields.compose.mobile.encrypt.id:
                        onSendToMobile();
                        break;
                  default:


                
        }             
    
   },[globalInputApp.field]);
   
    return(
        <FormContainer title="Mobile Encryption">              
                    <InputWithLabel label="Content to encrypt" id="content"
                            onChange={value=>{
                                setErrorMessage(null);
                                setContent(value);
                                globalInputApp.setFieldValueById(fields.compose.mobile.content.id,value);
                            }}
                            type="textarea"
                            value={content}/>   
            <DisplayErrorMessage errorMessage={errorMessage}/>
                            <FormFooter>
            <TextButton onClick={()=>{                
                toMobileIntegrationHome()
            }
            } label='Back'/>
            <TextButton onClick={onSendToMobile} label='Send To Mobile'/>

            </FormFooter>
                  </FormContainer>
         );

};




const SendToMobile=({setAction,content,globalInputApp,encryptedContent, setEncryptedContent,toMobileIntegrationHome})=>{
    useEffect(()=>{          
        globalInputApp.setInitData(initDataForSendToMobile(content));          
  },[]);
  useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
                case fields.encrypt.loadOnMobile.id:                    
                    setAction(ACTIONS.LOAD_RESULT_ON_MOBILE);
                    break;
                
                case fields.encrypt.finish.id:                    
                    toMobileIntegrationHome();
                    break;

                case fields.encrypt.content.id:                    
                    setEncryptedContent(field.value);                    
                    break;                          
        }
  },[globalInputApp.field]);
  
  if(encryptedContent){
      return(
         <FormContainer title="Mobile Encryption">

                        <InputWithCopy id="encryptedContent" readOnly={true}
                            label="Encrypted Content"
                            type={"textarea"}
                            value={encryptedContent}/>
         </FormContainer>
      );

  }
  else{
    return(<MessageContainer title="Encrypting Content">
    Please follow the instruction on your mobile to encrypt the content. 
    On your mobile, you can press the "Show" button to view the content it has received.
    Then, press the "Encrypt" button there to encrypt the content and so on.

  </MessageContainer>);
  }    
};



const LoadResultOnMobile=({globalInputApp,
    toMobileIntegrationHome,setAction,encryptedContent})=>{
    useEffect(()=>{
        globalInputApp.setInitData(initDataForLoadResultOnMobile(encryptedContent));          
    },[]);
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
            case fields.loadResultOnMobile.finish.id:
                toMobileIntegrationHome();
                break;                
        }
  },[globalInputApp.field]);

    return(
        <FormContainer title="Mobile Encryption">

                       <InputWithCopy id="encryptedContent" readOnly={true}
                           label="Encrypted Content"
                           type={"textarea"}
                           value={encryptedContent}/>
        </FormContainer>
     );



}

