import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const TotalCostSchema = new Schema({
    clientId: {
        type: String,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
   
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Check if the model already exists before defining it
const TotalCost = models.TotalCost || model('TotalCost', TotalCostSchema);

export default TotalCost;
