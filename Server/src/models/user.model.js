import mongoose from "mongoose";
    import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

dotenv.config();
const userSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        unique:true,    
    },
    fullName:{
        type:String,
        required:true,
        maxlength:50,
    },
    password:{
        type:String,
        required:true,
        minlength:8,   
    } ,
    refreshToken:{
        type:String,
        default:undefined,
    }
},{timestamps:true});

 

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }

}); 

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


 userSchema.methods.generateAccessToken =  function (){
    console.log(process.env.ACCESS_TOKEN_SECRET)
     return    jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email
         
        }
        ,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:process.env.ACCESS_TOKEN_EXPIRY }
    )
    
    
 }
 userSchema.methods.generateRefreshToken =  function(){
    return  jwt.sign(
        {
            _id:this._id,
           

        }
        ,
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn:process.env.REFRESH_TOKEN_EXPIRY }
    )
 }

export const User = mongoose.model('User',userSchema);
