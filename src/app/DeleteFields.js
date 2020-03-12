import React, {useState, useEffect } from "react";
import {FormContainer,CheckboxButton} from './app-layout';
import * as formUtil from './formUtil';

export default ({globalInputApp,toFormDataTransferHome,formFields,deleteFields})=>{  
    const [items,setItems]=useState(()=>createSelectableItems(formFields));    

    useEffect(()=>{        
        globalInputApp.setInitData(getInitData(items));    
    },[]);
    
    useEffect(()=>{
        const {field}=globalInputApp;
        if(!field){
            return;
        }
        switch(field.id){
            case fieldCancelDelete.id:
                toFormDataTransferHome();
                break;
            case fieldDeleteSelected.id:
                deleteFields(items);
                break;
            case fieldDeleteFields.id:
                const newItems=formUtil.updateSelection(items, field.value);
                setItems(newItems);
                break;
        }
    },[globalInputApp.field])
    const toggleSelect=item=>{
         const newItems=formUtil.toggleSelect(items,item);
         setItems(newItems);
         const values=formUtil.getSelectedValues(newItems);
         globalInputApp.setFieldValueById(fieldDeleteFields.id,values);
    };
    return (
        <FormContainer title="Deleting Fields">                                 
                {items.map(item=>(
                <CheckboxButton 
                    label={item.label} value={item.value} 
                    checked={item.selected} onChange={()=>toggleSelect(item)} 
                    key={item.value}/>)
                )}
        </FormContainer>
    )
};




const createSelectableItems =fields=>{        
        return fields.map(f=>{
            return {label:f.label, value:f.id, selected:false};            
        });

};




const fieldDeleteFields = {
    id:"fieldsToDelete",
    label:"Select",
    type:"list",                
    selectType:"multiple",
    value:null,
    items:[]
};
const fieldCancelDelete={
    id:"cancelDelete",
    label:"Cancel",
    type:"button",
    viewId:"row1"
};
const fieldDeleteSelected={
    id:"deleteSelected",
    label:"Delete",
    type:"button",
    viewId:"row1"
};
const getInitData =items=>{
    return {              
        action: "input",
        dataType: "form",
        form:{
            title:"Deleting Fields",
            fields:[{...fieldDeleteFields, items},
            fieldCancelDelete,fieldDeleteSelected]
        }
      };
}

