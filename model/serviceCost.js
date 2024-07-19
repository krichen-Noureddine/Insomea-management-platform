import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const costDataSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
        subscriptionId: String,
    cost: Number,
    usage: Number,
    date: Date,
    service: String,
    resourceLocation: String,
    category: String,
    subscriptionName: String,
    currency: String
}, {
    versionKey: false
});

const ServiceCost = mongoose.models.ServiceCost || mongoose.model('ServiceCost', costDataSchema);

export default ServiceCost;
