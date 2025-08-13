
import comments_model from '../../../DB/models/comments_model.js';
import post_model from '../../../DB/models/posts_model.js';
import reacts_model from './../../../DB/models/reacts_model.js';


  
export const add_react_service = async   ( req , res ) => {

    try {
   
        const { _id : ownerId } = req.login_user 
        const { reactType , OnModel } = req.body
        const { reactOnId} = req.params
 


        if (OnModel == "posts") {
            const post = await post_model.findOne({_id :reactOnId , allowComments : true })
            if (!post) {
                return res.status(400).json({ message : "post not found or comment not found" })
            }
        }else if (OnModel == "comments"){
            const comment = await comments_model.findById(reactOnId)
            if (!comment) {
                return res.status(400).json({ message : "comment not found" })
            }
        }

        
        
        
        const ReactContent = {
            ownerId : ownerId ,
            reactType :reactType ,
            reactOnId : reactOnId ,
            onModel : OnModel
        }


        
        const CreatedReact =  await reacts_model.create(ReactContent) 
        
        
       return res.status(200).json({ massage: "your react has been added" , React : CreatedReact })
        
        
    } catch (error) {
        console.log(  "error from  =======> add react service "  , error );
        res.status(500).json({ message : "internal server error "})
    }
}



export const remove_react_service = async   ( req , res ) => {

    try {
   
        const { _id : ownerId } = req.login_user 
        const { reactType , OnModel } = req.body
        const { reactOnId} = req.params
 


        if (OnModel == "posts") {
            const post = await post_model.findOne({_id :reactOnId , allowComments : true })
            if (!post) {
                return res.status(400).json({ message : "post not found or comment not found" })
            }
        }else if (OnModel == "comments"){
            const comment = await comments_model.findById(reactOnId)
            if (!comment) {
                return res.status(400).json({ message : "comment not found" })
            }
        }

        
        
        
        const ReactContent = {
            ownerId : ownerId ,
            reactType :reactType ,
            reactOnId : reactOnId ,
            onModel : OnModel
        }


        
        const CreatedReact =  await reacts_model.create(ReactContent) 
        
        
       return res.status(200).json({ massage: "your react has been added" , React : CreatedReact })
        
        
    } catch (error) {
        console.log(  "error from  =======> add react service "  , error );
        res.status(500).json({ message : "internal server error "})
    }
}


export const delete_react_service = async   ( req , res ) => {

    try {
        const  reacts = await reacts_model.find().populate(
            [
                {
                    path : "ownerId" ,
                    select : "name" ,
                    
                }
            ]
        )
        

    
    
       return res.status(200).json({ massage: "all the post for this user is here" , reacts : reacts })
        
        
    } catch (error) {
        console.log(  "error from  =======> list reacts services"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}