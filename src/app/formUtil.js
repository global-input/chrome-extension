const getFormFieldsPrefix= hostname => {
    const formprefix="extension."+hostname?hostname:'default';
    return formprefix+".forms.fields";
};

export const getSavedFormFields= hostname => {
    var fieldString=localStorage.getItem(getFormFieldsPrefix(hostname));
    if(!fieldString){
        return null;
    }            
    try{
            const fields=JSON.parse(fieldString);
            if(fields && fields.length>0){
                return fields;   
            }            
    }
    catch(error){
              console.error(error);
    }
    return null;
};


export const updateFields= (formFields,fieldsId, value)=>{
    return formFields.map(f=>{
        if(f.id===fieldsId){
            return {...f,value:value};
        }
        else{
            return f;
        }
     });  
};


export const toggleOption=(options, value)=>{    
    return value===options[0].value?options[1]:options[0];
};


export const getItemIndexByField=(items,field)=>{            
    if(!field.value || (!field.value.length)){
        return -1;                
    }    
    for(let [index,item] of items.entries()){
        if(item.value===field.value[0]){
            return index;
        }
    }
    return -1;
}; 



export const createNewFormNewField = ({formFields,label, multiLine}) => {
    let newLabel=label.trim();
    if(!newLabel){
        return formFields;
    }
    const nLines=multiLine?5:1;
    const id=newLabel.replace(' ',"_").toLowerCase();
    for(let f of formFields){
        if(f.id===id){
            return formFields;
        }
    }
    return [...formFields,{id,label:newLabel,value:'',nLines}];    
};