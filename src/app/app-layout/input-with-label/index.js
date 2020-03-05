import React, {Component} from 'react';

import PropTypes from 'prop-types';

import {styles} from './styles';


export default class InputWithLabel extends Component{

  constructor(props){
       super(props);
       this.state={
          focus: false
        }
  }
  setFocus(focus) {
      this.setState({focus});
  }
  render(){
          var stylestatus={
              label:"",
              field:""
          }
          if(this.elem){
              if((!this.state.focus) && (!this.elem.value)){
                    stylestatus.label="placeholder"
              }
          }
          else if((!this.state.focus) && (!this.props.value)){
                stylestatus.label="placeholder"
          }
          if(this.props.readOnly){
              stylestatus.field="readOnly"
          }
         if(this.props.type==="textarea"){
           return this.renderTextArea(stylestatus);
         }
         else{
           return this.renderTextInput(stylestatus);
         }


  }
  renderTextInput(stylestatus){    
    return(
      <div style={styles.container}>
        <label htmlFor={this.props.id}  onClick={this.labelClicked.bind(this)}>
             <span style={styles.label.get(stylestatus.label)}>{this.props.label}</span>
        </label>
            <input
            id={this.props.id}
            ref={elem=>this.elem}
            type={this.props.type}
            style={styles.field.get(stylestatus.field)}
            readOnly={this.props.readOnly}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            onFocus={()=>this.setFocus(true)}
            onBlur={()=>this.setFocus(false)}
            onChange={(evt) => {
                if(this.props.onChange){
                   this.props.onChange(evt.target.value,this.props.id);
                }

             }} value={this.props.value}/>

          {this.renderHelp(styles)}
      </div>
    );
  }
  renderTextArea(stylestatus){
    return(
      <div style={styles.container}>
        <label htmlFor={this.props.id}  onClick={this.labelClicked.bind(this)}>
             <span style={styles.arealabel.get(stylestatus.label)}>{this.props.label}</span>
        </label>

              <textarea
                id={this.props.id}
                type={this.props.type}
                style={styles.field.get(stylestatus.field)}
                readOnly={this.props.readOnly}
                rows="6"
                onFocus={()=>this.setFocus(true)}
                onBlur={()=>this.setFocus(false)}
                onChange={(evt) => {
                    if(this.props.onChange){
                       this.props.onChange(evt.target.value,this.props.id);
                    }
                 }} value={this.props.value}/>
      </div>
    );
  }

  renderHelp(styles){
      if(this.props.help){
        return(
            <div style={styles.help}>{this.props.help}</div>
          );
      }
      else{
        return null;
      }

  }
  labelClicked(){
      document.getElementById(this.props.id).focus();

  }

}


InputWithLabel.propTypes={
    id:PropTypes.string.isRequired,
    type:PropTypes.string,
    label:PropTypes.string,
    readOnly:PropTypes.bool,
    onChange:PropTypes.func,
    styles:PropTypes.object,
    help:PropTypes.string,
}
InputWithLabel.defaultProps={
    type:"text"
}
