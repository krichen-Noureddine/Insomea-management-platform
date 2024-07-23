import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('MongoDB URI:', process.env.MONGODB_URI); // Should print your MongoDB URI


const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: false,
  maxIdleTimeMS: 120000,
  ssl: true,
  authSource: 'admin',
  appName: '@imp12@',
};

if (!uri) {
  throw new Error('Add Mongo URI to .env.local');
}

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongooseClientPromise) {
    global._mongooseClientPromise = mongoose.connect(uri, options);
  }
  clientPromise = global._mongooseClientPromise;
} else {
  clientPromise = mongoose.connect(uri, options);
}

clientPromise.then(() => console.log('MongoDB Connected via Mongoose'))
             .catch(err => console.error('MongoDB connection error:', err));

export default clientPromise;
