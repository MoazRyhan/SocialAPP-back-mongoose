import mongoose from "mongoose";


 const data_base =  async () =>{

    try {
        const data_connect = await mongoose.connect( `${process.env.DB_URI }`)
        // console.log(data_connect);
        
        console.log("database is working");
        
        
    } catch (error) {
        console.log("database failed to connect" ,error );
        
    }


 }


 export default data_base