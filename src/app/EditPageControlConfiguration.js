import React, {useState, useEffect, useRef} from "react";

import {InputWithLabel,TextButton,MessageContainer,MessageLink,FormContainer,FormFooter} from './app-layout';
import * as pageControlUtil from './pageControlUtil';
import defaultApplicationConfig from './application-control/default.json';
export default ({globalInputApp,domain,toPageControlHome})=>{
    const [data,setData]=useState(()=>getDataForEdit(domain));    
    const onSave=()=>{
        if(data.type==='modified' || data.type==='new'){                        
            try{  
                if(data.content){
                    const userAppControl=JSON.parse(data.content);
                    pageControlUtil.saveUserApplicationControlConfig(userAppControl, domain);
                }
                else{
                    pageControlUtil.removeUserApplicationControlConfig(domain);
                }
                
                toPageControlHome();                            
            }
            catch(error){
                console.error(error+":"+error.stack);
            }                                    
        }
        else{
            toPageControlHome();                             
        }

    };
    useEffect(()=>{
        globalInputApp.setInitData(buildInitData(domain,data));
    },[]);
    useEffect(()=>{
        const {field}=globalInputApp;        
        if(!field){
            return;
        }
        switch(field.id){
            case fieldCancel.id:
                toPageControlHome();
                break;
            case fieldSave.id:
                onSave();
                break;
            case fieldEdit.id:
                setData({type:'modified',content:field.value});                

        }
    },[globalInputApp.field]);
    const setConfig=content=>{
            setData({type:'modified',content}); 
            globalInputApp.setFieldValueById(fieldEdit.id,content);           
    };
    
    return (<FormContainer title="Page Control Configuration">
            
            <InputWithLabel label="Configuration" id="config"
                            onChange={setConfig}
                            type="textarea"
                            value={data.content}/>  
            <FormFooter>
            <TextButton onClick={()=>{                
                toPageControlHome()
            }
            } label='Cancel'/>
            <TextButton onClick={onSave} label='Save'/>

            </FormFooter>   
<MessageContainer>
{getHelpText(data)}
The extension is already preloaded with <MessageLink href="https://github.com/global-input/chrome-extension/blob/master/src/app/application-control/configs.json"> configurations for some common websites.</MessageLink>   
</MessageContainer>
          
    </FormContainer>)
    
};

const fieldCancel={
     id:"cancelEdit",
     type:"button",
     label:"Cancel",
     viewId:"row1"
};

const fieldSave={
     id:"saveEdit",
     type:"button",
     label:"Save",
     viewId:"row1" 
};
const fieldEdit={
    id:'editor',
    type:'text',
    nLines:5,
    value:''
}

const getHelpText=(data)=>{
    if(data.type==='new'){
        return "Please modify the example configuration in the text box above to match the HTML elements in the page.";
    }
    else{
     return "The configuration identifies HTML elements in the page that your mobile app can control.";     
    }
};
const buildInitData = (domain,data)=>{    
    fieldEdit.value=data.content;
    let message=[getHelpText(data),"You may also edit the configuration on your computer."];    
    const fieldInfo={
        type:'info',
        value:message
    };
    const fieldDomainInfo={
        type:'info',
        value:domain
    }

     return {
          action: "input",
          dataType: "form",
          form: {              
          title:'Page Control Configuration',          
          fields:[fieldDomainInfo,fieldCancel,fieldSave,fieldEdit,fieldInfo]
         }
      };    
};


const getDataForEdit = domain=>{
    const userAppControlSettings = pageControlUtil.getUserApplicationControlConfig(domain);
    if(userAppControlSettings){
        return {
                type:'user',
                content:JSON.stringify(userAppControlSettings,null,2)
        };
    };
    const embeddedAppControlSettings=pageControlUtil.getEmbeddedApplicationControlConfig(domain);
    if(embeddedAppControlSettings){
        return {
            type:'embedded',
            content:JSON.stringify(embeddedAppControlSettings,null,2)
        };
    }
    return {
            type:'new',
            content:JSON.stringify(defaultApplicationConfig,null,2)
    };    
}


