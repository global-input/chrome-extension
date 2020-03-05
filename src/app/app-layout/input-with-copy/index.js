import React, {Component} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from 'prop-types';
import ClipboardCopyButton from "../clipboard-copy-button";
import InputWithLabel from "../input-with-label";

export default class InputWithCopy extends Component{
  
  render(){
         return(
           <div style={styles.container}>
                    <InputWithLabel {...this.props}/>
                    {this.renderCopyButton()}


          </div>
         );
  }
  renderCopyButton(){
    if(this.props.value){
      return(<div style={styles.buttonContainer}>
        <ClipboardCopyButton copyFieldId={this.props.id} valueToCopy={this.props.value}/>
      </div>);
    }
    else{
      return null;
    }
  }
}




InputWithCopy.propTypes={
    id:PropTypes.string.isRequired,
    type:PropTypes.string,
    label:PropTypes.string,
    readOnly:PropTypes.bool,
    selected:PropTypes.bool,
    onChange:PropTypes.func,
    onSelected:PropTypes.func,
    styles:PropTypes.object,
    help:PropTypes.string,
}
InputWithCopy.defaultProps={
    type:"text"
}
const  styles={
  container:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-start",
        width:"100%",                
  },
  buttonContainer:{
    position:"relative",
    top:10
  }

}