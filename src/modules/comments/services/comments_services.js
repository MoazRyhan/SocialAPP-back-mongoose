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
 
        // console.log(comment);
        
        const images = []
        let Tags = []
        let Mentions = []
        
        
        // check if the tags included valid userId
        if (mentions?.length) {
            const users = await user_model.find({_id : {$in:mentions}})
            if ( users.length !== mentions.length  ) {
                return res.status(400).json({message : "invalid tags"})
            }
            Mentions = mentions
            // console.log(tags , "tags me" );
            
        }  
        
        // check if the tags included valid userId
        if (tags?.length) {
            const users = await user_model.find({_id : {$in:tags}})
            if ( users.length !== tags.length  ) {
                return res.status(400).json({message : "invalid tags"})
            }
            Tags = tags
            // console.log(tags , "tags me" );
            
        }  

        if (OnModel == "posts") {
            const post = await post_model.findOne({_id :CommentOnId , allowComments : true })
            if (!post) {
                return res.status(400).json({ message : "post not found or comment not found" })
            }
        }else if (OnModel == "comments"){
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
            CommentPictures : images ,
            commentOnId : CommentOnId ,
            onModel : OnModel
        }


        
        // console.log(postContent , ";;;;;;;;;;;;;;;");
        const CreatedComment =  await comments_model.create(CommentContent) 
        
        
       return res.status(200).json({ massage: "your comment has been added" , comments : CreatedComment })
        
        
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
                    // match : {OnModel :"comment"},
                    // select : "content -_id"

                    // populate : [{
                    //     path : "ownerId",
                    //     select : "name -_id"
                    // }]


                },
                {
                    path : "commentOnId" ,
                    // select : "name -_id" ,

                }
            ]
        )
        

    
    
       return res.status(200).json({ massage: "all the comments for this user is here" , comments : comments })
        
        
    } catch (error) {
        console.log(  "error from  =======> list comments services"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}