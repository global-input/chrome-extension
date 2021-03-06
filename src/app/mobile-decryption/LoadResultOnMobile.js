import React, {useEffect, useState} from 'react';
import {InputWithCopy,TextButton,FormContainer} from '../app-layout';



const fields={
    content:{                
        id:   "decryptedContent",
        label :"Decrypted Content",
        type: 'text', 
        nLines:5,   
        value:''
    },

    finish:{
        id:"finish",
        label:"Finish",            
        type:"button"                        
    },
    info:{            
        type:"info",
        value:'You may select the field by pressing the checkbox above to make the "Copy" button appear that you can press to copy the content into your clipboard'
    },
}
const initData=value=>{
    const fContent={...fields.content,value};    
    return{        
        action:"input",
        dataType:"form",        
        form:{
            title:"Decrypted Content",
            fields:[fContent,fields.finish,fields.info]
        }
     }
}

export default ({globalInputApp,
    toMobileIntegrationHome,decryptedContent})=>{
    useEffect(()=>{
        globalInputApp.setInitData(initData(decryptedContent));          
    },[]);
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
            case fields.finish.id:
                toMobileIntegrationHome();
                break;                
        }
  },[globalInputApp.field]);

    return(
        <FormContainer title="Mobile Encryption">

                       <InputWithCopy id="encryptedContent" readOnly={true}
                           label="Decrypted Content"
                           type={"textarea"}
                           value={decryptedContent}/>
            <TextButton onClick={()=>{                
                            toMobileIntegrationHome()
                            }
            } label='Finsih'/>
        </FormContainer>
     );



}