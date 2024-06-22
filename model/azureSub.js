import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },

  subscriptionId: { type: String, required: true },
  clientId: { type: String, required: true },
  subscriptionName: { type: String },
  serviceType: { type: String },
  subscriptionStartDate: { type: Date },
  resources: { type: Array, default: [] },
  costEstimate: { type: Number, default: 0 },
  actualCost: { type: Number, default: 0 },
  consumptionDetails: { type: Object, default: {} },
  status: { type: String },
  billingCycle: { type: String },
  tags: { type: Array, default: [] },
  notes: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
  azureOffer: { type: String },
  azureProvider: { type: String },
  purchaseOrderNumber: { type: String },
  authorizationSource: { type: String },
  subscriptionPolicies: { type: Object },
});

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
