import React, {useEffect, useState} from 'react';
import {InputWithLabel,TextButton,DisplayErrorMessage,FormContainer,FormFooter} from '../app-layout';
import ACTIONS from './ACTIONS';
import ProvideContentHelp from './ProvideContentHelp';

const fields={
    back:{
        id:"backToHome",
        type:"button",
        label:"Back",        
        viewId:"row1"
    },
    info:{
        type:'info',
        value: 'Please operate on your computer (in the extension window ) to provide the encrypted content you would like to decrypt.',
    },
    toMobile:{
        id:"ComposeOnMobile",
        type:"button",            
        label:"Use Mobile",
        viewId:"row1"
    }
}


const initData= {
    action:"input",
    dataType:"form", 
    form:{
        title:"Waiting for Content",
        fields:[fields.info,fields.back,fields.toMobile]
    }
};

export default ({content, setContent,globalInputApp,toMobileIntegrationHome,setAction})=>{
    const [errorMessage, setErrorMessage]=useState(null);

    useEffect(()=>{                  
        globalInputApp.setInitData(initData);          
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
                  case fields.toMobile.id:
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
           setErrorMessage('Content missing!');
       }
       
   }
    return(
        <FormContainer title="Mobile Decryption">              
                    <InputWithLabel label="Content to decrypt" id="content"
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
            <ProvideContentHelp/>            
            
                  </FormContainer>
         );

};