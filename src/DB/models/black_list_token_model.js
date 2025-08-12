import mongoose from "mongoose";


 const black_list_schema = new mongoose.Schema({

    token_id : {  type : String , require : true , unique : true},
    expiration_data : {  type : String , require : true }


},{timestamp:true}  )




const black_list_model = mongoose.models.black_list_token || mongoose.model("black_list_token" , black_list_schema)


export default black_list_model