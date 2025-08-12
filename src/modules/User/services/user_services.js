
import { cloudinary } from "../../../config/cloudinary.config.js"
import user_model from "../../../DB/models/users_model.js"
import { email_emitter } from "../../../config/send_email_verify.config.js"
import  jwt  from 'jsonwebtoken';


export const get_user_data =  async (  req , res ) =>{  
    
    try {
        
    const { email } = req.login_user

    const User = await user_model.find( {email })
    if (!User) { return  res.status(404).json({ message :" this user is not found" })}


    return res.status(200).json({ message :"the user data" , User })
                
    } catch (error) {
        console.log(  "error from get user data =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }


    
}

export const updata_user_data = async ( req , res ) =>{

    
    try {
    const { _id } = req.login_user
    const { name , phone , DOB , email } = req.body
    
    // found  the  user
    const user = await user_model.findById(_id)
    if (!user ) { return  res.status(404).json({ message :" there is no user like this" })}
    // console.log(user);
    
    const CheckEmail = await user_model.findOne({email})
    if (CheckEmail == true ) { return  res.status(404).json({ message :"choose unique name  " })}
    console.log(CheckEmail);
    


    const checkName = await user_model.findOne({name})
    if (checkName == true ) { return  res.status(404).json({ message :"choose unique email" })}
    
    user.name = name || user.name
    user.phone = phone || user.phone
    user.DOB = DOB || user.DOB
    user.email = email || user.email
    await user.save()


        // verify email token
        const verify_email_token = jwt.sign({ email } , process.env.JWT_EMAIL_VERIFY_SECURE_KEY  , {expiresIn: "10m"} )
        // console.log(verify_email_token);
    
        // the email link
        const confirmation_verify_link = ` ${req.protocol}://${req.headers.host}/auth/verify/${verify_email_token} ` 
        
        email_emitter.emit( "send_email" ,  {
            to : email ,
            subject : " this mail for  verify your email",
            html :` <h2> verify your email </h2>
            <a href="${confirmation_verify_link}"> click here to verify </a> `,
            // attachments : {
            //     filename: "verify photo.png",
            //     path : path.resolve("../../../../Assets/verify_email/verify photo.png")
            // }
        } );

    const  new_user = user

    return res.status(200).json({ message: "the data has been updated" , new_user });
                
    } catch (error) {
        console.log(  "error from updata_user_data =======>"  , error );
       return res.status(500).json({ message : "internal server error "})
    }


}
 


export const  upload_profile_image = async ( req , res  ) =>{

    
    
    try {
        
      const { _id} = req.login_user
      const {file} = req
      if (!file) { return  res.status(404).json({ message :" there is no uploaded file" })}

      const url =`${req.protocol}://${req.headers.host}/${file.path}`

      const User = await user_model.findByIdAndUpdate(_id ,{ profilePicture:url } , {new :true}  )

     if (!User) {return  res.status(409).json({ message :" failed to upload the picture " , User })}
     
     
     return res.status(200).json({ message :" the photo has been uploaded " , User })
    
    } catch (error) {
        console.log(  "error from upload profile image =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }



}






export const  upload_cover_images = async ( req , res  ) =>{
    
    try {
        
    const { _id} = req.login_user
    const {files} = req
    
    // console.log(files  , "all the files" );
    if (!files?.length) { return  res.status(404).json({ message :" there is no uploaded files" })} // here check if there is no no data inside the array  
    
    const images = files.map(  file =>  `${req.protocol}://${req.headers.host}/${file.path}` )      
    
    // console.log(images  , "all the images" );
    
    const User = await user_model.findByIdAndUpdate(_id ,{ coverPicture:images } , {new :true}  )

   if (!User) {return  res.status(409).json({ message :" failed to upload the picture " , User })}
    

   return res.status(200).json({ message :" the photo has been uploaded " , User })
                
    } catch (error) {
        console.log(  "error from upload cover images =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }

 
}





export const upload_cloud_profile_image = async ( req , res  ) =>{
    
    
    try {
        
    
       const   { _id } = req.login_user
       const   { file } = req
       if (!file) { return  res.status(404).json({ message :" there is no uploaded file" })}
    
    
       const { public_id , secure_url } = await cloudinary().uploader.upload(file.path, {
           folder: `/${process.env.FOLDER_NAME_CLOUDINARY}/User/Profile${_id}`
        });
       
       // send the data to cloudinary
        const User = await user_model.findByIdAndUpdate(_id ,{ profilePicture: {public_id , secure_url,folderId:`Profile${_id}`}} , {new :true}  )
        console.log(User);
        console.log(_id);
        
        
     
        if (!User) {return  res.status(409).json({ message :" failed to upload the picture " , User })}
        // Return response properly
    
        return res.status(200).json({ message: "The photo has been uploaded", User });
    } catch (error) {
        console.log(  "error from upload cloud profile =======>"  , error );
         res.status(500).json({ message : "internal server error "})
    }


   
}







export const  upload_cloud_cover_images = async ( req , res  ) =>{

    
    try {

    const   { _id } = req.login_user
    const   { files } = req
    if (!files) { return  res.status(404).json({ message :" there is no uploaded file" })}

    const images = []
    for (const file of files) {
        const { public_id , secure_url } = await cloudinary().uploader.upload(file.path, {
            folder: `/${process.env.FOLDER_NAME_CLOUDINARY}/User/cover${_id}`
        });
        images.push( { images: { public_id , secure_url} , folderId :`cover${_id}`  } )
    }

    
    // send the data to cloudinary
     const User = await user_model.findByIdAndUpdate(_id ,{ coverPicture:images } , {new :true}  )
  
     if (!User) {return  res.status(409).json({ message :" failed to upload the picture " , User })}
     // Return response properly
     return  res.status(200).json({ message: "The photos has been uploaded", User });
                
    } catch (error) {
        console.log(  "error from upload cloud cover =======>"  , error );
       return res.status(500).json({ message : "internal server error "})
    }


} 






export const delete_user_account = async ( req , res ) =>{

    
    try {
    const { _id } = req.login_user
    
    // delete from database
    const delete_user = await user_model.findByIdAndDelete(_id)
    if (!delete_user) { return  res.status(404).json({ message :" there is no account like this" })}
    // console.log(delete_user);
    

    // ======================= test for delete the data =======================

    // select the data
    // const deleted_profile_picture = delete_user.profilePicture.public_id
    // const deleted_cover_pictures = delete_user.coverPicture.map( c => c.public_id )

    // delete form cloudinary
    // const delete_cloudinary_picture = await cloudinary().uploader.destroy(deleted_profile_picture)
    // const delete_cloudinary_pictures = await cloudinary().api.delete_resources(deleted_cover_pictures)



    return res.status(200).json({ message: "User account has been deleted" });
                
    } catch (error) {
        console.log(  "error from delete account =======>"  , error );
       return res.status(500).json({ message : "internal server error "})
    }


}
 
