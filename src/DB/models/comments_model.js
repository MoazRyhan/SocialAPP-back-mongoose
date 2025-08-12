import mongoose from "mongoose";



const comments_schema = new mongoose.Schema({

 comment :{type : String , require :true} ,
    
 ownerId :{ type : mongoose.Schema.Types.ObjectId ,
   ref : "uses" , 
   require :true } , 
    
 mentions :[{type :mongoose.Schema.Types.ObjectId ,
   ref :"users"}],
    
 pictures :{ 
  urls:[{
   secure_url:String ,
   public_id :String
     }],
  folderId:String},

 commentOnId :{  
    type : mongoose.Schema.Types.ObjectId ,
    refPath :"onModel" ,
    require : true  } ,
 onModel : {
    type :String ,
    enum :["Post" , "Comment"] }


} , {timestamp:true} )



const comments_model = mongoose.models.comment ||  mongoose.model("comments" , comments_schema)

export default comments_model