class Client {
    static ORGANIZATION_TYPES = ['SMB', 'CORPORATE', 'NGO', 'Government', 'Other'];
    static STATUS_TYPES = ['Active', 'Inactive'];

    constructor({
        clientId,
        companyName,
        industry,
        contactName,
        contactEmail,
        contactPhone,
        clientLocation,
        clientAddress,
        azureSubscriptionIds,
        mo365LicenseDetails,
        subscriptionStartDate,
        subscriptionEndDate,
        serviceTier,
        billingAddress,
        paymentTerms,
        billingContact,
        currentBalance,
        invoiceHistory,
        usageMetrics,
        consumptionAlerts,
        supportTicketHistory,
        communicationPreferences,
        azureTenantId,
        organizationType,
        status,
        domains
    }) {
        // Validation example for organizationType
        if (!Client.ORGANIZATION_TYPES.includes(organizationType)) {
            throw new Error(`${organizationType} is not a valid organization type.`);
        }

        // Validation example for status
        if (!Client.STATUS_TYPES.includes(status)) {
            throw new Error(`${status} is not a valid status.`);
        }

        // Assign values after validation
        this.clientId = clientId;
        this.companyName = companyName;
        this.industry = industry;
        this.contactName = contactName;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.clientLocation = clientLocation;
        this.clientAddress = clientAddress;
        this.azureSubscriptionIds = azureSubscriptionIds;
        this.mo365LicenseDetails = mo365LicenseDetails;
        this.subscriptionStartDate = subscriptionStartDate;
        this.subscriptionEndDate = subscriptionEndDate;
        this.serviceTier = serviceTier;
        this.billingAddress = billingAddress;
        this.paymentTerms = paymentTerms;
        this.billingContact = billingContact;
        this.currentBalance = currentBalance;
        this.invoiceHistory = invoiceHistory;
        this.usageMetrics = usageMetrics;
        this.consumptionAlerts = consumptionAlerts;
        this.supportTicketHistory = supportTicketHistory;
        this.communicationPreferences = communicationPreferences;
        this.azureTenantId = azureTenantId;
        this.organizationType = organizationType;
        this.status = status;
        this.domains = domains instanceof Array ? domains : []; // Ensure domains is always an array
    }
}

module.exports = Client;
