
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
    pictures :[{
        URLS: [{ 
        public_id : String,
        secure_url : String  }],

        folderId : String

    }],
},{timestamps:true} ) 




const post_model =  mongoose.models.post || mongoose.model("posts" , post_schema )

export default post_model 