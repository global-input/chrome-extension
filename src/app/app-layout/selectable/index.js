import React from 'react';
export const SelectionContainer = ({ children }) => {
    return (
        <div style={styles.multiline.container}>
            {children}
        </div>
    );
};
export const RadioButton = ({ name, checked, onChange, label }) => {
    return (
        <div style={styles.multiline.item}>
            <input type="radio" name={name} checked={checked} onChange={onChange} />
            <span style={styles.multiline.text}>{label}</span>
        </div>);

};
export const CheckboxButton = ({ name, checked, onChange, label }) => {
    return (
        <div style={styles.multiline.item}>
            <input type="checkbox" name={name} checked={checked} onChange={onChange} />
            <span style={styles.multiline.text}>{label}</span>
        </div>);

};

export const SelectItems = ({ id, label, value,items,onChange }) => {
    return (
        <div style={styles.select.container}>
        <label htmlFor={id} style={styles.select.label}>{label}</label>
        <select id={id} onChange={onChange} value={value} style={styles.select.select}>
            {items.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
        </select>
        </div>
   );
}



const styles = {
    multiline: {
        container: {
            marginTop: "10",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            padding: "2vw",
            alignItems: "flex-start",


        },
        item: {
            display: "flex",
            flexDirection: "row",                        
            justifyContent: "flex-start",
            alignItems: "center"
        },
        text: {
            paddingLeft: 10,

        }
    },
    select:{
        container:{            
            display: "flex",
            flexDirection: "row",            
            justifyContent: "flex-start",
            alignItems: "flex-end",
            fontSize:14,
            color:"#5291CD",
        },
        label:{
            fontSize:12,
            color:"#5291CD",          
            marginRight:5,
            whiteSpace: 'nowrap'
        },
        select:{
            color:"#5291CD",          
            fontSize:14,
            border:"1px solid #888888",

        }
    }
};
