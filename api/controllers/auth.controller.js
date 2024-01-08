import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ mesage: "user created " });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(403, "wrong credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const oneWeekInSeconds = 7 * 24 * 60 * 60; // 7 days in seconds

    const expiryDate = new Date();
     expiryDate.setTime(expiryDate.getTime() + oneWeekInSeconds * 1000);
    res
      .cookie("access_token", token, { httpOnly: true, expires:expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};


export const google= async (req,res,next)=>{
  try {
    const user = await User.findOne({email:req.body.email})
        if(user){
          const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
          const{password:hashedPassword,...rest}= user._doc
          const oneWeekInSeconds = 7 * 24 * 60 * 60; 
          const expiryDate = new Date();
     expiryDate.setTime(expiryDate.getTime() + oneWeekInSeconds * 1000);
     res
     .cookie("access_token", token, { httpOnly: true, expires:expiryDate }).status(200).json(rest)
     
        } else{
          const generatedPassword = Math.random().toString(36).slice(-8) +  Math.random().toString(36).slice(-8)
          const hashedPassword = bcryptjs.hashSync(generatedPassword,10)
          const newUser = new User({
            username:req.body.name.split(" ").join("").toLowerCase() + Math.floor(Math.random()*10000).toString(),
            email:req.body.email,
            password:hashedPassword,
            profilePicture:req.body.photo

          })
  await newUser.save()
  const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
  const {password:hashedPassword2,...rest}=newUser._doc
  const oneWeekInSeconds = 7 * 24 * 60 * 60; 
  const expiryDate = new Date();
     expiryDate.setTime(expiryDate.getTime() + oneWeekInSeconds * 1000);
     res
     .cookie("access_token", token, { httpOnly: true, expires:expiryDate }).status(200).json(rest)
     

        }   
  } catch (error) {
    next(error)
  }
}
