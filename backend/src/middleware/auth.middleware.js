import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


//next function will call the updateprofile after succesful authentication
export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({ message: "Unauthorized, No token provided"});
        }
        //jwt value (user id) decode it and to decode it we have to use the same secret
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded) {
            return res.status(401).json({ message: "Unauthorized, Invalid token"});
        }
        //find the user by id and deselect the password
        const user = await User.findById(decoded.userId).select("-password");

        if(!User) {
            return res.status(404).json({ message: "Unauthorized, User not found"});
        }

        req.user = user

        next()


        
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
};
