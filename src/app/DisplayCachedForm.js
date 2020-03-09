import React, {useState, useEffect } from "react";


import * as formUtil from './formUtil';
import * as chromeExtensionUtil from './chromeExtensionUtil'
import {DisplayInputCopyField,TextButton,FormContainer} from './app-layout';

export default ({gotoMobileIntegration,cachedFieldValues, domain})=>{          
   useEffect(()=>{   
      chromeExtensionUtil.updateCacheTimer();
      return()=>{
           chromeExtensionUtil.resetCache();               
      }
   },[]);

          return (
               <FormContainer title="Cached Values" domain={domain}>              
                  {cachedFieldValues.map((formField,index)=>(<DisplayInputCopyField 
                  field={formField} 
                  hideValue={true}
                  key={formField.id}/>))}                                    
                  <TextButton onClick={gotoMobileIntegration} label={'Back'}/>   

               </FormContainer>
          );    
};

