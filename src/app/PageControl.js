import React, {useEffect,useState} from 'react';
import {FormContainer,MessageContainer} from './app-layout';

import * as pageControlUtil from './pageControlUtil';
import * as chromeExtensionUtil from './chromeExtensionUtil';

import EditPageControlConfiguration from './EditPageControlConfiguration';
export default ({globalInputApp,domain,toMobileIntegrationHome}) => {
    const [action,setAction]=useState(ACTIONS.HOME);
    const toPageControlHome=async () =>{
        setAction(ACTIONS.PAGE_CONTROL_HOME);
        let initData=await buildInitData(domain);                
        globalInputApp.setInitData(initData);        
    };
    useEffect(()=>{
        toPageControlHome();        
    },[]);  
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field || action!==ACTIONS.PAGE_CONTROL_HOME){
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
        
    switch(action){        
        case ACTIONS.EDIT_APP_CONTROL_SETTINGS:
           return(<EditPageControlConfiguration globalInputApp={globalInputApp} domain={domain} toPageControlHome={toPageControlHome}/>);
        
        case ACTIONS.PAGE_CONTROL_HOME:
        default:
            return (
                <FormContainer title="Sign In/Page Control">
                    <MessageContainer>
                         You may now operate on the page using your mobile. 
                    </MessageContainer>
                
                </FormContainer>
                );
    }  
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

const ACTIONS={
    PAGE_CONTROL_HOME:1,
    EDIT_APP_CONTROL_SETTINGS:2
}





const buildFormField=field=>{
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
                  //displayNextUIOnMobile(field.matchingRule.nextUI)
              }                        
          }
        }
  };
};




const buildInitData= async (domain)=>{        
        
        
        let applicationSettings=pageControlUtil.getUserApplicationControlConfig(domain);    
        if(!applicationSettings){
            applicationSettings=pageControlUtil.getEmbeddedApplicationControlConfig(domain);
            if(!applicationSettings){
                return initDataWitNoPageControl(['Configuration for "'+domain+'" does not exist. ','you may create one by pressing the "Create Configuration" button below.'], 'Create Configuration');
            }
        }       
        const message = await chromeExtensionUtil.getPageControlConfig(applicationSettings);
        if(message.status==="success"){
                const fields=message.content.form.fields.map(f=>buildFormField(f));
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


