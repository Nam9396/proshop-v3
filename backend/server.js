import path from 'path';
import express, { urlencoded } from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import dotenv from 'dotenv'; dotenv.config();
import productRouter from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadeRoutes.js';
const PORT = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(cookieParser());
// app.use(cors());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow requests from any origin
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
//   res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
//   res.header('Access-Control-Allow-Credentials', true);
//   next();
// })
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

app.get('/api/config/paypal', (req, res, next) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID }); 
})

const __dirname = path.resolve();
const pathName = path.join(__dirname);
// app.use('/uploads/image', express.static(pathName));
app.use(express.static(pathName)); // do req.file.path la toan bo absolute path den anh cu the nen: root duoc coi la root cua project

if (process.env.NODE_ENV === 'production') { 
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.use('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
} else { 
  app.get('/', (req, res, next) => {
    res.send('API is running...');
  })
}

//path.join thuong dung cho relative path
//path.resolve thuong dung cho absolute path

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`server is listening on PORT: ${PORT} ${pathName}`);
});