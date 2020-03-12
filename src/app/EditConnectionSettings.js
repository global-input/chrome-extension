import React, {useState, useEffect, useRef} from "react";

import {InputWithLabel,TextButton,P,FormContainer,FormFooter} from './app-layout';

import * as appSettings from './appSettings';

export default ({toMobileIntegration})=>{
    const [settings,setSettings]=useState(()=>appSettings.getGlobalInputSettings());
    const onSave=()=>{
        appSettings.saveSettings(settings);
        toMobileIntegration();
    };    
    const setURL=url=>{
        setSettings({...settings,url});        
    };
    const setApikey=apikey=>{
        setSettings({...settings,apikey});        
    };
    
    return (<FormContainer title="Connection Settings">
            
                <InputWithLabel label="Proxy URL" id="url"
                                onChange={setURL}                            
                                value={settings.url}/>  
                <InputWithLabel label="API Key" id="apikey"
                                onChange={setApikey}                            
                                value={settings.apikey}/>                  
                <FormFooter>
                <TextButton onClick={toMobileIntegration} label='Cancel'/>
                <TextButton onClick={onSave} label='Save'/>

            </FormFooter>            
            
    </FormContainer>)
    
};

