import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,  // Connection timeout in milliseconds
    socketTimeoutMS: 45000,   // Socket timeout in milliseconds
    retryWrites: false,       // Disable retryWrites for Cosmos DB compatibility
    maxIdleTimeMS: 120000,    // Set maximum idle time for connections
    ssl: true,                // Enable SSL for secure connection (important for Cosmos DB)
    authSource: 'admin',      // Often required for authentication in Cosmos DB
    appName: '@imp12@'          // Custom application name for tracking
};

if (!uri) {
    throw new Error('Add Mongo URI to .env.local');
}

let clientPromise;

if (process.env.NODE_ENV === 'development') {
    console.log('Connecting to MongoDB in development mode...');
    if (!global._mongooseClientPromise) {
        global._mongooseClientPromise = mongoose.connect(uri, options);
    }
    clientPromise = global._mongooseClientPromise;
} else {
    console.log('Connecting to MongoDB in production mode...');
    clientPromise = mongoose.connect(uri, options);
}

clientPromise.then(() => console.log('MongoDB Connected via Mongoose'))
             .catch(err => console.error('MongoDB connection error:', err));

export default clientPromise;
