const cookie = require("cookie")
const { verifySecureToken } = require("../Token/generateToken")

const socketmiddleware = async (socket, next) => {

    console.log("socket middleware running")

    try {

        const cookies = cookie.parse(
            socket.handshake.headers.cookie || ""
        )

        let { accesstoken, refreshtoken } = cookies

        if (!accesstoken && !refreshtoken) {
            return next(new Error("Token expires"))
        }

        let user;

        try {

            // pehle access token try karo
            user = verifySecureToken(accesstoken)

        } catch {

            // agar expire ho gaya to refresh token use karo
            user = verifySecureToken(refreshtoken)

        }

        socket.user = user
        

        console.log(socket.user)

        next()

    } catch (e) {

        console.log(e)

        next(new Error("Invalid Token"))
    }
}

module.exports = socketmiddleware