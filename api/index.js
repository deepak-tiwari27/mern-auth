import express from "express"
import mongoose from "mongoose"
import  dotenv from "dotenv"
dotenv.config()
import userRoutes from "./routes/userRoute.js"

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to the db")
}).catch((error)=>{
    console.log(error)
})

const app = express()
app.use("/api/user", userRoutes)

app.listen(3000,()=>{
    console.log(`server listening on port:3000!!`)
})
