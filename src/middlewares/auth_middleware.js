import  jwt  from 'jsonwebtoken';
import  user_model  from '../DB/models/users_model.js';
import black_list_model from '../DB/models/black_list_token_model.js';




export const authentication_middleware =  (socketToken = null ) =>{
    if (socketToken) { return validationUserToken(socketToken)  }
    return async ( req , res , next ) =>{

        // the validation user token for the socket io
          const validationUserToken =  async (  access_token ) =>{
        
            
                    // decode the data
                    const decoding_access_token = jwt.verify(access_token , process.env.ACCESS_TOKEN_KEY)
        
                    // check if in black list
                    const if_black_list = black_list_model.findOne({token_id:decoding_access_token.jti})
                    if (!if_black_list) {return res.status(401).json({ message :"this token is expired please login again"  }) }
        
                    // find the data
                    const User = await user_model.findById(decoding_access_token._id , "-password -__v")
                    if (!User) { return res.status(404).json({ message :"this user is not found" }) }
                    // console.log( User._doc );
                    
                    return { ...User._doc , token:{  token_id:decoding_access_token.jti , expiration_data:decoding_access_token.exp } }
        }



        try {
            const { access_token } = req.headers

            if (!access_token ) { return res.status(401).json({ message :"please login first"  }) } 


            req.login_user = await validationUserToken(access_token)

            next()
        } catch (error) {
            console.log(  "internal authentication middleware error" , error );
            res.status(500).json({ message : "internal authentication middleware error " , error })
        }

    }
}



export const authorization_middleware = (allow_role) =>{
    return async ( req , res , next ) =>{
 
        try {
            
            const { role:login_user_role } = req.loginUser


            const is_user_allowed = allow_role.includes(login_user_role)
            if (!is_user_allowed) { return res.status(401).json({ message :"unauthorized" }) }
            
            next()
        } catch (error) {
            console.log(  "internal authorization middleware  error" , error );
            res.status(500).json({ message : "internal authorization middleware  error" , error })
        }

    }
}