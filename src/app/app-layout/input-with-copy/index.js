import React, {useState,useRef,useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import InputWithLabel from "../input-with-label";


const stopTimer=timerHandler=>{
  if(timerHandler.current){
    clearTimeout(timerHandler.current);
    timerHandler.current=null;
  }
}
export default ({id,type,label,readOnly,onChange,help,value, onCopied})=>{
      const [message,setMessage]=useState('');
      const timerHandler=useRef(null);      
      useEffect(()=>{
            return ()=>{
              stopTimer(timerHandler);
            }
      },[]);

      

      const onCopy=evt=>{        
        navigator.clipboard.writeText(value);
        if(onCopied){
            onCopied();            
        }
        setMessage(`"${label}" is copied into your clipboard`);        
        stopTimer(timerHandler);
        timerHandler.current=setTimeout(()=>{
            setMessage(null);
        },2000);

      };

      const renderMessage=()=>{
        if(styles.message){
          return (<div style={styles.message}>
                {message}
          </div>);
        }
        else{
          return null;
        }
        
      }
      const props={id,type,label,readOnly,onChange,help,value};
      const disabled=!!message;
      const buttonStyle=disabled?styles.button.disabled:styles.button.enabled;

      return(
          <div style={styles.content}>
           <div style={styles.row}>
                    <InputWithLabel {...props}/>
                    <button disabled={disabled} style={buttonStyle} onClick={onCopy}>Copy</button>
          </div>
          {renderMessage()}
          </div>
         );
  }
  




const  styles={
  content:{
    display:"flex",
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"flex-start",
    width:"100%"                
  },
  row:{
        display:"flex",
        flexDirection:"row",
        alignItems:"flex-end",
        justifyContent:"flex-start",
        width:"100%",                
  },
  button:{
    enabled:{
      backgroundColor:"#5291CD",
      borderRadius:5,      
      color:"white",
      padding:5,
      fontSize:10      
    },
    disabled:{
      padding:5,      
      backgroundColor:"#888888",
      color:"white",
      borderRadius:5,      
      fontSize:10
    }
  },
  message:{
    fontSize:10,
    color:"#888888",

  }
  

}