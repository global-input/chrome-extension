import React, {useState, useEffect } from "react";


import * as formUtil from './formUtil';
import * as chromeExtensionUtil from './chromeExtensionUtil'
import * as cacheFields from './cacheFields';

import {DisplayInputCopyField,TextButton,FormContainer} from './app-layout';

export default ({gotoMobileIntegration,cachedFieldValues, domain})=>{          
   useEffect(()=>{   
      
      return()=>{
         cacheFields.clearFields();               
      }
   },[]);
   const onCopied=()=>{
      console.log("*************");
      
     if(cachedFieldValues.length<2){
          return;
     }
     const numberOfNotEmptyFields=cachedFieldValues.reduce((count,f)=>f.value?count+1:count,0);
     if(numberOfNotEmptyFields<0){
          return;
     }
     const key=cacheFields.cacheFields(cachedFieldValues);
     chromeExtensionUtil.sendKey(key);
   }

          return (
               <FormContainer title="Cached Values" domain={domain}>              
                  {cachedFieldValues.map((formField,index)=>(<DisplayInputCopyField 
                  field={formField} 
                  hideValue={true}
                  onCopied={onCopied}
                  key={formField.id}/>))}                                    
                  <TextButton onClick={gotoMobileIntegration} label={'Back'}/>   

               </FormContainer>
          );    
};

