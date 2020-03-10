
export default {
    title:{
        minWidth:100,
        minHeight:20,
        width:"100%",
        backgroundColor:"#153E85",
        color:"white",
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        fontFamily: "Avenir",
        fontSize: 20,
        fontWeight: 100,        
        whiteSpace: 'nowrap',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,        
    },
    
    appContainer:{
        minWidth:100,
        minHeight:100,        
     },
     connectionSetting:{
        width:"100%",        
        color:"#153E85",
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-end",
        fontFamily: "Avenir",
        fontSize: 10,
        fontWeight: 100,        
        whiteSpace: 'nowrap',
        padding: 5        
     },
     errorMessage:{
        width:"100%",        
        color:"red",
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-start",
        fontFamily: "Avenir",
        fontSize: 15,
        fontWeight: 100,                
        padding: 10          
     },
     domain:{
         width:"100%",
         fontFamily: "Avenir",
         fontSize: 16,
         paddingTop:10,
         fontWeight: 100,        
         color:"#153E85",
         whiteSpace: 'nowrap',
         display:"flex",
         flexDirection:"row",
         justifyContent:"center",
        
        
     },
    
     paragraph:{
            fontSize: 16,      
            marginBottom: 20,
            marginTop: 20,
            color: "#5291CD",
            width:"100%",
            display:"flex",
            justifyContent:'center'
    },
    connectionMessage:{
         minWidth:500,
         minHeight:500
    },
    message:{
        container:{
        minWidth:100,
        minHeight:30,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItem:'center'
        },
        text:{
            width:"100%",        
            color:"#153E85",
            display:"flex",
            flexDirection:"row",
            justifyContent:"center",
            fontFamily: "Avenir",
            fontSize: 14,
            fontWeight: 100,
            padding: 20            
        }
    },
    form:{
        container:{
            display:'flex',
            flexDirection:'column',
            justifyContent:'start',
            alignItem:'start',
            width:"100%",
            minWidth:300,             
        },
        fields:{
            display:'flex',
            flexDirection:'column',
            justifyContent:'start',
            alignItem:'start',
            width:"100%",
            padding:10
        },
        footer:{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItem:'end',
            width:"100%",
            padding:10
        }
    }

}