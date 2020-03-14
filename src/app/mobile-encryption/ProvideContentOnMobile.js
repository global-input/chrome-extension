import React, {useEffect, useState} from 'react';
import {InputWithLabel,TextButton,DisplayErrorMessage,FormContainer,FormFooter} from '../app-layout';
import ACTIONS from './ACTIONS';
import ProvideContentHelp from './ProvideContentHelp';

const fields={
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
const initData= value=>{
    const fContent={...fields.content,value};    
    return{
        action:"input",
        dataType:"form", 
        form:{
            title:"Content To Encrypt",
            fields:[fContent,fields.back,fields.encrypt]
        }
    };
    
};


export default ({content, setContent,globalInputApp,toMobileIntegrationHome,setAction})=>{    
    const [errorMessage, setErrorMessage]=useState(null); 
    useEffect(()=>{                  
        globalInputApp.setInitData(initData(content));          
    },[]);  
    const onSendToMobile=()=>{
        if(content.trim().length){
             setAction(ACTIONS.SEND_TO_MOBILE);
        }
        else{
            setErrorMessage('Content missing!');
        }
        
    }   
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
                  case fields.back.id:
                       setAction(ACTIONS.COMPOSE_CONTENT_ON_COMPUTER);
                       break;
                  case fields.content.id:
                        setErrorMessage(null);
                        setContent(field.value);                        
                        break;
                  case fields.encrypt.id:
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
                                globalInputApp.setFieldValueById(fields.content.id,value);
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