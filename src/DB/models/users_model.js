import  mongoose  from 'mongoose';
import { gender, provider, system_role } from '../../constants/constant.js';
import { hashSync } from 'bcrypt';
import { encryption } from '../../utils/encryption.utils.js';
import { cloudinary } from '../../config/cloudinary.config.js';


 

const  user_schema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:[true , "the name must to be unique"],
        lowercase:true,
        trim:true,
        minLength:[4 , "this name is too short"],
        maxLength:[22 , "this name is too long"]
    },
    email:{
        type:String,
        unique:[true , "the email must to be unique"],
        require:true
    },
    password:{
        type:String,
        require:true
    },
    gender : {
        type :String ,
        default : gender.PRIVATE ,
        enum : Object.values(gender)
    },
    phone:{
        type:String,
        require:[true ,"phone number is require" ]
    },
    DOB:{
        type:Date,
        default:Date.now()
    },
    role:{ 
        type:String,
        default:system_role.USER ,
        enum: Object.values(system_role)
    },
    isVerify:{
        type :Boolean,
        default: false
    },
    isDeactivated :{
        type:Boolean,
        default:false
    },
    profilePicture :{
        public_id : String,
        secure_url : String, 
        folderId : String 
    },
    coverPicture :{
        images :[
             {public_id : String,
        secure_url : String }
    ],
        folderId : String 
},
    provider:{
        type: String,
        default:provider.SYSTEM ,
        enum: Object.values(provider) // just for test now ["google" , "system" ]

    },
    isPublic : {
        type:Boolean,
        default:false
    },
    OTP:Number
},{timestamp:true  })

//  ================================= for the hooks middleware ===============================


//================= the signup ============
user_schema.pre("save" , async function() {
    // console.log( "hook test"  , this )

    const changes = this.getChanges()["$set"]

    if (changes?.password) { this.password =  await  hashSync(this.password , +process.env.SALT) }
    if (changes?.phone) { this.phone =  await encryption({value:this.phone , secret_key:process.env.PHONE_SECRET_KEY}  ) }
    console.log( "this is the data hook" , this.getChanges()["$set"]  );
    
} )



//================= the signin query hook test ============
user_schema.post( "findOne" , {document : true , query : false}  , async function () {
    console.log( "signin test"  , this );
    
}  )

//================= delete account document hook ============
user_schema.post( "findOneAndDelete"  , async function (doc) {
    // console.log( "doc delete account"  , this );
    
    const  ProfileFolderId = doc?.profilePicture?.folderId
    const CoverFolderId = doc?.coverPicture?.folderId

    // delete the content inside the folders
      await cloudinary().api.delete_resources_by_prefix(`${process.env.FOLDER_NAME_CLOUDINARY}/User/${CoverFolderId}` )
      await cloudinary().api.delete_resources_by_prefix(`${process.env.FOLDER_NAME_CLOUDINARY}/User/${ProfileFolderId}` )
    // console.log( delete_contents);
    
    
    // delete the files itself
     await cloudinary().api.delete_folder( `${process.env.FOLDER_NAME_CLOUDINARY}/User/${CoverFolderId}` )
     await cloudinary().api.delete_folder( `${process.env.FOLDER_NAME_CLOUDINARY}/User/${ProfileFolderId}` ) 
    
    
}  )




 const user_model =  mongoose.models.users   || mongoose.model( "users" , user_schema  )
 
 export default user_model