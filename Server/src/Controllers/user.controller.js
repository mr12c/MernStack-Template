import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from './../utils/ApiResponse.js';
import jwt from "jsonwebtoken"
const Register = asyncHandler(async (req,res)=>{
    const {fullName , email, password} = req.body;
    console.log(fullName, email, password);
    if(!fullName || !email || !password){
       throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(400, "Email already exists");
    }
    const user = await User.create({fullName, email, password});
    if(!user){
        throw new ApiError(500, "Failed to register user");
    }
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) throw new ApiError(500,"User not created Sucessfully");

   return   res.status(201).json(new ApiResponse(201,{createdUser},"User registered successfully" ))
    
})


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken:accessToken, refreshToken:refreshToken}


    } catch(error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const Login = asyncHandler(async(req, res) => {
      const {email,password} = req.body;
       console.log(email,password);
      if(!email || !password) throw new ApiError(400,"all fields are required ");
      const user = await User.findOne({email});
      if(!user) throw new ApiError(400,"User not found");
      let check = await user.isPasswordCorrect(password);
      if(!check) throw new ApiError(400,"Invalid password");

      const loggedInUser = await User.findOne({email}).select("-password -refreshToken");
      const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(loggedInUser._id);

      const options = {
        httpOnly: true,
        secure: false,
      };
    
       
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
          user: loggedInUser,
          accessToken:accessToken,
          refreshToken:refreshToken,
        }, "User logged in successfully"));


     
})


const Logout = asyncHandler(async (req,res) =>{
    await User.findByIdAndUpdate(req.user._id,{$unset:{refreshToken:""}})
   
    const options = {
        httpOnly:true,
       secure:true,
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"user logged out succesfully"))
})

const refreshAccessToken = asyncHandler(
    async (req,res) =>{
  
       const incomingToken = req.cookies?.refreshToken ||  req?.header("AuthorizationRef")?.replace("Bearer ", "")
       console.log(req?.header("AuthorizationRef")?.replace("Bearer ", ""))
        
       if(!incomingToken){
          throw new ApiError(401,"Unauthorized request due to this")
       }
       const decodedToken =  jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET)
      
  try {
         const user  =  await User.findById(decodedToken._id)
         console.log(user)
         if(!user){
            throw new ApiError(401,"Invalid refresh token")
         }
         console.log(incomingToken == user.refreshToken)
      //    if(incomingToken !== user.refreshToken){
      //     throw new ApiError(401,"Refresh token is expired or used")
      // }
     const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id)
         
         const options = {
            httpOnly:true,
            secure:false
         }
         return res
         .status(200)
         .cookie("accessToken", accessToken, options)
         .cookie("refreshToken", refreshToken, options)
         .json(new ApiResponse(200, {accessToken,refreshToken,user}, "acess and refresh token generated sucsessfully"));
      }
    
  
     catch (error) {
    console.log(error)
  }
  }
  
  
  )
    

export {Register,Login,Logout,refreshAccessToken}


