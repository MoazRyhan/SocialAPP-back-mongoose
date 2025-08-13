import * as react_services from "./services/react_services.js" 
import Router from "express";
import { system_role } from "../../constants/constant.js";
import  asyncHandler  from 'express-async-handler';
import { authentication_middleware, authorization_middleware } from "../../middlewares/auth_middleware.js";
const react_controller = Router()


const { USER ,  ADMIN , SUPER_ADMIN  }  = system_role

react_controller.use( authentication_middleware()  )

react_controller.post( "/create/:reactOnId"  /*, authorization_middleware([USER])*/ ,asyncHandler( react_services.add_react_service  )   )
react_controller.patch( "/remove/:reactId"  /*, authorization_middleware([USER])*/ ,asyncHandler( react_services.remove_react_service  )   )
react_controller.get( "/list_react"  , asyncHandler( react_services.delete_react_service  )   )





export default react_controller





