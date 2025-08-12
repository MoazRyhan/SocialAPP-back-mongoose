
import auth_controller from "../modules/auth/auth_controller.js";
import user_controller from "../modules/User/User_controller.js";
import  express  from 'express';
import { main_schema } from "../GraphQl/main_schema.js";
import { createHandler } from "graphql-http";
import post_controller from "../modules/post/post_controller.js";
import comments_controller from "../modules/comments/comments_controller.js";
import react_controller from "../modules/React/react_controller.js";






const router_handler = (app) =>{


    app.use( "/graphTest" , createHandler({schema :main_schema }) )

    // all routes is here
    app.use( "/Assets"  , express.static("Assets") ) // to till the browser that you can browse the photo 
    app.use("/auth" , auth_controller )
    app.use("/user" , user_controller )
    app.use("/post" , post_controller )
    app.use("/comment" , comments_controller )
    app.use("/react" , react_controller )


    app.use("*" , (req ,res)=>{

        res.status(404).json({ message :"this Router is not found" })
    } )


}




export default router_handler 