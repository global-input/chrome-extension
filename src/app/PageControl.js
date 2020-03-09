import React, {useEffect} from 'react';
import {DisplayInputCopyField,TextButton,FormContainer,P} from './app-layout';

import * as pageControlUtil from './pageControlUtil'

const fieldGoBack={
    id:'goBackToTransfer',
    type:"button",
    label:"Back"
};

export default ({globalInputApp,goBackToHome,domain}) => {
    
    useEffect(()=>{        
        pageControlUtil.startPageControl({globalInputApp,domain,fieldGoBack})        
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



