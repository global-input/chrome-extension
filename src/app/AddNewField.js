import React, {useState, useEffect } from "react";
import {InputWithLabel,FormContainer,RadioButton} from './app-layout';
import * as formUtil from './formUtil';

export default ({globalInputApp,toFormDataTransferHome,addNewField}) => {    
    
    
    const [label,setLabel]=useState('');
    const [multiLine,setMultiLine]=useState(fieldMultiLine.items[0].value);    
    
    const setFormLabel=label=>{
        setLabel(label);
        globalInputApp.setFieldValueById(fieldName.id,label);      
    };
    
    const onAddNewField=()=>{        
      if(!label.trim().length){
          return;
      }      
      addNewField(label,multiLine===fieldMultiLine.items[1].value);
    };
    
    useEffect(()=>{
        globalInputApp.setInitData(initData);    
  },[]);
  
  useEffect(()=>{
      const {field}=globalInputApp;
      if(!field){
          return;
      }
      switch(field.id){
            case fieldName.id:
                setLabel(field.value);
                break;

            case fieldMultiLine.id:
                const multiLineIndex=formUtil.getItemIndexByField(fieldMultiLine.items,field);                
                if(multiLineIndex>=0){                        
                            setMultiLine(fieldMultiLine.items[multiLineIndex].value);
                }                    
                    break;    
            
            case fieldCancel.id:
                toFormDataTransferHome();
                break;

            case fieldAddNew.id:
                onAddNewField();
                break;
      }
      
  },[globalInputApp.field]);

      return(
          <FormContainer title="Adding New Field">              
              Enter the name of the new field                          
              <InputWithLabel label="Name of the field" id="newFieldLabel"
                            onChange={setFormLabel}
                            value={label}/>              
            
            <RadioButton name="singleMultiLine" checked={multiLine===fieldMultiLine.items[0].value} label="Single-line" onChange={()=>{
                          setMultiLine(fieldMultiLine.items[0].value);
                          globalInputApp.setFieldValueById(fieldMultiLine.id,fieldMultiLine.items[0].value);                         
                          }}/>
            <RadioButton name="singleMultiLine" checked={multiLine===fieldMultiLine.items[1].value} label="Multi-line" onChange={()=>{
                          setMultiLine(fieldMultiLine.items[1].value);
                          globalInputApp.setFieldValueById(fieldMultiLine.id,fieldMultiLine.items[1].value);                         
            }}/>

              
          </FormContainer>            
      );
      
};


const fieldName={
    id:"nameOfNewField",
    type:"text",
    value:""
};

const fieldMultiLine={
    id:"multiLines",
    label:"Type",
    type:"list",
    selectType:"single",
    value:'single-line',
    items:[
        {value:"single-line", label:"Single-line"},
        {value:"multi-line", label:"Multi-line"}                            
    ]
};

const fieldCancel={
    id:"cancelAdd",
    label:"Cancel",
    type:"button",
    viewId:"row1"               
};

const fieldAddNew={
    id:"addNew",
    label:"Add",
    type:"button",
    viewId:"row1"               
};




const initData={
            action: "input",
            dataType: "form",
            form:{
                title:"Adding New Field",
                fields:[fieldName,fieldMultiLine,fieldCancel,fieldAddNew]
            }
};


