import React, {useState, useEffect } from "react";


import * as formUtil from './formUtil';
import {DisplayInputCopyField,TextButton,FormContainer} from './app-layout';
import AddNewField from './AddNewField';
import DeleteFields  from './DeleteFields';


const ACTIONS={
     HOME:'transfer_home', 
     ADD_NEW_FIELD:'add_new_field',
     DELETE_FIELDS:'delete_fields'     
 };
export default ({globalInputApp, hostname,goBackToHome})=>{
     const [action, setAction]=useState(ACTIONS.HOME);
     const [visibility, setVisibility]=useState(fieldVisibilityControl.options[0]); 
    const [formFields,setFormFields]=useState(getFormFields(hostname));

    const gotoAddField=()=>{
         setAction(ACTIONS.ADD_NEW_FIELD);
    };
    const gotDeleteFileds=()=>{
     setAction(ACTIONS.DELETE_FIELDS);
    };
    const gotoHome= (fields=formFields)=>{
          setAction(ACTIONS.HOME);
          globalInputApp.setInitData(buildInitData(fields));
    }
    const addNewField=(label,multiLine)=>{          
          const newFields=formUtil.createNewFormNewField({formFields,label, multiLine});
          onFormFieldsModified(newFields)
    }
    const deleteFields=items=>{
     const newFields=formUtil.deleteSelectedFields(formFields,items);                
     onFormFieldsModified(newFields);
    };
    const onFormFieldsModified=newFields=>{
          setFormFields(newFields);     
          if(newFields.length){
               gotoHome(newFields);             
          }
          else{
               gotoAddField();
          }
    }
    useEffect(()=>{
          gotoHome();
    },[]);
    useEffect(()=>{
         const {field}=globalInputApp;
          if(!field){
               return;
          }
          switch(field.id){
               case backToHomeControl.id:
                    goBackToHome();
                    break;
               case fieldVisibilityControl.id:
                    onToggleShowHide();
                    break;
               case  addNewFieldControl.id:
                    gotoAddField(); 
                    break;
               case deleteFieldsControl.id:
                    gotDeleteFileds();
                    break;
               default:
                    setFormFields(formUtil.updateFields(formFields,field.id, field.value));
          }             
          
    },[globalInputApp.field]);

    const onFieldChanged=(formField,value) => {
          setFormFields(formUtil.updateFields(formFields,formField.id, value));
          globalInputApp.setFieldValueById(formField.id,value);
          
    };
const onToggleShowHide=()=>{
     const nextVisibility=formUtil.toggleOption(fieldVisibilityControl.options,visibility.value);                
     setVisibility(nextVisibility);
     globalInputApp.setFieldValueById(fieldVisibilityControl.id,nextVisibility.value);
}

switch(action){
     case ACTIONS.HOME:
          return (
               <FormContainer title="Form Data Transfer">              
                     {formFields.map((formField,index)=>(<DisplayInputCopyField 
                  field={formField} 
                  key={formField.id} 
                  hideValue={visibility.value===0} onChange={value=>onFieldChanged(formField,value)}/>))}
                  <TextButton onClick={onToggleShowHide} label={visibility.label}/>
               </FormContainer>
          );
     case ACTIONS.ADD_NEW_FIELD:
          return (<AddNewField globalInputApp={globalInputApp} gotoHome={gotoHome} addNewField={addNewField}/>);
     
     case ACTIONS.DELETE_FIELDS:
               return (<DeleteFields globalInputApp={globalInputApp} gotoHome={gotoHome} formFields={formFields} deleteFields={deleteFields}/>);
                              
  }
    
};




const addNewFieldControl={
     id:"addNewField",
     type:"button",
     label:"Add New Field",
     viewId:"row1"
};

const deleteFieldsControl={
     id:"deleteFields",
     type:"button",
     label:"Delete Fields",
     viewId:"row1" 
};
const backToHomeControl={
     id:"backToHome",
     type:"button",
     icon:"back",
     label:"Back",
     viewId:"row2"
};
const fieldVisibilityControl={
     id:"fieldValueVisibility",
     type:'button',  
     viewId: "row2",            
     options: [{ value: 0, label: 'Show' }, { value: 1, label: 'Hide'}],        
     value:0
};

const defaultFormFields=[{
               id: "username",
               label: "Username", 
               value:''
          },{
               id:"password",
               label:"Password", 
               value:''
          },{
          id:"note",
          label:"Note",
          nLines:5, value:'',
}];

const getFormFields =hostname=>{
     const formFields=formUtil.getSavedFormFields(hostname);         
     if(formFields){
          return  formFields;
     }
     return defaultFormFields;  
}

const buildInitData = formFields=>{

     return {
          action: "input",
          dataType: "form",
          form: {    
          id:"###username###@general",
          title:"Transfer Form Data",
          label:"general",
          fields:[addNewFieldControl,
                  deleteFieldsControl,
                  backToHomeControl,
                  fieldVisibilityControl,
                  ...formFields]
         }
      };     
}


