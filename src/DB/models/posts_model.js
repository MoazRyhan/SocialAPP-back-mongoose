
import mongoose from "mongoose";



const post_schema = new mongoose.Schema({

    title :{type : String , require :true} ,

    description : String ,

    ownerId :{ type : mongoose.Schema.Types.ObjectId ,
    ref : "users" , 
    require :true } , 

    tags :[{type :mongoose.Schema.Types.ObjectId ,
     ref :"users"}],

    allowComments :{  
        type : Boolean ,
        default : true ,
        // folderId : String  // tell know this is for what
    } ,
    PostPictures :[{
        URLS: [{ 
        public_id : String,
        secure_url : String  }],

        folderId : String

    }],
},{timestamps:true} ) 

//comments virtual 
post_schema.virtual( "comment" , {
    ref : "comments" ,
    localField : "_id" , 
    foreignField : "CommentOnId"
} )


const post_model =  mongoose.models.post || mongoose.model("posts" , post_schema )

export default post_model 