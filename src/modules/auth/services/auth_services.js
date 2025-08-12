import bcrypt , {  hashSync } from "bcrypt"
import   user_model   from "../../../DB/models/users_model.js"
import { encryption } from "../../../utils/encryption.utils.js"
import { email_emitter } from "../../../config/send_email_verify.config.js"
import { v4 as uuidv4 } from 'uuid';
import path from "path"
import jwt  from "jsonwebtoken"
import {OAuth2Client} from'google-auth-library'
import { provider } from "../../../constants/constant.js";
import black_list_model from "../../../DB/models/black_list_token_model.js";


export const sign_up_service = async (req , res ) =>{
    try {        
            const { name , email , phone , password , rePassword , DOB } = req.body
    // console.log(name , email , phone , password , DOB );

    if (password !== rePassword ) { return res.status(401).json({ message :" the password and ans the rePassword must be identical " })  }

    const if_email_exists = await user_model.findOne({email})
    if (if_email_exists) { return res.status(409).json({ message : "this email is exists" }) }
    
    const if_name_exists = await  user_model.findOne({name})
    if (if_name_exists) { return res.status(409).json({ message : "name must be unique" }) }
 
    // verify email token
    const verify_email_token = jwt.sign({ email } , process.env.JWT_EMAIL_VERIFY_SECURE_KEY  , {expiresIn: "10m"} )
    // console.log(verify_email_token);

    // the email link
    const confirmation_verify_link = ` ${req.protocol}://${req.headers.host}/auth/verify/${verify_email_token} ` 
    
    email_emitter.emit( "send_email" ,  {
        to : email ,
        subject : " this mail for  verify your email",
        html :` <h2> verify your email </h2>
        <a href="${confirmation_verify_link}"> click here to verify </a> `,
        // attachments : {
        //     filename: "verify photo.png",
        //     path : path.resolve("../../../../Assets/verify_email/verify photo.png")
        // }
    } );

    // console.log(confirmation_verify_link);
    
    
    
    const  User = await user_model.create({
        name ,
        email ,
        phone ,
        password ,
        DOB 
    })


    if (User) {
        res.status(201).json( {massage:"email created successfully  there is a verification email sended to you ",User } )
    }else{
        res.status(409).json({ massage: "create is failed , try again later"})
    }

    } catch (error) {
        console.log(  "error from signup =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }



}



export const verify_email_service =  async ( req , res ) =>{
    
    try {
        
        const {verify_email_token} = req.params
        // console.log(verify_email_token);
        
    
        // chick the data
        const decoded_data = jwt.verify(verify_email_token ,process.env.JWT_EMAIL_VERIFY_SECURE_KEY )
    
    
        const User = await user_model.findOneAndUpdate({ $or:[{_id:decoded_data._id},{ email:decoded_data.email} ] },{isVerify:true},{new:true});
        
        
        if (!User ) { return res.status(404).json({  massage : " email is not found "})  }
    
    
       return res.status(200).json({ massage: "your email has been verify"})
        
        
    } catch (error) {
        console.log(  "error from verify token =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }


}




export const sign_in_service = async ( req , res  ) =>{
    
    try {
        
    const { email , password } = req.body

    // find the email 
    const User = await user_model.findOne({email})
    if (!User) { return res.status(404).json({ message : "this email is not exists" }) }

    //check the password
    const if_pass_right = bcrypt.compareSync( password , User.password )    
    if ( !if_pass_right ) { return res.status(404).json({ message : "email or password is wrong" }) }

    const access_token = jwt.sign( { email:email , _id:User._id } ,process.env.ACCESS_TOKEN_KEY , {expiresIn:process.env.EXPIRATION_DATA_ACCESS_TOKEN_KEY , jwtid:uuidv4() } )
    const refresh_token = jwt.sign( { email:email , _id:User._id } ,process.env.REFRESH_TOKEN_KEY , {expiresIn:process.env.EXPIRATION_DATA_REFRESH_TOKEN_KEY , jwtid:uuidv4() } )


    
    return res.status(200).json({ message :" user has been sign in " , access_token , refresh_token  })

    } catch (error) {
        console.log(  "error from signin =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }




}



export const refresh_token_service = async ( req , res ) => {

    
    
    
    try {
    const {refresh_token} = req.headers
    
    // decoding data
     const decoding_refresh_token = jwt.verify( refresh_token , process.env.REFRESH_TOKEN_KEY )
        

    // rasta of decoding data
     const access_token = jwt.sign( { _id:decoding_refresh_token._id , email:decoding_refresh_token.email } , process.env.ACCESS_TOKEN_KEY, {expiresIn:process.env.EXPIRATION_DATA_ACCESS_TOKEN_KEY , jwtid:uuidv4() }  ) 
    return res.status(201).json({ massage:" access token has been refreshed " , access_token })
                
    } catch (error) {
        console.log(  "error from refresh token =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }



}



export const sign_in_gmail_service = async ( req , res ) =>{
    
    try {

    const { idToken } = req.body


    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const { email_verified , email } = payload;
    
    if (email_verified !== true) { return res.status(404).json({ message :" login has been failed "  })}

    const User = await  user_model.findOne({ email })
    if (!User) { return res.status(404).json({ message :" user not found"  })}
    // console.log(User);
    

    const access_token = jwt.sign( {email:email , _id :User?._id } , process.env.ACCESS_TOKEN_KEY , { expiresIn :process.env.EXPIRATION_DATA_ACCESS_TOKEN_KEY , jwtid:uuidv4()}  )
    const refresh_token = jwt.sign( {email:email , _id :User?._id } , process.env.REFRESH_TOKEN_KEY , { expiresIn :process.env.EXPIRATION_DATA_REFRESH_TOKEN_KEY , jwtid:uuidv4()}  )

    return res.status(200).json({ message :" user has been login from back " , access_token , refresh_token  })
                
    } catch (error) {
        console.log(  "error from signin gmail =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }



}




export const sign_up_gmail_service = async ( req , res ) =>{

    try {
    const { idToken } = req.body

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const { email_verified , email ,  name } = payload;

    // check if verify
    if (email_verified !== true) { return res.status(404).json({ message :" login has been failed "  })}

    // check if email is here
    const User = await  user_model.findOne({email})
    if (User) {return res.status(409).json({ message :" this email is already exists" })}

    const new_user = await user_model.create({
        name,
        isVerify : true ,
        provider : provider.GOOGLE,
        email,
        password : hashSync(uuidv4() , +process.env.SALT_SPECIAL )
    })
    return res.status(200).json({ message :" user has been signUp from back " })        


    } catch (error) {
        console.log(  "error from signup gmail =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }

}




export const sign_out_service = async ( req , res  ) => {


    try {        
    const { token }= req.login_user 
    // console.log(token , token_id);
    
    const if_log_out = await black_list_model.findOne({token_id :token.token_id , expiration_data : token.expiration_data})
    if ( if_log_out) {return res.status(404).json({massage : "this email is already signed_out"}) }

    await black_list_model.create( { token_id : token.token_id , expiration_data : token.expiration_data } )
        
    return res.status(200).json({massage : "user has been sign-out successfully"})

    } catch (error) {
        console.log(  "error from signout =======>"  , error );
        res.status(500).json({ message : "internal server error "})
    }


}