import React, {useState} from 'react';
import EditPageControlConfiguration from './EditPageControlConfiguration';
import PageControlHome from './PageControlHome';
import ACTIONS from './ACTIONS';
import NoPageError from './NoPageError';
export default ({globalInputApp,domain,toMobileIntegrationHome}) => {
    const [action,setAction]=useState(ACTIONS.PAGE_CONTROL_HOME);
    const toPageControlHome=()=>{
        setAction(ACTIONS.PAGE_CONTROL_HOME);
    } 
    if(!domain){
        const props={globalInputApp,toMobileIntegrationHome};
        return (<NoPageError {...props}/>);
    }
    switch(action){        
        case ACTIONS.EDIT_APP_CONTROL_SETTINGS:{
            const props={globalInputApp,domain,toPageControlHome};
           return(<EditPageControlConfiguration {...props}/>);
        }        
        case ACTIONS.PAGE_CONTROL_HOME:{
            const props={globalInputApp,domain,setAction, toMobileIntegrationHome};
            return (<PageControlHome {...props}/>);
        }            
        default: return null;         
    }  
};

