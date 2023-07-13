import mongoose from "mongoose";

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB is connected: ${conn.connection.host}`);
    console.log(mongoose.connection.host)
    mongoose.connection.once('open', () => {
      console.log('MongoDB connection is established.');
      // Additional actions or application logic
    });
  } catch (error) {
    console.log(`Error: ${error.messsage}`)
    process.exit(1);
  }
};

export default connectDB;