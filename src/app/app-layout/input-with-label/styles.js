import styleMatchingScreenSize from '../styleMatchingScreenSize';
export var styles={
    container:{
          display:"flex",
          flexDirection:"column",
          justifyContent:"flex-start",
          alignItems:"flex-start",
          width:"100%",
    },
    field:{
        get:styleMatchingScreenSize,
        default:{
          width:"100%",
          fontSize:12,
          color:"#5291CD",          
          border:"1px solid #888888",
        },
        readOnly:{
            backgroundColor:"#AAAAAA"
        }
    },


    label:{
          get:styleMatchingScreenSize,
          default:{
              fontSize: 12,
              color: "#4880ED",              
              display:"flex",
              flexDirection:"row",
              justifyContent:"flex-start",              
              alignItems:"center",
              transform: 'translateY(10px)',
              paddingLeft:10
          },
          placeholder:{
              transform: 'translateY(30px)',
          }


    },
    arealabel:{
          get:styleMatchingScreenSize,
          default:{
              fontSize: 12,
              color: "#4880ED",              
              display:"flex",
              flexDirection:"row",
              justifyContent:"flex-start",
              alignItems:"center",
              paddingLeft:10
          },
          placeholder:{
              transform: 'translateY(50px)',
          }


    },

    help:{
      fontSize:10,
      color:"#5291CD",
      paddingLeft:5,
      paddingRight:5
    }
};
