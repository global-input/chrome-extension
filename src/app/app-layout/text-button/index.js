import React, {Component} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from 'prop-types';


export default class TextButton extends Component{
  getStyles(){
      var styles={
            enabled:{
              backgroundColor:"#5291CD",
              borderRadius:5,
              margin:"5vw",
              color:"white",
              padding:10,
              minWidth:150,
            },
            disabled:{
              backgroundColor:"#888888",
              color:"white",
              borderRadius:8,
              border:"3px solid #888888",
              margin:"5vw"
            }

      }

      return styles;

  }
  render(){
         var styles=this.getStyles();
         if(this.props.disabled){
              return (<button style={styles.disabled} disabled={true}>{this.props.label}</button>);
          }
           else{
               return (<button style={styles.enabled} onClick={this.props.onClick}>{this.props.label}</button>);
           }
  }
}

TextButton.propTypes={
    disabled:PropTypes.bool,
    styles:PropTypes.object,
    label:PropTypes.string
}
TextButton.defaultProps={
    label:"Ok"
}
