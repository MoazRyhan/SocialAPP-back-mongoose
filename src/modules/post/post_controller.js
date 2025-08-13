import * as post_services from "./services/post_services.js" 
import Router from "express";
import { ImageExtensions, system_role } from "../../constants/constant.js";
import  asyncHandler  from 'express-async-handler';
import { authentication_middleware, authorization_middleware } from "../../middlewares/auth_middleware.js";
import { Multer_host } from "../../middlewares/multer_middleware.js";
import { checkUsers_middleware } from './../../middlewares/check_users.middleware.js';
const post_controller = Router()


const { USER ,  ADMIN , SUPER_ADMIN  }  = system_role

post_controller.use( authentication_middleware()  )

post_controller.post( "/add_post" , checkUsers_middleware() /*, authorization_middleware([USER])*/, Multer_host( ImageExtensions ).array("images" ,5 )  ,asyncHandler( post_services.add_post_service  )   )
post_controller.get( "/list_postsId"  , asyncHandler( post_services.list_post_service  )   )






export default post_controller





