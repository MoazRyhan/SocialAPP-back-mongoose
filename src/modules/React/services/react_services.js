


  
export const add_react_service = async   ( req , res ) => {

    try {
        

    
    
       return res.status(200).json({ massage: ""})
        
        
    } catch (error) {
        console.log(  "error from  =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}


export const delete_react_service = async   ( req , res ) => {

    try {
        

    
    
       return res.status(200).json({ massage: ""})
        
        
    } catch (error) {
        console.log(  "error from  =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}