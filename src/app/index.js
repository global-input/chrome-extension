import React, { useState, useEffect } from "react";

import * as chromeExtensionUtil from './chromeExtensionUtil'
import { AppContainer, MessageContainer, P } from './app-layout';

import MobileIntegration from './MobileIntegration';
import DisplayCachedForm from './DisplayCachedForm';
const ACTIONS = {
     LOADING: 1,
     MOBILE_INTEGRATION: 2,
     DISPLAY_CACHED_FORM:3
}
export default () => {
     const [action, setAction] = useState(ACTIONS.LOADING);
     const [domain, setDomain] = useState(null);
     const [browserError, setBrowserError] = useState(null)               
     const [cachedFieldValues, setCachedFieldValue] = useState(null);
     
     const gotoMobileIntegration=()=>{
          chromeExtensionUtil.generatedEncryptionKey();
          chromeExtensionUtil.clearCacheFields();
          setAction(ACTIONS.MOBILE_INTEGRATION); 
     };
     const checkStatus = async () => {
          try {
               const message = await chromeExtensionUtil.checkPageStatus();               
               setDomain(message.host);                    
               
               if(message.content && message.content.cachefields && message.content.cachefields.length){                         
                    setCachedFieldValue(message.content.cachefields);
                    setAction(ACTIONS.DISPLAY_CACHED_FORM);
               }
               else{
                    gotoMobileIntegration();
               }
          }
          catch (error) {
               console.error('failed:' + JSON.stringify(error))                    
               setBrowserError('failed:' + error && error.content);
               gotoMobileIntegration();
          }
         chromeExtensionUtil.registerContentListener();
     }
     useEffect(() => {          
          checkStatus();          
     }, []);
     
     const props = {
          domain,
          browserError,          
          cachedFieldValues,
          gotoMobileIntegration,
          cachedFieldValues
     }
     switch (action) {
          case ACTIONS.LOADING:
               return (<MessageContainer title="Global Input App">Loading...</MessageContainer>);
          case ACTIONS.MOBILE_INTEGRATION:
               return (<MobileIntegration {...props}/>);          
          case ACTIONS.DISPLAY_CACHED_FORM:
               return <DisplayCachedForm {...props}/>
          default:
               return (<MessageContainer title="Global Input App">Unknown state</MessageContainer>);          
     }
     
};
