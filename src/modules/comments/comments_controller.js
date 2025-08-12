import * as comments_services from "./services/comments_services.js" 
import Router from "express";
import { system_role } from "../../constants/constant.js";
import  asyncHandler  from 'express-async-handler';
import { authentication_middleware, authorization_middleware } from "../../middlewares/auth_middleware.js";
const comments_controller = Router()


const { USER ,  ADMIN , SUPER_ADMIN  }  = system_role

comments_controller.use( authentication_middleware  )

comments_controller.post( "add_comment"  , authorization_middleware([USER]) ,asyncHandler( comments_services.add_comment_service  )   )
comments_controller.get( "list_comments"  , asyncHandler( comments_services.list_comment_service  )   )






export default comments_controller