import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        await mongoose.connect('mongodb+srv://mauryasuman718_db_user:mauryasuman@cluster0.r6ezacr.mongodb.net/?appName=Cluster0/carrental');
        console.log("DB Connect Successfully");
    } catch (error) {
        console.warn("Database connection failed:", error.message);
        console.log("Server will continue running without database");
    }
}