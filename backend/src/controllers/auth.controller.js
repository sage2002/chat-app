import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

export const signup = async (req,res) => {
    const {fullName,email,password} = req.body
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters" });
        }
        //to check for the login that the user is already exist or not
        const user = await User.findOne({email})

        if (user) return res.status(400).json({ message: "Email already exist"});

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        });

        if(newUser) {
            //generate jwt token here
            generateToken(newUser._id,res) //(res) sent the cookie in response
            await newUser.save(); 
            
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data"});
        }

    } catch (error) {
        console.log("Error in sigup controller", error.message);
        res.status(500).json({ message: "Internal server error"});

    }
};

export const login = async (req,res) => {
    const { email,password } = req.body
    try {
        const user = await User.findOne({email})

        if(!user)

    } catch (error){

    }
};

export const logout = (req,res) => {
    res.send("logout route");
};