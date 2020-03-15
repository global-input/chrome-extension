import React, { useState, useEffect } from "react";
import { useGlobalInputApp } from 'global-input-react';

import * as appSettings from './appSettings';
import { MobileIntegrationContainer, MessageContainer} from './app-layout';

import FormDataTransfer from './form-data-transfer';
import PageControl from './page-control';
import MobileEncryption from './mobile-encryption';
import MobileDecryption from './mobile-decryption';


const ACTIONS = {
     MOBILE_INTEGRATION_HOME: 'mobile-integration-home',
     FORM_DATA_TRANSFER: 'form-data-transfer',
     PAGE_CONTROL: 'page-control',
     MOBILE_ENCRYPTION:'mobile-encryption',
     MOBILE_DECRYPTION:'mobile-decryption'
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
                    label: "Transfer Form Data",
                    viewId:"row1"
               },{
                    id: ACTIONS.MOBILE_ENCRYPTION,
                    type: 'button',
                    label: 'Encryption',
                    viewId:"row2"
               },{
                    id: ACTIONS.MOBILE_DECRYPTION,
                    type: 'button',
                    label: 'Decryption',
                    viewId:"row2"
               },{
                    id: ACTIONS.PAGE_CONTROL,
                    type: 'button',
                    label: 'Sign In/Page Control',
                    viewId:"row3"
               }]
          }
     };     
     return {
          initData,
          options:appSettings.getGlobalInputSettings()
     };

};

const WhenAction =({action,value,children}) => {     
     if(action===value){
          return children;
     }
     else{
          return null;          
     }
};



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
               case ACTIONS.MOBILE_ENCRYPTION:
                    setAction(ACTIONS.MOBILE_ENCRYPTION);                    
                    break;
               case ACTIONS.MOBILE_DECRYPTION:
                    setAction(ACTIONS.MOBILE_DECRYPTION);                    
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

               <WhenAction action={action} value={ACTIONS.MOBILE_ENCRYPTION}>               
               <MobileEncryption globalInputApp={globalInputApp} toMobileIntegrationHome={toMobileIntegrationHome}/>
               </WhenAction>

               <WhenAction action={action} value={ACTIONS.MOBILE_DECRYPTION}>               
               <MobileDecryption globalInputApp={globalInputApp} toMobileIntegrationHome={toMobileIntegrationHome}/>
               </WhenAction>

               

          </MobileIntegrationContainer>
     );
};



