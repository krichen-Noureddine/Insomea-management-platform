import mongoose from 'mongoose';

const costDataSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    subscriptionId: String,  // Add subscription ID to the schema
    cost: Number,
    usage: Number,
    date: Date,
    service: String,
    resourceGroup: String,
    location: String,
    currency: String
}, {
    versionKey: false  // Disable versioning
});

costDataSchema.index({ date: 1, service: 1, resourceGroup: 1, subscriptionId: 1 }, { unique: true });
// Added subscriptionId to the unique index to ensure uniqueness across different subscriptions

const ServiceCost = mongoose.models.ServiceCost || mongoose.model('ServiceCost', costDataSchema);

export default ServiceCost;
