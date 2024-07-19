import mongoose from 'mongoose';

const { Schema } = mongoose;

const HistoriqueSchema = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    ref: 'Client', // Refers to the Client model
    required: true,
  },
  subscription_id: {
    type: String,
    required: true,
  },
  subscription_name: {
    type: String,
  },
  cost: {
    type: Number,
    required: true,
  },
  usage: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  resource_location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

HistoriqueSchema.index({ client_id: 1, subscription_id: 1, date: 1 }, { unique: true });

export default mongoose.models.Historique || mongoose.model('Historique', HistoriqueSchema);
