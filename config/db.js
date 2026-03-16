import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://admin:admin@blogmanagement.vdc6ssw.mongodb.net/?appName=Blogmanagement'
        );
        console.log("MongoDB Connected ✅");
    } catch (error) {
        console.log("Database Connection Failed ❌");
    }
};