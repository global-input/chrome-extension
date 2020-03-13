import React, {useEffect } from "react";

import * as chromeExtensionUtil from './chromeExtensionUtil'
import * as cacheFields from './cacheFields';

import {DisplayInputCopyField,TextButton,FormContainer} from './app-layout';

export default ({toMobileIntegration,cachedFieldValues, domain})=>{          
   
   useEffect(()=>()=>cacheFields.clearFields(domain),[]); 
   
   const onCopied=()=>{                       
      const key=cacheFields.cacheIfMultipleFields(domain,cacheFields);
      if(key){
              chromeExtensionUtil.sendKey(key);
      }     
   };    
   return (
               <FormContainer title="Cached Values" domain={domain}>              
                  {cachedFieldValues.map(formField=>(<DisplayInputCopyField 
                  field={formField} 
                  hideValue={true}
                  onCopied={onCopied}
                  key={formField.id}/>))}                                    
                  <TextButton onClick={toMobileIntegration} label={'Back'}/>   

               </FormContainer>
   );    
};

