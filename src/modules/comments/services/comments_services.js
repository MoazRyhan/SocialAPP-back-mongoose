import { nanoid } from "nanoid"
import comments_model from "../../../DB/models/comments_model.js"
import post_model from "../../../DB/models/posts_model.js"
import { cloudinary } from "../../../config/cloudinary.config.js"
import user_model from "../../../DB/models/users_model.js"



  
export const add_comment_service = async   ( req , res ) => {


    try {
   
        const { _id : ownerId } = req.login_user 
        const { comment , mentions  ,tags  , OnModel } = req.body
        const { CommentOnId } = req.params
 
        const   { files } = req
        const images = []
        let Tags = []
        
        
        // check if the tags included valid userId
        if (tags?.length) {
            const users = await user_model.find({_id : {$in:tags}})
            if ( users.length !== tags.length  ) {
                return res.status(400).json({message : "invalid tags"})
            }
            Tags = tags
            // console.log(tags , "tags me" );
            
        }  

        if (OnModel == "Post") {
            const post = await post_model.findById({_id :CommentOnId , allowedComments : true })
            if (!post) {
                return res.status(400).json({ message : "post not found or comment not found" })
            }
        }else if (OnModel == "Comment"){
            const comment = await comments_model.findById(CommentOnId)
            if (!comment) {
                return res.status(400).json({ message : "comment not found" })
            }
        }

        
        
        if ( req.files?.length) {
            const folderId = nanoid(4)
            
            for (const file of files) {
                const { public_id , secure_url } = await cloudinary().uploader.upload(file.path, {
                    folder: `/${process.env.FOLDER_NAME_CLOUDINARY}/User/comments/comment${folderId}`
                });
                
                images.push( { URLS: { public_id , secure_url} , folderId :`comment${folderId}`  } )
            }
            
            
        } 
        
        
        const CommentContent = {
            ownerId : ownerId ,
            comment  : comment ,
            mentions  :mentions  ,
            tags : Tags ,
            pictures : images
        }


        CommentContent.CommentOnId = CommentOnId
        CommentContent.OnModel = OnModel
        
        // console.log(postContent , ";;;;;;;;;;;;;;;");
        const CreatedPost =  await comments_model.create(CommentContent) 
        
        
       return res.status(200).json({ massage: "your comment has been added" , comments : CreatedPost })
        
        
    } catch (error) {
        console.log(  "error from  =======> add comment service "  , error );
        res.status(500).json({ message : "internal server error "})
    }
}


export const list_comment_service = async   ( req , res ) => {
    try {
        const  comments = await comments_model.find().populate(
            [
                {
                    path : "ownerId" ,
                    // match : {OnModel :"Comment"},
                    // select : "content -_id"

                    populate : [{
                        path : "ownerId",
                        select : "name -_id"
                    }]


                },
                {
                    path : "commentOnId" ,
                    select : "name -_id" ,

                }
            ]
        )
        

    
    
       return res.status(200).json({ massage: "all the comments for this user is here" , comments : comments })
        
        
    } catch (error) {
        console.log(  "error from  =======> list comments services"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}