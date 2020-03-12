import React, {useEffect,useState} from 'react';
import {FormContainer} from './app-layout';

import * as pageControlUtil from './pageControlUtil';
import * as chromeExtensionUtil from './chromeExtensionUtil';

import EditAppControlSettings from './EditAppControlSettings';
export default ({globalInputApp,domain,toMobileIntegrationHome}) => {
    const [action,setAction]=useState(ACTIONS.HOME);
    const toPageControlHome=async () =>{
        const initData=await buildInitData(domain);        
        globalInputApp.setInitData(initData);               
        setAction(ACTIONS.PAGE_CONTROL_HOME);
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
           return(<EditAppControlSettings globalInputApp={globalInputApp} domain={domain} toPageControlHome={toPageControlHome}/>);
        
        case ACTIONS.PAGE_CONTROL_HOME:
        default:
            return (
                <FormContainer title="Mobile Input/Control On Page">
                Please operate on your mobile
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


const getFormWithoutControl = ()=>{
    return {    
                title:"Mobile Input/Control",
                fields: [fieldGoBack,fieldEditApplicationControl]
    }    
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
        var applicationSettings=pageControlUtil.getApplicationControlSettings(domain);    
        const applicationControlConfig=applicationSettings.applicationConfigs;
        console.log("----:applicationControlConfig====:"+JSON.stringify(applicationControlConfig));
        let form=null;    
        const message = await chromeExtensionUtil.getPageControlConfig(applicationControlConfig);
        if(message.status==="success"){
                const fields=message.content.form.fields.map(f=>buildFormField(f));
                fields.push(fieldGoBack);
                fields.push(fieldEditApplicationControl);
                form= {
                    id:message.content.form.id,
                    title:message.content.form.title,
                    fields
                };     
        }
        else{
            form=getFormWithoutControl();
        }
        return {
            action: "input",
            dataType: "form",
            form           
        };
        
};


