import React, { useState, useEffect } from "react";

import * as chromeExtensionUtil from './chromeExtensionUtil'
import * as cacheFields from './cacheFields';
import {MessageContainer} from './app-layout';

import MobileIntegration from './MobileIntegration';
import DisplayCachedForm from './DisplayCachedForm';
import EditConnectionSettings from './EditConnectionSettings';
const ACTIONS = {
     LOADING: 1,
     MOBILE_INTEGRATION: 2,
     DISPLAY_CACHED_FORM:3,
     CONNECTION_SETTINGS:4
}
export default () => {
     const [action, setAction] = useState(ACTIONS.LOADING);
     const [domain, setDomain] = useState(null);
     const [browserError, setBrowserError] = useState(null)               
     const [cachedFieldValues, setCachedFieldValue] = useState(null);
     const gotoMobileIntegration=()=>{          
          chromeExtensionUtil.resetStatus();
          setAction(ACTIONS.MOBILE_INTEGRATION); 
     };
     const gotoSettings=()=>{
          setAction(ACTIONS.CONNECTION_SETTINGS); 
     }
     const checkStatus = async () => {
          try {
               const message = await chromeExtensionUtil.checkPageStatus();
               setDomain(message.host);  
               if(message.content.key){
                    const cachedFields=cacheFields.loadFormFields(message.content.key);
                    if(cachedFields){
                         setCachedFieldValue(cachedFields);
                         setAction(ACTIONS.DISPLAY_CACHED_FORM);
                         return;
                    }
               }                              
          }
          catch (error) {
               console.error('failed:' + JSON.stringify(error))                    
               setBrowserError('failed:' + error && error.content);              
          }         
          gotoMobileIntegration();
     }
     useEffect(() => {          
          checkStatus();          
     }, []);
     
     const props = {
          domain,
          browserError,          
          cachedFieldValues,
          gotoMobileIntegration,
          cachedFieldValues,
          gotoSettings
     }
     switch (action) {
          case ACTIONS.LOADING:
               return (<MessageContainer title="Global Input App">Loading...</MessageContainer>);
          case ACTIONS.MOBILE_INTEGRATION:
               return (<MobileIntegration {...props}/>);          
          case ACTIONS.DISPLAY_CACHED_FORM:
               return <DisplayCachedForm {...props}/>
          case ACTIONS.CONNECTION_SETTINGS:
               return <EditConnectionSettings {...props}/>

          default:
               return (<MessageContainer title="Global Input App">Unknown state</MessageContainer>);          
     }
     
};
