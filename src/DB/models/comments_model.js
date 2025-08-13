import mongoose from "mongoose";



const comments_schema = new mongoose.Schema({

 comment :{type : String , require :true} ,
    
 ownerId :{ type : mongoose.Schema.Types.ObjectId , // comment owner
   ref : "users" , 
   require :true } , 
    
 mentions :[{type :mongoose.Schema.Types.ObjectId , // what i will mention
   ref :"users"}],

   tags :[{type :mongoose.Schema.Types.ObjectId , // what i will tag
   ref :"users"}],
    
 CommentPictures :[{
        URLS: [{ 
        public_id : String,
        secure_url : String  }],

        folderId : String

    }],

  onModel : { // mention witch one
     type :String , 
     enum :["posts" , "comments"] } ,



  commentOnId :{  // the id for the comment or for the post
    type : mongoose.Schema.Types.ObjectId ,
    refPath :"onModel" ,
    require : true  } ,


    



} , {timestamp:true} )

comments_schema.virtual( "post" , {
    ref : "posts" ,
    localField : "_id" , 
    foreignField : "CommentOnId"
} )

const comments_model = mongoose.models.comment ||  mongoose.model("comments" , comments_schema)

export default comments_model