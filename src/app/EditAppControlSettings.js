import React, {useState, useEffect, useRef} from "react";

import {InputWithLabel,TextButton,P,FormContainer,FormFooter} from './app-layout';
import * as pageControlUtil from './pageControlUtil';

export default ({globalInputApp,domain,toPageControlHome})=>{
    const [data,setData]=useState(getDataForEdit);
    const onSave=()=>{
        if(data.type==='modified'){
            const pageControlConfig=JSON.parse(data.content);
            if(pageControlConfig){
                pageControlUtil.updateCustomApplicationControlConfig(pageControlConfig, domain);                
                toPageControlHome();                
            }                        
            
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
    
    return (<FormContainer title="Application Control Settings">
            
            <InputWithLabel label="Control Config" id="config"
                            onChange={setConfig}
                            type="textarea"
                            value={data.content}/>  
            <FormFooter>
            <TextButton onClick={()=>{
                console.log("calling ********go Home-------");
                toPageControlHome()
            }
            } label='Cancel'/>
            <TextButton onClick={()=>onSave()} label='Save'/>

            </FormFooter>            
            
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

const buildInitData = (domain,data)=>{    
    fieldEdit.value=data.content;

     return {
          action: "input",
          dataType: "form",
          form: {              
          title:'Application Control Settings',          
          fields:[fieldCancel,fieldSave,fieldEdit]
         }
      };    
};


const getDataForEdit = domain=>{
    const {type,applicationConfigs} = pageControlUtil.getApplicationControlSettings(domain);
    const content=JSON.stringify(applicationConfigs,null, ' ');
    return {
      type, content
    }
    
}


