import { authentication_middleware } from "../middlewares/auth_middleware.js"

const socket_connection = new Map() 


export const register_socket = async ( handshake , id ) =>{

    
           // get the data form the auth
            const access_token = handshake.auth.access_token
            const user = await authentication_middleware(access_token)
    
            
            // set the socket id into the map
            socket_connection.set( user._id.toString() , id    )

            // log  the done
            console.log(socket_connection  ,  "the user id has been set ( socket )"  );
            return "the user id has been set ( socket )"


}

export const RemoveConnection = async ( socket ) =>{

    return IO.on( "disconnect" , async (  ) =>{ // will disconnect if there is any dis connect happen  

        // get the user data form the auth 
        const access_token = socket.handshake.auth.access_token
        const user = await authentication_middleware(access_token)
        
        //delete the id form the socket connection map
        socket_connection.delete( user._id.toString()  )

        // log  the done
        console.log(socket_connection , "the user has been deleted  ( socket )"  );
        return "the user has been deleted  ( socket )"
    } )

}

export const establishConnection = (IO) =>{

    return IO.on( "connection"  ,async (socket)  =>{ 
    
            console.log("the user in connected to socket" ,   /* socket */ )

            
            await register_socket(socket.handshake , socket.id )
            await RemoveConnection(socket  )




            // ==================== test socket ==============
            // socket.on( "sendmsg" , (data) => { console.log( data );}  )
    
            //  socket.emit( "res" , " data form the back "  )
            //  socket.broadcast.emit( "res" , "test for IO"  ) // work with one id for the sender
             
            //  IO.emit( "res" , "test for IO"  )
    
            // socket.join("room1")
            // socket.to("room1").emit("res" , "data for the room" ) // data going to the room but not for the sender
            // socket.except("room1").emit("res" , "data for the room" )
    

    }   )
}


