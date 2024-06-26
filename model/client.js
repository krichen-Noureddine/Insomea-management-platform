import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  
  clientId: String,
  companyName: String,
  industry: String,
  contactName: String,
  contactEmail: String,
  contactPhone: String,
  clientLocation: String,
  clientAddress: String,
  azureSubscriptionIds: [String],
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  serviceTier: String,
  billingAddress: String,
  paymentTerms: String,
  billingContact: String,
  currentBalance: Number,
  invoiceHistory: [String], // Assuming invoiceHistory is an array of strings
  usageMetrics: mongoose.Mixed, // Use mongoose.Schema.Types.Mixed if the structure is not fixed
  consumptionAlerts: [mongoose.Mixed], // Mixed type for flexibility
  supportTicketHistory: [String],
  communicationPreferences: mongoose.Mixed,
  azureTenantId: String,
  organizationType: {
    type: String,
    enum: ['SMB', 'CORPORATE', 'NGO', 'Government', 'Other'], // Built-in enum validation
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  domains: [String],
  createdClientDateTime: {
    type: Date,
    required: true // Ensuring the field is required
},
  // Adding new fields
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

});

// Adding a method to the schema
clientSchema.methods.addMo365License = function (license) {
  this.azureSubscriptionIds.push(license); // Assuming you want to push this to the subscription IDs
};

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

export default Client;
