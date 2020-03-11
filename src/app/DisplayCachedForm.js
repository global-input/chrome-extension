import React, {useState, useEffect } from "react";


import * as formUtil from './formUtil';
import * as cacheFields from './cacheFields';
import {DisplayInputCopyField,TextButton,FormContainer} from './app-layout';

export default ({gotoMobileIntegration,cachedFieldValues, domain})=>{          
   useEffect(()=>{   
      
      return()=>{
         cacheFields.clearFields();               
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

