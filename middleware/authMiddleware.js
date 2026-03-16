import jwt from "jsonwebtoken"

export const authMiddleWare = async(req,res,next)=>{
    const authHeader = req.headers.authorization

    console.log(authHeader)
    


    try {
        const token = authHeader.split(" ")[1]
        req.user = jwt.verify(token,"mernstack")
        console.log(req.user)
        next()
    }
    catch(error){
        return res.status(400).json("Invalid Token")
    }
  

}