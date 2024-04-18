class AzureSubscription {

    constructor({
        subscriptionId,
        clientId,
        subscriptionName,
        serviceType,
        subscriptionStartDate,
        resources = [],
        costEstimate = 0,
        actualCost = 0,
        consumptionDetails = {},
        status,
        billingCycle,
        tags = [],
        notes,
        createdBy,
        createdAt,
        updatedBy,
        updatedAt,
        azureOffer, 
        azureProvider, 
        purchaseOrderNumber 
    }) {
        this.subscriptionId = subscriptionId;
        this.clientId = clientId;
        this.subscriptionName = subscriptionName;
        this.serviceType = serviceType;
        this.subscriptionStartDate = subscriptionStartDate;
        this.resources = resources;
        this.costEstimate = costEstimate;
        this.actualCost = actualCost;
        this.consumptionDetails = consumptionDetails;
        this.status = status;
        this.billingCycle = billingCycle;
        this.tags = tags;
        this.notes = notes;
        this.createdBy = createdBy;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.updatedBy = updatedBy;
        this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
        this.azureOffer = azureOffer;
        this.azureProvider = azureProvider;
        this.purchaseOrderNumber = purchaseOrderNumber;
    }
}
