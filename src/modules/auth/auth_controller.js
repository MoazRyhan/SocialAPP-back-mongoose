import * as auth_service from "./services/auth_services.js"
import asyncHandler from "express-async-handler";
import  Router  from "express"
import { authentication_middleware, authorization_middleware } from "../../middlewares/auth_middleware.js";
const auth_controller = Router()






auth_controller.post("/sign-up" , asyncHandler(auth_service.sign_up_service) )
auth_controller.post("/sign-in" , asyncHandler(auth_service.sign_in_service) )
auth_controller.get("/verify/:verify_email_token" , asyncHandler(auth_service.verify_email_service) )
auth_controller.post("/refresh-token" , asyncHandler(auth_service.refresh_token_service) )
auth_controller.post("/gmail-signup" , asyncHandler(auth_service.sign_up_gmail_service) )
auth_controller.post("/gmail-login" , asyncHandler(auth_service.sign_in_gmail_service) )
auth_controller.post("/sign-out" , authentication_middleware() , asyncHandler(auth_service.sign_out_service) )






export default auth_controller