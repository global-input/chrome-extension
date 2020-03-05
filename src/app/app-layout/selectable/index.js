import React from 'react'; 
export const SelectionContainer=({children})=>{
    return (
    <div style={styles.multiline.container}>
            {children}
    </div>  
    );
};
export const RadioButton=({name,checked,onChange,label})=>{
    return(
        <div style={styles.multiline.item}>
            <input type="radio" name={name} checked={checked} onChange={onChange}/>
            <span style={styles.multiline.text}>{label}</span>
            </div>);        
          
};
export const CheckboxButton=({name,checked,onChange,label})=>{
    return(
        <div style={styles.multiline.item}>
            <input type="checkbox" name={name} checked={checked} onChange={onChange}/>
            <span style={styles.multiline.text}>{label}</span>
            </div>);        
          
};



const styles={
    multiline:{
            container:{
                marginTop:"10",
                display:"flex",
                flexDirection:"column",
                width:"100%",                
                padding:"2vw",
                alignItems:"flex-start",
                

            },
            item:{
                display:"flex",
                flexDirection:"row",
                display:"flex",
                flexDirection:"row",
                justifyContent:"flex-start",
                alignItems:"center"
            },
            text:{
                paddingLeft:10,

            }
    }
};
