import mongoose from "mongoose";
const dbConnect = async () => {
    try {
        console.log("hello",process.env.MONGO_URL)
        const db = await mongoose.connect(process.env.MONGO_URL)
        console.log(`mongodb connected successfully.\nDatabase host:${db.connection.host}`)
    } catch (error) {
        throw error
    }
}

export default dbConnect