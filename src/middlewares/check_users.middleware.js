import user_model from "../DB/models/users_model.js"


export const checkUsers_middleware =  ( )=>{

return async (req , res ,next)=> {

    const tags = req.body.tags ? req.body.tags : false 
    const  mentions = req.body.mentions ? req.body.mentions : false
 
    if (tags?.length || mentions?.length) {
       const users = await user_model.find({_id :{ $in: tags || mentions}} ) 

       if (
        (tags && tags.length !== users.length) ||
        (mentions && mentions.length !== users.length)
       ) {

        return res.status(400).json({message : " invalid users tags or mentions "})
       }
    

    }

    next()
}

}