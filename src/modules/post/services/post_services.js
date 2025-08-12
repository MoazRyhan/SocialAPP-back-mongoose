import { nanoid } from "nanoid"
import user_model from "../../../DB/models/users_model.js"
import post_model from "../../../DB/models/posts_model.js"
import { cloudinary } from "../../../config/cloudinary.config.js"



  
export const add_post_service = async   ( req , res ) => {

    try {

        const { _id : ownerId } = req.login_user 
        const { title , description , allowComments ,tags } = req.body

        const   { files } = req
        if (!files) { return  res.status(404).json({ message :" there is no uploaded file" })}
        const images = []
        
        
        // check if the tags included valid userId
        if (tags?.length) {
            const users = await user_model.find({_id : {$in:tags}})
            if ( users.length !== tags.length  ) {
                return res.status(400).json({message : "invalid tags"})
            }
            postContent.tags = tags
            console.log(tags , "tags me" );
            
        }  
        
        
        if ( req.files?.length) {
        const folderId = nanoid(4)

        for (const file of files) {
                const { public_id , secure_url } = await cloudinary().uploader.upload(file.path, {
                    folder: `/${process.env.FOLDER_NAME_CLOUDINARY}/User/posts/post${folderId}`
                });

                images.push( { URLS: { public_id , secure_url} , folderId :`post${folderId}`  } )
            }
            
            
        } 
        
        
        const postContent = {
            ownerId : ownerId ,
            title :title ,
            description  : description ,
            allowComments : allowComments ,
            tags , 
            pictures : images
        }
        // console.log(postContent , ";;;;;;;;;;;;;;;");
        
        const CreatedPost =  await post_model.create(postContent) 
        
        
       return res.status(200).json({ massage: "your post has been added" , post : CreatedPost })
        
        
    } catch (error) {
        console.log(  "error from  =======> add post service"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}














// home page scrolling
export const list_post_service = async   ( req , res ) => {

    try {
        // const { _id } = req.login_user
        const  posts = await post_model.find().populate(
            [
                {
                    path : "ownerId" ,
                    select : "name" ,

                }
            ]
        )
        

    
    
       return res.status(200).json({ massage: "all the post for this user is here" , posts : posts })
        
        
    } catch (error) {
        console.log(  "error from  =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }
}