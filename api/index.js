import express from "express"
import mongoose from "mongoose"
import  dotenv from "dotenv"
dotenv.config()
import userRoutes from "./routes/userRoute.js"
import authRoutes from "./routes/user.auth.js"
import cookieParser from "cookie-parser"
import path from "path"


mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to the db")
}).catch((error)=>{
    console.log(error)
})
const __dirname = path.resolve()

const app = express()
 app.use(express.static(path.join(__dirname, "/client/dist")))
 app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "client", "dist","index.html"))
 })
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