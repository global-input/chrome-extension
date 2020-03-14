import React, {useEffect, useState} from 'react';

import {InputWithCopy,TextButton,MessageContainer,FormContainer} from '../app-layout';

import ACTIONS from './ACTIONS';

import EncryptedContentHelp from './EncryptedContentHelp';
const fields={
    content:{                
        id:   "content",
        label :"Content",
        type: 'encrypt',    
        value:''
    },
    info:{            
        type:"info",
        value:'Please operate on your computer (in the browser extension window) to copy the encrypted content into your clipboard. You can do so by pressing the "Copy" button there.'
    },
    loadOnMobile:{
        id:"loadIntoMobile",
        label:"Load Into Mobile",
        type:"button",            
        viewId:"row1"
    },
    finish:{
        id:"finish",
        label:"Finish",            
        type:"button",
        viewId:"row1"                       
    },
};

const defaultEncryptionKeyName="general";
const initData= value=> {
    const fContent={...fields.content,value};    
    return{        
        action:"input",
        dataType:"form",
        key:defaultEncryptionKeyName,
        form:{
            title:"Content Encryption",
            fields:[fContent,fields.info,fields.loadOnMobile,fields.finish]
        }
     };
};


export default ({setAction,content,globalInputApp,encryptedContent, setEncryptedContent,toMobileIntegrationHome})=>{
    useEffect(()=>{          
        globalInputApp.setInitData(initData(content));          
  },[]);
  useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
                case fields.loadOnMobile.id:                    
                    setAction(ACTIONS.LOAD_RESULT_ON_MOBILE);
                    break;
                
                case fields.finish.id:                    
                    toMobileIntegrationHome();
                    break;

                case fields.content.id:                    
                    setEncryptedContent(field.value);                    
                    break;                          
        }
  },[globalInputApp.field]);
  
  if(encryptedContent){
      return(
         <FormContainer title="Encrypted Content">

                        <InputWithCopy id="encryptedContent" readOnly={true}
                            label="Encrypted Content"
                            type={"textarea"}
                            value={encryptedContent}/>
                        <TextButton onClick={()=>{                
                            toMobileIntegrationHome()
                            }
            } label='Finsih'/>  
            <EncryptedContentHelp/>
         </FormContainer>
      );

  }
  else{
    return(<MessageContainer title="Encrypting Content">
    Please follow the instruction on your mobile to encrypt the content. 
    On your mobile, you can press the "Show" button to view the content it has received.
    Select the encryption key that you would like to use with the encryption. You can create and manage keys within the mobile app.
    If you have multiple encryption keys, the key with the name "{defaultEncryptionKeyName}" will be selected automatically. 
    Finally, press the "Encrypt" button there to encrypt the content.

  </MessageContainer>);
  }    
};