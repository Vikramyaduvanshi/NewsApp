const predictorresult = require("../pricepredcition/Mainpredictor")

function chatSocket(io, socket) {

    socket.on("send_message", async(data) => {

        console.log("send message ayi frontend se", data)

        console.log("socket id", socket.id)
  

// yha pr vo data bhi send krna hai jisko analyse krke ye predictor bna hai
        let res = await predictorresult(
            data.text.trim()
        )

        console.log("result in chatsocket", res)

        let response = {
            ...res,
            time: new Date().toLocaleTimeString(),
            sender: "ai"
        }

        socket.emit("receive_message", response)

    })

}

module.exports = chatSocket