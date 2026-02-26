import app from "./app.js"
import dbConnect from "./db/index.js"
import dotenv from 'dotenv'

dotenv.config({
    path:"./.env"
})

const port = process.env.PORT || 3000

dbConnect()
    .then(() => {
        app.listen(port, () => {
            console.log(`server is listening at http://localhost:${port}`)
        })
    })
    .catch((error) => {
        console.log("mongodb connection failled:", error)
        process.exit(1)
    })