import bcrypt from "bcryptjs"
import { User } from "../model/user.js"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {

    try {
        const { fullName, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            fullName: req.body.fullName,  //also this
            email: email,  // can also do this
            password: hashedPassword
        })


        res.json({
            message: "User created Successfully",
            user: {
                email: user.email,
                fullName: user.fullName
            }
        })
        // const fullName = req.body.fullName // old way
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email: email })
        if (!existingUser) {
            return res.status(500).json("User not found")
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if (!isMatch) {
            return res.status(500).json("Wrong credentials")
        }
        else {


            const token = jwt.sign({
                _id: existingUser._id,
                email: existingUser.email
            }, "mernstack"

                // {expiresIn: "1h"}
            )

            res.status(200).json({
                message: "User Logged in Successfully",
                user: {
                    email: existingUser.email,
                    fullName: existingUser.fullName
                },
                token: token

            })
        }




    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
