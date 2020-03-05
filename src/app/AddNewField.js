import React, {useState, useEffect } from "react";
import {InputWithLabel,FormContainer,P,RadioButton} from './app-layout';
import * as formUtil from './formUtil';

export default ({globalInputApp,gotoHome,addNewField}) => {    
    
    const [label,setLabel]=useState('');
    const [multiLine,setMultiLine]=useState(fieldMultiLine.items[0]);    
    
    const setFormLabel=label=>{
        setLabel(label);
        globalInputApp.setFieldValueById(fieldName.id,label);      
    };
    
    const onAddNewField=()=>{        
      if(!label.trim().length){
          return;
      }

      addNewField(label,multiLine.value===fieldMultiLine.items[1].value);
    }
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
                if(multiLineIndex===0){                        
                            setMultiLine(false);
                    }
                    else if(multiLineIndex===1){
                            setMultiLine(true);            
                    }
                    break;    
            
            case fieldCancel.id:
                gotoHome();
                break;

            case fieldAddNew.id:
                onAddNewField();
                break;
      }
  },[globalInputApp.field]);

      return(
          <FormContainer title="Adding New Field">              
              <P>Enter the name of the new field </P>                            
              <InputWithLabel label="Name of the field" id="newFieldLabel"
                            onChange={setFormLabel}
                            value={label}/>              
            
            <RadioButton name="singleMultiLine" checked={!multiLine} label="Single-line" onChange={()=>{
                          setMultiLine(false);
                          globalInputApp.setFieldValueById(fieldMultiLine.id,fieldMultiLine.items[0].value);                         
                          }}/>
            <RadioButton name="singleMultiLine" checked={multiLine} label="Multi-line" onChange={()=>{
                          setMultiLine(true);
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


