import React, { useState, useEffect } from "react";
import { useGlobalInputApp } from 'global-input-react';

import * as appSettings from './appSettings';
import { MobileIntegrationContainer, MessageContainer} from './app-layout';

import FormDataTransfer from './FormDataTransfer';
import PageControl from './PageControl';

export default ({ domain, toSettings }) => {
     
     const globalInputApp = useGlobalInputApp(()=>buildConfigData(domain));
     
     const [action, setAction] = useState(ACTIONS.MOBILE_INTEGRATION_HOME);
          
     useEffect(() => {
          const { field } = globalInputApp;
          if (!field || action !== ACTIONS.MOBILE_INTEGRATION_HOME) {
               return;
          }
          switch (field.id) {
               case ACTIONS.FORM_DATA_TRANSFER:
                    console.log("calling setAction");
                    setAction(ACTIONS.FORM_DATA_TRANSFER);
                    break;
               case ACTIONS.PAGE_CONTROL:
                    setAction(ACTIONS.PAGE_CONTROL);
                    break;
               default:
          }

     }, [globalInputApp.field]);
     
     const toMobileIntegrationHome = () => {
          setAction(ACTIONS.MOBILE_INTEGRATION_HOME);
          const config = buildConfigData(domain);
          globalInputApp.setInitData(config.initData);
     };
     
     return (
          <MobileIntegrationContainer globalInputApp={globalInputApp} toSettings={() => {
               globalInputApp.disconnect();
               toSettings();
          }} toMobileIntegrationHome={toMobileIntegrationHome}>               
               <WhenAction action={action} value={ACTIONS.FORM_DATA_TRANSFER}>
                         <FormDataTransfer globalInputApp={globalInputApp} 
                         domain ={domain} toMobileIntegrationHome = {toMobileIntegrationHome}/>
               </WhenAction>

               <WhenAction action={action} value={ACTIONS.MOBILE_INTEGRATION_HOME}>
                         <MessageContainer title="Global Input App">
                                        Please select from the operations displayed on your mobile
                         </MessageContainer>
               </WhenAction>
               <WhenAction action={action} value={ACTIONS.PAGE_CONTROL}>               
               <PageControl globalInputApp={globalInputApp} domain={domain} toMobileIntegrationHome={toMobileIntegrationHome}/>
               </WhenAction>
          </MobileIntegrationContainer>
     );
};

const WhenAction =({action,value,children}) => {     
     if(action===value){
          return children;
     }
     else{
          return null;          
     }
};


const ACTIONS = {
     MOBILE_INTEGRATION_HOME: 'mobile-integration-home',
     FORM_DATA_TRANSFER: 'form-data-transfer',
     PAGE_CONTROL: 'page-control'
};






const buildConfigData = domain => {
     const initData = {
          action: "input",
          dataType: "form",
          form: {
               title: "Please Select",
               fields: [{
                    id: ACTIONS.FORM_DATA_TRANSFER,
                    type: "button",
                    label: "Transfer Form Data"
               }]
          }
     };
     if (domain) {
          initData.form.fields.push({
               id: ACTIONS.PAGE_CONTROL,
               type: 'button',
               label: 'Sign In/Page Control'
          });
     };
     const options = appSettings.getGlobalInputSettings();
     console.log("::initData::*************::"+initData);
     return {
          initData,
          options
     };

}
