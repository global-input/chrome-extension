import React, {useState, useEffect, useRef} from "react";


import * as formUtil from './formUtil';
import * as cacheFields from './cacheFields';
import * as chromeExtensionUtil from '../chromeExtensionUtil';
import {DisplayInputCopyField,TextButton,FormContainer} from '../app-layout';
import AddNewField from './AddNewField';
import DeleteFields  from './DeleteFields';



export default ({globalInputApp, domain,toMobileIntegrationHome})=>{
     const [action, setAction]=useState(ACTIONS.FORM_DATA_TRANSFER_HOME);
     const [visibility, setVisibility]=useState(fieldVisibilityControl.options[0]); 
     const [formFields,setFormFields]=useState(()=>getFormFields(domain));
      
     const toFormDataTransferHome= (fields=formFields)=>{
               setAction(ACTIONS.FORM_DATA_TRANSFER_HOME);
               globalInputApp.setInitData(buildInitData(fields,domain));
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
               toFormDataTransferHome(newFields); 
               formUtil.saveFormFields(domain, newFields);            
          }
          else{
               setAction(ACTIONS.ADD_NEW_FIELD);
          }
      };    
     const onToggleShowHide=()=>{
          const nextVisibility = formUtil.toggleOption(fieldVisibilityControl.options,visibility.value);                
          setVisibility(nextVisibility);
          globalInputApp.setFieldValueById(fieldVisibilityControl.id,nextVisibility.value);
     };

     const toAddField=()=>{
          setAction(ACTIONS.ADD_NEW_FIELD);
     };   

     const toDeleteFields=()=>{
          setAction(ACTIONS.DELETE_FIELDS);
     };  
     const onFieldChanged=(fieldId,value) => {
          setFormFields(formUtil.updateFields(formFields,fieldId, value));          
     };
     const onCopied=()=>{                       
          const key=cacheFields.cacheIfMultipleFields(domain,formFields);
          if(key){
               chromeExtensionUtil.sendKey(key);
          }     
      };

      useEffect(()=>{          
          globalInputApp.setInitData(buildInitData(formFields,domain));
          return()=>{
               cacheFields.clearFields();               
          }
      },[]);    
     useEffect(()=>{
          const {field}=globalInputApp;
          if(!field || action !== ACTIONS.FORM_DATA_TRANSFER_HOME){
                    return;
          }
          switch(field.id){
                    case backToHomeControl.id:
                         toMobileIntegrationHome();
                         break;
                    case fieldVisibilityControl.id:
                         onToggleShowHide();
                         break;
                    case  addNewFieldControl.id:
                         toAddField(); 
                         break;
                    case deleteFieldsControl.id:
                         toDeleteFields();
                         break;
                    default:                    
                         const matchedFields=formFields.filter(f=>f.id===field.id);
                         if(matchedFields.length){
                              onFieldChanged(field.id,field.value);                         
                         }
               }             
      
     },[globalInputApp.field]);


  switch(action){
     case ACTIONS.FORM_DATA_TRANSFER_HOME:
          return(
               <FormContainer title="Form Data Transfer" domain={domain}>              
                               {formFields.map(formField=>(<DisplayInputCopyField 
                            field={formField} 
                            key={formField.id} 
                            onCopied={onCopied}
                            hideValue={visibility.value===0} onChange={value=>{
                                 onFieldChanged(formField.id,value);
                                 globalInputApp.setFieldValueById(formField.id,value);
                              }
                              }/>))}
                            <TextButton onClick={onToggleShowHide} label={visibility.label}/>
                         </FormContainer>
                );
     case ACTIONS.ADD_NEW_FIELD:
          return (<AddNewField globalInputApp={globalInputApp} toFormDataTransferHome={toFormDataTransferHome} addNewField={addNewField}/>);
     
     case ACTIONS.DELETE_FIELDS:
          return (<DeleteFields globalInputApp={globalInputApp} toFormDataTransferHome={toFormDataTransferHome} formFields={formFields} deleteFields={deleteFields}/>);                              
    }
    
};


const ACTIONS={
     FORM_DATA_TRANSFER_HOME:'form_data_transfer_home', 
     ADD_NEW_FIELD:'add_new_field',
     DELETE_FIELDS:'delete_fields'     
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

const getFormFields =domain=>{
     const formFields=formUtil.loadSavedFormFields(domain);         
     if(formFields){
          return  formFields;
     }
     return defaultFormFields;  
}

const buildInitData = (formFields,domain)=>{
     const idField= ()=>formFields.length?'###'+formFields[0].id+'###':'credential';
     const formId=idField()+'@'+domain;          
     return {
          action: "input",
          dataType: "form",
          form: {    
          id:formId,
          title:domain,
          label:"web",
          domain,
          fields:[addNewFieldControl,
                  deleteFieldsControl,
                  backToHomeControl,
                  fieldVisibilityControl,
                  ...formFields]
         }
      };     
}


