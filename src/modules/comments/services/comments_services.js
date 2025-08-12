


  
export const add_comment_service = async   ( req , res ) => {


    try {
        

    
    
       return res.status(200).json({ massage: ""})
        
        
    } catch (error) {
        console.log(  "error from  =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}


export const list_comment_service = async   ( req , res ) => {

    try {
        

    
    
       return res.status(200).json({ massage: ""})
        
        
    } catch (error) {
        console.log(  "error from  =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}