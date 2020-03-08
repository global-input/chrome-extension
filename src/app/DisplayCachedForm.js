import React, {useState, useEffect } from "react";


import * as formUtil from './formUtil';
import * as chromeExtensionUtil from './chromeExtensionUtil'
import {DisplayInputCopyField,TextButton,FormContainer} from './app-layout';

export default ({goBackToHome,formFields, domain})=>{          
          return (
               <FormContainer title="Cached Values" domain={domain}>              
                  {formFields.map((formField,index)=>(<DisplayInputCopyField 
                  field={formField} 
                  key={formField.id}/>))}                                    
                  <TextButton onClick={goBackToHome} label={'Back'}/>   

               </FormContainer>
          );    
};

