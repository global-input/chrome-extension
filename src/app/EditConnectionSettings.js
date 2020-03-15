import React, {useState} from "react";

import {InputWithLabel,TextButton,MessageContainer,MessageLink,FormContainer,FormFooter} from './app-layout';

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
            <MessageContainer>
    The proxy url points to a WebSocket server that relays encrypted messages between your browser and your mobile app.
    The end-to-end encryption that uses a dynamically generated encryption key for each session ensures that only your mobile app and your browser extension can decrypt the messages.

    You may also install your own proxy server by downloading the source code from 
    <MessageLink href="https://github.com/global-input/global-input-node">GitHub</MessageLink>

</MessageContainer>

            
    </FormContainer>)
    
};

