import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../Models/User.js" 

// registering users

export const register = async(req,res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            location,
            occupation,
            friends,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            picturePath,
            location,
            occupation,
            friends,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

// logging in
export const login = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if (!user) return res.status(400).json({msg: "user does not exist"})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({msg: "incorrect credentials has been entered"})

        const token = Jwt.sign({id: user._id}, process.env.JWT_SECRET)

        delete user.password
        res.status(200).json({token, user})

    } catch (err) {
     res.status(500).json({error: err.message})
    }
}