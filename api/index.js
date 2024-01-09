import express from "express"
import mongoose from "mongoose"
import  dotenv from "dotenv"
dotenv.config()
import userRoutes from "./routes/userRoute.js"
import authRoutes from "./routes/user.auth.js"
import cookieParser from "cookie-parser"


mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to the db")
}).catch((error)=>{
    console.log(error)
})

const app = express()

app.use(express.json())
app.use(cookieParser())

app.listen(3000,()=>{
    console.log(`server listening on port:3000!!`)
})

app.use("/api/user", userRoutes)
app.use("/api/auth",authRoutes)
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.mesage || "Internal Server Error"
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    })
})