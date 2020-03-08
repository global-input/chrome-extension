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
     const [cacheTTL, setCacheTTL] = useState(60000);
     const [cachedFieldValues, setCachedFieldValue] = useState(null);
     useEffect(() => {
          const checkStatus = async () => {
               try {
                    const message = await chromeExtensionUtil.checkPageStatus();
                    setDomain(message.host);
                    setCacheTTL(message.cacheTTL);
                    setCachedFieldValue(message.content.cachefields);
                    if(message.content.cachefields && message.content.cachefields.length){
                         setAction(ACTIONS.DISPLAY_CACHED_FORM);
                    }
                    else{
                        setAction(ACTIONS.MOBILE_INTEGRATION); 
                    }
               }
               catch (error) {
                    console.log('failed:' + JSON.stringify(error))
                    setBrowserError('failed:' + error && error.content);
                    setAction(ACTIONS.MOBILE_INTEGRATION); 
               }
          }
          checkStatus();
     }, []);
     const goBackToHome=()=>{
          chromeExtensionUtil.clearCacheFields();
          setAction(ACTIONS.MOBILE_INTEGRATION); 
     }
     const props = {
          domain,
          browserError,
          cacheTTL,
          cachedFieldValues,
          goBackToHome
     }
     switch (action) {
          case ACTIONS.LOADING:
               return (<MessageContainer title="Global Input App">Loading...</MessageContainer>);
          case ACTIONS.MOBILE_INTEGRATION:
               return (<MobileIntegration {...props}/>);          
          case ACTIONS.DISPLAY_CACHED_FORM:
               return <DisplayCachedForm {...props} formFields={cachedFieldValues} goBackToHome={goBackToHome}/>
          default:
               return (<MessageContainer title="Global Input App">Unknown state</MessageContainer>);          
     }
     
};
