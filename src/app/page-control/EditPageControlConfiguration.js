import React, {useState, useEffect, useRef} from "react";

import {InputWithLabel,TextButton,MessageContainer,MessageLink,FormContainer,FormFooter} from '../app-layout';
import * as pageControlUtil from './pageControlUtil';
import SelectExample from './SelectExample';
export default ({globalInputApp,domain,toPageControlHome})=>{
    const [data,setData]=useState(()=>pageControlUtil.getDataItemForEdit(domain));    
    const onSave=()=>{
        if(data.type==='modified' || data.type==='new'){                        
            try{  
                if(data.content){
                    const userAppControl=JSON.parse(data.content);
                    pageControlUtil.saveUserPageControlConfig(userAppControl, domain);
                }
                else{
                    pageControlUtil.removeUserPageControlConfig(domain);
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
            case fields.cancel.id:
                toPageControlHome();
                break;
            case fields.save.id:
                onSave();
                break;
            case fields.edit.id:
                setData({type:'modified',content:field.value});                

        }
    },[globalInputApp.field]);
    
    const onChangeData=data=>{
        setData(data);
        globalInputApp.setFieldValueById(fields.edit.id,data.content);           
     }    
    return (<FormContainer title="Page Control Configuration">
            
            <InputWithLabel label="Configuration" id="config"
                            onChange={content=>{
                                onChangeData({type:'modified',content});
                            }}
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
            </MessageContainer>

             <SelectExample data={data} onChangeData={onChangeData}/>
          
    </FormContainer>)
    
};

const fields={
     domain:{
        type:'info',
        value:'',
        
    },    
    edit:{
        id:'editor',
        type:'text',
        nLines:5,
        value:'',
        viewId:"row3" 
    },
    cancel:{
        id:"cancelEdit",
        type:"button",
        label:"Cancel",
        viewId:"row4"
   },   
   save:{
        id:"saveEdit",
        type:"button",
        label:"Save",
        viewId:"row4" 
   },
   description:{
    type:'info',
    value:'It is more convenient to edit the configuration on your computer.',
    viewId:"row5"         
},
};

const getHelpText=(data)=>{
    if(data.type==='new'){
        return "An example configuration in loaded into the text box above. You may load a different example by selecting from selection below. Then, please modify it to match the HTML elements in the page load on the active tab.";
    }
    else{
     return "The configuration identifies HTML elements in the page that your mobile app can control. ";     
    }
};
const buildInitData = (domain,data)=>{    
    const domainField={...fields.domain,value:domain};        
    const edit={...fields.edit,value:data.content};
    
     return {
          action: "input",
          dataType: "form",
          form: {              
          title:'Page Control Configuration',          
          fields:[domainField,edit,fields.cancel,fields.save,fields.description]
         }
      };    
};





