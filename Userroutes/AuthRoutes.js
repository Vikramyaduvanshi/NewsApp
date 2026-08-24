let express = require("express")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")

const { Usermodel } = require("../modal/modal")
const asyncHandler = require("../utils/asyncHandler")
const { generateSecureToken } = require("../Token/generateToken")

let Userrouter = express.Router()



// ================= REGISTER =================

Userrouter.post("/register",asyncHandler(async (req, res) => {

        let { name, email, password, number } = req.body


        if (!name || !email || !password || !number) {

            let error = new Error("All fields are required")
            error.statusCode = 400

            throw error
        }


        let existingUser = await Usermodel.findOne({ email })

        if (existingUser) {

            let error = new Error("User already exists")
            error.statusCode = 409

            throw error
        }


        let hashPassword = await bcrypt.hash(password, 10)


        let newUser = await Usermodel.create({
            name,
            email,
            password: hashPassword,
            number
        })


        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })

    })
)





// ================= LOGIN =================

Userrouter.post("/login",asyncHandler(async (req, res) => {

        let { email, password } = req.body
        const isMobile = req.headers["x-platform"] === "mobile"
console.log(isMobile,email,password)

        if (!email || !password) {

            let error = new Error("Email and password required")
            error.statusCode = 400

            throw error
        }


        let user = await Usermodel.findOne({ email })

        if (!user) {

            let error = new Error("Invalid credentials")
            error.statusCode = 401

            throw error
        }


        let isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {

            let error = new Error("Invalid credentials")
            error.statusCode = 401

            throw error
        }


        let accesstoken = generateSecureToken(user)
        let refreshtoken= generateSecureToken(user)

       


if(isMobile){

   return res.json({
      success:true,
      accesstoken,
      refreshtoken
   })
}


 res.cookie("accesstoken", accesstoken, {

    httpOnly: true,

    secure: false,

    sameSite: "lax",

    maxAge: 1 * 60 * 1000

})


res.cookie("refreshtoken", refreshtoken, {

    httpOnly: true,

    secure: false,

    sameSite: "lax",

    maxAge: 7 * 24 * 60 * 60 * 1000

})

        res.status(200).json({
            success: true,
            message: "Login successful",
        })

    })
)



module.exports = Userrouter