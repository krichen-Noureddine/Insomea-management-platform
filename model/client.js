import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  clientId: String,
  companyName: { type: String, required: true, minlength: 3 },
  industry: String,
  contactName: { type: String, required: true },
  contactEmail: { type: String, required: true, match: /\S+@\S+\.\S+/ }, // Validation d'email
  contactPhone: { type: String, required: true, match: /^[0-9]{8,15}$/ }, // Exemple de validation pour numéro de téléphone
  clientLocation: { type: String, required: true },
  clientAddress: String,
  azureSubscriptionIds: [String],
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  serviceTier: String,
  billingAddress: String,
  paymentTerms: String,
  billingContact: String,
  currentBalance: Number,
  invoiceHistory: [String],
  usageMetrics: mongoose.Mixed,
  consumptionAlerts: [mongoose.Mixed],
  supportTicketHistory: [String],
  communicationPreferences: mongoose.Mixed,
  azureTenantId: String,
  organizationType: {
    type: String,
    enum: ['SMB', 'CORPORATE', 'Government', 'Government', 'Other'],
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  domains: [String],
  createdClientDateTime: {
    type: Date,
    required: true
  },
  businessPhones: [String],
  city: String,
  country: String,
  countryLetterCode: String,
  createdDateTime: Date,
  defaultUsageLocation: String,
  displayName: String,
  isMultipleDataLocationsForServicesEnabled: Boolean,
  marketingNotificationEmails: [String],
  onPremisesLastSyncDateTime: Date,
  onPremisesSyncEnabled: Boolean,
  partnerTenantType: String,
  postalCode: String,
  preferredLanguage: String,
  securityComplianceNotificationMails: [String],
  securityComplianceNotificationPhones: [String],
  state: String,
  street: String,
  technicalNotificationMails: [String],
  tenantType: String,
  updatedTimestamp: {
    type: Date,
    default: Date.now,
  },
});


// Adding a method to the schema
clientSchema.methods.addMo365License = function (license) {
  this.azureSubscriptionIds.push(license); // Assuming you want to push this to the subscription IDs
};

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default Client;
