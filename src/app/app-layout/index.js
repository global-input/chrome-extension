import React from "react";
import InputWithCopy from './input-with-copy';
import InputWithLabel from './input-with-label';
import TextButton from './text-button';
import {SelectionContainer, RadioButton,CheckboxButton} from './selectable';
import styles from './styles';

export {SelectionContainer, RadioButton,CheckboxButton};

export {TextButton,InputWithLabel};



export const AppTitle=({children})=>{
    return (<div style={styles.title}>{children}</div>);
};


export const AppContainer = ({globalInputApp,children})=>{    
    const {connectionMessage, WhenConnected,WhenWaiting, WhenDisconnected}=globalInputApp;  
    return (
        <div style={styles.appContainer}>                                
            <WhenWaiting>
                <AppTitle>Global Input App</AppTitle> 
                <div style={styles.connectionMessage}>
                        {connectionMessage}                
                </div>
            </WhenWaiting>                   
                
            <WhenDisconnected>
                <AppTitle>Global Input App</AppTitle>
                <P>Mobile Disconnected</P>                                
            </WhenDisconnected>
            <WhenConnected>
                {children}
            </WhenConnected>
        </div>
    );
};

export const P=({children})=>(<div style={styles.paragraph}>{children}</div>);




export const MessageContainer = ({children,title})=>{

    return (<div style={styles.message.container}>
                <AppTitle>{title}</AppTitle>
                <div style={styles.message.text}>
                        {children}
                </div>
                
        
        </div>);

};


export const FormContainer = ({children,domain,title})=>{

    return (<div style={styles.form.container}>
                <AppTitle>{title}</AppTitle>
                <div>{domain}</div>
                <div style={styles.form.fields}>
                        {children}
                </div>
                
        
        </div>);

};


export const DisplayInputCopyField = ({field,hideValue,onChange,onToggleSelection})=>{
    var fieldType="text";
    if(field.nLines && field.nLines>1){
        fieldType="textarea";
    }          
    if(hideValue){
      fieldType="password";
    }
    let value=field.value;
    if(!value){
         value='';
    }
    return(       
        <InputWithCopy label={field.label} id={field.id} type={fieldType}
           value={value}  onSelected={onToggleSelection} secret={true}
           onChange={onChange}/>    
      );
};





