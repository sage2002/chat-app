import cloudinary from "../lib/cloudinary.js";
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

        if(!user){
            return res.status(400).json({ message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password) 
        //ispasswordCorrect is a boolean variable which is either goona be true or false
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials"});
        }

        generateToken(user._id,res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error){
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error"});

    }
};

export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"});
        
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error"});
        
    }
};


export const updateProfile = async (req,res) => {
    try {
        const {ProfilePic} = req.body
        const userId = req.user._id

        if(!ProfilePic) {
            return res.status(400).json({ message: "Profile pic required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})
        
        res.status(200).json(updatedUser)
    } catch (error) {
       console.log("error in update profile:", error);
       res.status(500).json({ message:"Internal server error"}); 
    }
};

//this is to check if the user is authenticated or not when the user refreshed the page
export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
};