
export const gender = {
    MALE : "male",
    FEMALE : "female",
    PRIVATE : "private"
}

export const system_role = {
    USER : "user",
    ADMIN : "admin",
    SUPER_ADMIN :"super-admin"
}
const { USER , ADMIN ,SUPER_ADMIN  } = system_role

export const ADMIN_USER = [ADMIN, USER  ]
export const SUPER_USER_ADMIN = [  SUPER_ADMIN , ADMIN ]
export const SUPER_ADMIN_USER = [ SUPER_ADMIN, USER  ]


export const  provider = {
    SYSTEM:"system",
    GOOGLE : "google",
    GMAIL : "gmail"
} 


export const ImageExtensions = ['image/jpg' , 'image/jpeg',  'image/png']
export const VideoExtensions = [ ' video/mp4' , 'video/avi' ,'Video/mov' ]
export const DocumentExtensions = [ 'application/pdf' , 'application/json' , 'application/javascript' ]


export const reacts_types = { // must to be in schema model
    LIKE : "like",
    LOVE : "love" ,
    HAHA : "haha" ,
    SAD : "sad",
    WOW :"wow" ,
    ANGRY :"angry"
}