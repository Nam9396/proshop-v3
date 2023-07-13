import mongoose from "mongoose";
import color  from "colors";
import dotenv from 'dotenv';
dotenv.config();
import users from './data/users.js';
import products from "./data/products.js";
import User from "./model/userModel.js";
import Product from './model/productModel.js';
import Order from './model/orderModel.js';
import connectDB from "./config/db.js";


connectDB();

const importData = async() => {
  try { 
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    const createdUser = await User.insertMany(users);
    const adminUser = createdUser[0]._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    });

    await Product.insertMany(sampleProducts);

    console.log('Data imported'.green.inverse)
    process.exit();
  } catch (error) { 
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
}

const destroyData = async() => {
  try { 
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Data destroyed'.red.inverse)
    process.exit();
  } catch (error) { 
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }   
}

if (process.argv[2] === '-d') { 
  destroyData();
} else { 
  importData();
}
