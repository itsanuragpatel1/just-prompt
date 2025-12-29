import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: { type: String, trim: true },
    email: { type: String, trim: true, unique: true, index: true, required: true },
    password: { type: String},
    avatar: { type: String },
    plan: { type: String, enum: ["free", "freemium", "premium"], default: "free" },
    imageCredits : {type:Number,default : 3},
    refreshToken: String
}, { timestamps: true })

const userModel = mongoose.model("user", userSchema);

export { userModel }