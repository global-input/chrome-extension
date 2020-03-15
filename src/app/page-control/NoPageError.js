import React, {useEffect} from 'react';
import {FormContainer,MessageContainer} from '../app-layout';

const fields={
    info:{
        type:"info",
        value:"Failed to communicate with the page in the current tab. Check to make sure you have loaded a proper web page in the current tab and make sure you have refreshed the page if you have just installed/updated the extension."    
    },
    back:{
        id:'giaMobileIntegration',
        type:"button",
        label:"Back"
    }     
};


const initData= {
        action: "input",
        dataType: "form",
        form:{            
            title:"Page Control/Sign In",
            fields: [fields.info,fields.back]
        }          
};  


export default ({globalInputApp,domain,setAction, toMobileIntegrationHome}) => {    
    
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
            default:            
        }
    },[globalInputApp.field])
        
            return (
                <FormContainer >
                    <MessageContainer title="Page Control/Sign In">
                    Failed to communicate with the page in the current tab. Check to make sure you have loaded a proper web page in the current tab and make sure you have refreshed the page if you have justly installed/updated the extension.
                    </MessageContainer>                
                </FormContainer>
                );
};

