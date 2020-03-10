import React, {useState, useEffect } from "react";
import {useGlobalInputApp} from 'global-input-react';

import * as appSettings from './appSettings';
import {AppContainer,MessageContainer,P} from './app-layout';

import FormDataTransfer from './FormDataTransfer';
import PageControl from './PageControl';


const ACTIONS={
     HOME:'home', 
     FORM_DATA_TRANSFER:'form_data_transfer',
     PAGE_CONTROL:'page_control'     
 };

 

export default ({domain, gotoSettings})=>{  
    const options=appSettings.getGlobalInputSettings();          
    const globalInputApp = useGlobalInputApp({initData:()=>getInitData(domain), options});
    const [action, setAction]=useState(ACTIONS.HOME);
    const goBackToHome=()=>{
          setAction(ACTIONS.HOME);
          globalInputApp.setInitData(getInitData(domain));     
    }
    const onSettings=()=>{
          globalInputApp.disconnect();
          gotoSettings();          
    }
     const props={
          globalInputApp,
          domain,
          goBackToHome          
     };
     
    const switchByAction=()=>{
         console.log("----action:"+action);
          switch(action){
               case ACTIONS.HOME:
                    return (<Home globalInputApp={globalInputApp} setAction={setAction}/>);
               case ACTIONS.FORM_DATA_TRANSFER:
                    return (<FormDataTransfer {...props}/>);
               case ACTIONS.PAGE_CONTROL:
                    if(domain){
                         return (<PageControl {...props}/>);
                    }
                    else{
                         //should not comere
                         return null;
                    }
                    
          }
    }    
    return (
    <AppContainer globalInputApp={globalInputApp} onSettings={onSettings}>
         {switchByAction()}
    </AppContainer>
    );
};

const Home=({globalInputApp,setAction})=>{
     
     useEffect(()=>{
          const {field}=globalInputApp;  
          if(!field){
               return;
          }        
          switch(field.id){
                    case ACTIONS.FORM_DATA_TRANSFER:
                              console.log("calling setAction");
                              setAction(ACTIONS.FORM_DATA_TRANSFER);
                              break;
                    case ACTIONS.PAGE_CONTROL:
                              setAction(ACTIONS.PAGE_CONTROL);
                              break;
                    default:
          }

     },[globalInputApp.field]);
     
     return (<MessageContainer title="Global Input App">                              
                                   Please operate on your mobile           
            </MessageContainer>
     );
}


const getInitData=domain=>{
     const initData={
          action: "input",
          dataType: "form",
          form: {    
               title:"Please Select",
               fields:[{id:ACTIONS.FORM_DATA_TRANSFER,
                    type:"button",
                    label:"Transfer Form Data"}]
          }   
     };
     if(domain){
          initData.form.fields.push({
               id:ACTIONS.PAGE_CONTROL,
               type:'button',
               label:'Sign In/Control'
          });
     }
     return initData;

}
