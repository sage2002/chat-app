import jwt from "jsonwebtoken";

export const generateToken= (userId, res) => {

    //using payload(token) to differentiate the users
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"7d"  // this will sign the token with the user id and the secret key and it will expire in 7 days
    })
    //set the cookie (this will sent JWT in cookies)
    res.cookie("jwt",token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross site request forgery attacks
        secure: process.env.NODE_ENV !== "development"              //to check it is http or https (in production it will be true)
    });

    return token;
}