import React, { useState, useEffect } from "react";

import * as chromeExtensionUtil from './chromeExtensionUtil'
import * as cacheFields from './cacheFields';
import { MessageContainer } from './app-layout';

import MobileIntegration from './MobileIntegration';
import DisplayCachedForm from './DisplayCachedForm';
import EditConnectionSettings from './EditConnectionSettings';


export default () => {
     const [action, setAction] = useState(ACTIONS.LOADING);
     const [domain, setDomain] = useState(null);
     const [cachedFieldValues, setCachedFieldValue] = useState(null);
     const toMobileIntegration = () => {
          chromeExtensionUtil.resetStatus();
          setAction(ACTIONS.MOBILE_INTEGRATION);
     };
     const toSettings = () => {
          setAction(ACTIONS.CONNECTION_SETTINGS);
     }
     const checkPageStatus = async () => {
          const message = await chromeExtensionUtil.checkPageStatus();
          if (message && message.status === 'success' && message.host) {
               setDomain(message.host);
               if (message.content.key) {
                    const cachedFields = cacheFields.loadFormFields(message.host,message.content.key);
                    if (cachedFields) {
                         setCachedFieldValue(cachedFields);
                         setAction(ACTIONS.DISPLAY_CACHED_FORM);
                         return;
                    }
               }
          }
          else {
               setDomain(null);
               console.error('failed:' + JSON.stringify(message));
          }
          toMobileIntegration();
     };
     useEffect(()=>{
          checkPageStatus();
     }, []);

     switch (action) {
          case ACTIONS.MOBILE_INTEGRATION:
               return (<MobileIntegration
                    domain={domain}
                    toSettings={toSettings} />);

          case ACTIONS.DISPLAY_CACHED_FORM:
               return (<DisplayCachedForm
                    toMobileIntegration={toMobileIntegration}
                    cachedFieldValues={cachedFieldValues}
                    domain={domain} />);

          case ACTIONS.CONNECTION_SETTINGS:
               return <EditConnectionSettings 
                    toMobileIntegration={toMobileIntegration}/>


          case ACTIONS.LOADING:
          default:
               return (<MessageContainer
                    title="Global Input App">Loading...</MessageContainer>);
     }

};

const ACTIONS = {
     LOADING: 1,
     MOBILE_INTEGRATION: 2,
     DISPLAY_CACHED_FORM: 3,
     CONNECTION_SETTINGS: 4
}
