import mongoose from 'mongoose';

const ServicePlanSchema = new mongoose.Schema({
  servicePlanId: String,
  servicePlanName: String,
  provisioningStatus: String,
  appliesTo: String,
}, { _id: false });

const PrepaidUnitsSchema = new mongoose.Schema({
  enabled: Number,
  suspended: Number,
  warning: Number,
  lockedOut: Number,
}, { _id: false });

const LicenseSchema = new mongoose.Schema({
  clientId: { type: String, required: true }, // Add clientId to associate licenses with clients
  accountName: String,
  accountId: String,
  appliesTo: String,
  capabilityStatus: String,
  consumedUnits: Number,
  _id: { type: String, required: true }, // Use _id as the primary key
  skuId: String,
  skuPartNumber: String,
  subscriptionIds: [String],
  prepaidUnits: PrepaidUnitsSchema,
  servicePlans: [ServicePlanSchema],
  createdDateTime: Date,
  nextLifecycleDateTime: Date,
  status: String,
  totalLicenses: Number,
  ownerId: String,
  ownerTenantId: String,
  ownerType: String,
}, { timestamps: true });

const License = mongoose.models.License || mongoose.model('License', LicenseSchema);

export default License;
