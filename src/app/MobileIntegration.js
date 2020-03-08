import React, {useState, useEffect } from "react";
import {useGlobalInputApp} from 'global-input-react';

import * as chromeExtensionUtil from './chromeExtensionUtil'
import {AppContainer,MessageContainer,P} from './app-layout';

import FormDataTransfer from './FormDataTransfer';


export default ({domain})=>{        
    const globalInputApp = useGlobalInputApp({initData});
    const [action, setAction]=useState(ACTIONS.HOME);
    const goBackToHome=()=>{
          setAction(ACTIONS.HOME);
          globalInputApp.setInitData(initData);     
    }
    

     useEffect(()=>{
          const {field}=globalInputApp;
          if(!field || action!==ACTIONS.HOME){
               return;
          }
          switch(field.id){
                    case ACTIONS.FORM_DATA_TRANSFER:
                              setAction(ACTIONS.FORM_DATA_TRANSFER);
                              break;

          }

     },[globalInputApp.field]);
          
     const props={
          globalInputApp,
          domain,
          goBackToHome          
     };
     
    const switchByAction=()=>{
          switch(action){
               case ACTIONS.HOME:
                    return (<MessageContainer title="Global Input App" {...props}>                              
                                   Please operate on your mobile           
                            </MessageContainer>
                         );
               case ACTIONS.FORM_DATA_TRANSFER:
                    return (<FormDataTransfer {...props}/>);
          }
    }    
    return (
    <AppContainer globalInputApp={globalInputApp}>
         {switchByAction()}
    </AppContainer>
    );
};

const ACTIONS={
    HOME:'home', 
    FORM_DATA_TRANSFER:'form_data_transfer'    
};

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