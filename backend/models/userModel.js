import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type :String,
        required:true
    },
    phone: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profileImage: {
        type: String,
        default: null
    }
},  {
    timestamps:true
});
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;