import React, {useEffect} from 'react';
import {FormContainer,MessageContainer} from '../app-layout';

import * as pageControlUtil from './pageControlUtil';
import * as chromeExtensionUtil from '../chromeExtensionUtil';
import ACTIONS from './ACTIONS';



export default ({globalInputApp,domain,setAction, toMobileIntegrationHome}) => {    
    
    useEffect(()=>{
        const toPageControlHome=async () =>{
            setAction(ACTIONS.PAGE_CONTROL_HOME);
            let initData=await buildInitData({domain,toMobileIntegrationHome});                
            globalInputApp.setInitData(initData);        
        };        
        toPageControlHome();        
    },[]);  

    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
            case fieldGoBack.id:
                toMobileIntegrationHome();
                break;
            case fieldEditApplicationControl.id:                
                 setAction(ACTIONS.EDIT_APP_CONTROL_SETTINGS);
                break;
            default:            
        }
    },[globalInputApp.field])
        
            return (
                <FormContainer title="Sign In/Page Control">
                    <MessageContainer>
                         You may now operate on the page using your mobile. 
                    </MessageContainer>
                
                </FormContainer>
                );
};



const fieldGoBack={
    id:'giaMobileIntegration',
    type:"button",
    label:"Back",
    viewId:"row1"
};
const fieldEditApplicationControl={
    id:'giaAppControlSettings',
    type:"button",
    label:"Edit Control Settings",
    viewId:"row1"
}






const buildFormField=(field,toMobileIntegrationHome)=>{
    let id=field.id;

    if(field.type==='list'||field.type==='info' || field.type==='picker' || field.type==='select'){
        id=null;
    }
    let value=field.value;


    if(field.type==='info' || field.type==='picker' || field.type==='select'){
          value=field.value;
          if(field.type==='picker'){
              if(typeof field.value ==='undefined'){
                  value=field.items[0].value;
              }
          }

    };
    return {
        id,
        label:field.label,
        type:field.type,
        items:field.items,
        selectType:field.selectType,
        value,
        operations:{                    
          onInput: newValue => {                       
              chromeExtensionUtil.sendFormField(field.id,newValue);
              if(field.matchingRule.nextUI){
                toMobileIntegrationHome();                
              }                        
          }
        }
  };
};




const buildInitData= async ({domain,toMobileIntegrationHome})=>{        
        
        
        let applicationSettings=pageControlUtil.getUserApplicationControlConfig(domain);    
        if(!applicationSettings){
            applicationSettings=pageControlUtil.getEmbeddedApplicationControlConfig(domain);
            if(!applicationSettings){
                return initDataWitNoPageControl(['Configuration for "'+domain+'" does not exist. ','you may create one by pressing the "Create Configuration" button below.'], 'Create Configuration');
            }
        }       
        const message = await chromeExtensionUtil.getPageControlConfig(applicationSettings);
        if(message.status==="success"){
                const fields=message.content.form.fields.map(f=>buildFormField(f,toMobileIntegrationHome));
                fields.push(fieldGoBack);
                fields.push(fieldEditApplicationControl);
                return {
                    action: "input",
                    dataType: "form",
                    form:{
                        id:message.content.form.id,
                        title:message.content.form.title,
                        fields
                    }          
                };                
        }
        else{
            return initDataWitNoPageControl('The loaded page does not contain the matching HTML elements defined in the configuration for "'+domain+'". You may click on the "Edit Config" button and define the HTML elements that actually exist in the page', "Edit Config");
        }  
};


const initDataWitNoPageControl = (message, label)=>{
    const fieldInfo={
            type:'info',
            value:message
    };
    return {
        action: "input",
        dataType: "form",
        form:{            
            title:"Mobile Input/Control",
            fields: [fieldInfo,fieldGoBack,{...fieldEditApplicationControl,label}]
        }          
    };  
}


