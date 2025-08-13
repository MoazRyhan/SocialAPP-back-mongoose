
import mongoose from "mongoose";
import { reacts_types } from "../../constants/constant.js";


const reacts_schema = new mongoose.Schema({ 

     reactOnId :{  
     type : mongoose.Schema.Types.ObjectId ,
     refPath :"onModel" ,
     require : true  } ,

    ownerId: {type :mongoose.Schema.Types.ObjectId ,
     ref :"users" ,
     require :true} ,


    onModel:{ type : String,
     enum:["posts" , "comments"] 
     },


   reactType :{type :String ,
    enum : Object.values(reacts_types)
   }

}, {timestamps :true} )


const reacts_model = mongoose.models.react  || mongoose.model("reacts" , reacts_schema )

export default reacts_model