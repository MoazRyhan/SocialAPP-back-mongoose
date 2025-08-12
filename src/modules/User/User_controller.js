import express  from "express"
const user_controller = express()
import * as user_service from "./services/user_services.js"
import asyncHandler from "express-async-handler"
import { Multer_host, Multer_local } from "../../middlewares/multer_middleware.js"
import { ImageExtensions } from "../../constants/constant.js"
import { authentication_middleware } from './../../middlewares/auth_middleware.js';




user_controller.use(authentication_middleware())
user_controller.get(  "/get_user_data"   , asyncHandler(user_service.get_user_data)  ) // under testing
user_controller.post(  "/updata_user_data"   , asyncHandler(user_service.updata_user_data)  ) 
user_controller.patch(  "/upload_profile_image"  , Multer_local("User/profile/profile_picture" , ImageExtensions ).single("image") , asyncHandler(user_service.upload_profile_image)  )
user_controller.put(  "/upload_cover_images"  , Multer_local("User/profile/cover_pictures" , ImageExtensions ).array("images" ,5 ) , asyncHandler(user_service.upload_cover_images)  )
user_controller.patch(  "/upload_cloud_profile_image"  , Multer_host( ImageExtensions ).single("image") , asyncHandler(user_service.upload_cloud_profile_image)  )
user_controller.put(  "/upload_cloud_cover_images"  , Multer_host( ImageExtensions ).array("images" ,5 ) , asyncHandler(user_service.upload_cloud_cover_images)  )
user_controller.delete(  "/delete_user_account"   , asyncHandler(user_service.delete_user_account)  )












export default user_controller