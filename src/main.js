import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { Server } from "socket.io"
import data_base from "./DB/connection.js"
import router_handler from "./utils/router_handler.utils.js"
import { createServer } from 'node:http';
import { establishConnection } from "./utils/socket.utils.js"
dotenv.config()

// const whitelist = [process.env.FRONT_END_ORIGIN , undefined /* to tell the cors to accept postman requests ( need to delete it after the test ) */ ]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }

// console.log(process.env.FRONT_END_ORIGIN);


export const bootstrap = () =>{
    const app = express()
    const server = createServer(app)
    const IO = new Server(server , {
        cors : { 
            origin : "*"
         }
    } ) ;
    
    app.use(express.json() )
    
    data_base()
    app.use( cors({ origin: "*" }) )
    
    // handel the cors option
    // app.use( cors(corsOptions) )

    // the rest of the routers/
    router_handler(app)


    // the socket connection
    // establishConnection(IO)
    
    server.listen(process.env.PORT, () => { // here use Server for this one
        console.log("the server is running" , process.env.PORT ); 
        
    } )
} 



