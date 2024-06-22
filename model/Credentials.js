import mongoose from 'mongoose';

const credentialsSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    clientId: { type: String, required: true }, // Keeping clientId as string
    tenantId: String,
    azureClientId: String, 
    clientSecret: String,
});

const Credentials = mongoose.models.Credentials || mongoose.model('Credentials', credentialsSchema);

export { Credentials, credentialsSchema };
