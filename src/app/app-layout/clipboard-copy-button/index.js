import React from 'react';
import {styles} from "./styles";

var textContent={
    copied:"Content copied to the clipboad",
    missingCopyFieldId:"Missing copyFieldId attribute",
    copyFieldNotFound:"The specified field is not found"
}
export default class ClipboardCopyButton extends React.Component{

  constructor(props){
        super(props);
        this.state={notificationMessage:null};
    }
    componentWillUnmount(){
        if(this.clipboardTimeoutId){
          clearTimeout(this.clipboardTimeoutId);
          this.clipboardTimeoutId=null;
        }
    }
    setNotificationMessage(notificationMessage){
           this.setState({notificationMessage},()=>{
             this.clipboardTimeoutId=setTimeout(()=>{
                   this.setState({notificationMessage:null});
                   this.clipboardTimeoutId=null;
             },2000);
           });
    }
  render(){
    if(this.state.notificationMessage){
          return (<div style={styles.notificationMessage}>{this.state.notificationMessage}</div>);
    }
    return(
      <button style={styles.copyButton} onClick={()=>{
            if(!this.props.copyFieldId){
                  this.setNotificationMessage(textContent.missingCopyFieldId);
            }
            else{
                  var copyElement=document.getElementById(this.props.copyFieldId);
                  if(!copyElement){
                        this.setNotificationMessage(textContent.copyFieldNotFound);
                  }
                  else{
                    //var type=copyElement.type;
                    //copyElement.type="text";
                    if(this.props.valueToCopy){
                      navigator.clipboard.writeText(this.props.valueToCopy);                      
                    }
                    else{
                      copyElement.select();
                      document.execCommand("Copy");
                    }
                    
                    //copyElement.type=type;
                    this.setNotificationMessage(textContent.copied);
                  }

            }

      }}>Copy</button>
    );


  }


}
