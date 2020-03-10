import React, {useEffect,useState} from 'react';
import {DisplayInputCopyField,TextButton,FormContainer,P} from './app-layout';

import * as pageControlUtil from './pageControlUtil'
import EditAppControlSettings from './EditAppControlSettings';
const fieldGoBack={
    id:'giaMobileIntegration',
    type:"button",
    label:"Back",
    viewId:"row1"
};
const fieldEditApplicationControl={
    id:'giaAppControlSettings',
    type:"button",
    label:"Edit Control Settings",
    viewId:"row1"
}

const ACTIONS={
    HOME:1,
    EDIT_APP_CONTROL_SETTINGS:2
}
export default ({globalInputApp,goBackToHome,domain}) => {
    const [action,setAction]=useState(ACTIONS.HOME);
    useEffect(()=>{        
        pageControlUtil.startPageControl({globalInputApp,domain,fieldGoBack,fieldEditApplicationControl})        
    },[]);
    
    const goHome=()=>{
        pageControlUtil.startPageControl({globalInputApp,domain,fieldGoBack,fieldEditApplicationControl});
        setAction(ACTIONS.HOME);
    }

    switch(action){        
        case ACTIONS.EDIT_APP_CONTROL_SETTINGS:
               return(<EditAppControlSettings globalInputApp={globalInputApp} goHome={goHome} domain={domain}/>);

        case ACTIONS.HOME:
        default:
                return (<HOME globalInputApp={globalInputApp} goBackToHome={goBackToHome} domain={domain} setAction={setAction}/>);
    

    }
    

    
    

};

const HOME=({globalInputApp,goBackToHome,setAction})=>{
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }        
        switch(field.id){
            case fieldGoBack.id:
                goBackToHome();
                break;
            case fieldEditApplicationControl.id:
                 setAction(ACTIONS.EDIT_APP_CONTROL_SETTINGS);
                break;
            default:            
        }
    },[globalInputApp.field])
    return (
    <FormContainer title="Mobile Input/Control On Page">
    <P>Please operate on your mobile</P>
    </FormContainer>
    );

}



