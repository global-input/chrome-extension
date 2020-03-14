import React, { useState,useEffect} from 'react';
import {InputWithLabel,TextButton,DisplayErrorMessage,FormContainer,FormFooter} from '../app-layout';
import ACTIONS from './ACTIONS';
const fields={    
    info:{            
        type:"info",
        value:'Failed to decrypt using the encryption key you have selected. You can only decrypt the content using the same encryption key that you have used when encrypting the content. It is also possible that there is something wrong in the content.'
    },
    cancel:{
        id:'backToMobileIntegration',
        type:'button',
        label:'Cancel',
        viewId:"row1"
    },

    tryAgain:{
        id:"tryAgain",
        label:"Try Again",            
        type:"button"                        
    }
}
const initData={
    
        action:"input",
        dataType:"form", 
        form:{
            title:"Content To Decrypt",
            fields:[fields.info,fields.back,fields.tryAgain]
        }
};




export default ({globalInputApp,content,setAction,toMobileIntegrationHome})=>{
    const [errorMessage, setErrorMessage]=useState(null); 
    useEffect(()=>{                  
        globalInputApp.setInitData(initData);          
    },[]);   
    const tryAgain=()=>{
        setAction(ACTIONS.COMPOSE_CONTENT_ON_COMPUTER);
    }      
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
                  case fields.cancel.id:
                       toMobileIntegrationHome();
                       break;
                  case fields.tryAgain.id:                        
                        tryAgain();
                        break;
                  default:                
        }             
    
   },[globalInputApp.field]);
   
    return(
        <FormContainer title="Decryption Failed">                                  
                    <InputWithLabel label="Failed Content" id="content"
                            readOnly={true}
                            type="textarea"
                            value={content}/>
            <DisplayErrorMessage errorMessage={fields.info.value}/>
                            <FormFooter>
            <TextButton onClick={()=>{                
                toMobileIntegrationHome()
            }
            } label='Cancel'/>
            
            <TextButton onClick={tryAgain} label='Try again'/>

            </FormFooter>
            
        </FormContainer>
         );


}

