import mongoose from "mongoose";



const comments_schema = new mongoose.Schema({

 comment :{type : String , require :true} ,
    
 ownerId :{ type : mongoose.Schema.Types.ObjectId , // comment owner
   ref : "users" , 
   require :true } , 
    
 mentions :[{type :mongoose.Schema.Types.ObjectId , // what i will mention
   ref :"users"}],
    
 pictures :{ 
  URLS:[{
   secure_url:String ,
   public_id :String
     }],
  folderId:String},

 commentOnId :{  // the id for the comment or for the post
    type : mongoose.Schema.Types.ObjectId ,
    refPath :"onModel" ,
    require : true  } ,
 onModel : { // mention witch one
    type :String , 
    enum :["Post" , "Comment"] }


} , {timestamp:true} )



const comments_model = mongoose.models.comment ||  mongoose.model("comments" , comments_schema)

export default comments_model