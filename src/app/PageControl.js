import React, {useEffect} from 'react';
import {DisplayInputCopyField,TextButton,FormContainer,P} from './app-layout';

import * as pageControlUtil from './pageControlUtil'

export default ({globalInputApp,goBackToHome,domain}) => {

    const processPageControlConfig = async () => {
        try{
        const message= await pageControlUtil.getPageControlConfig(domain);
        console.log("********::::message:"+JSON.stringify(message));
        }
        catch(error){
            console.error(error+":::"+error.stack);
        }
    }
    useEffect(()=>{        
        globalInputApp.setInitData(getInitData(domain));    
        processPageControlConfig();
    },[]);

    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
            case fieldGoBack.id:
                goBackToHome();
                break;
            default:            
        }
    },[globalInputApp.field])
    
    return (<FormContainer title="Page Control">
        <P>Page....</P>
    </FormContainer>)

};
const fieldGoBack={
    id:'goBackToTransfer',
    type:"button",
    label:"Back"}

const getInitData=domain=>{
    const initData={
         action: "input",
         dataType: "form",
         form: {    
              title:"Page Control",
              fields:[fieldGoBack]
         }   
    };    
    return initData;

}


