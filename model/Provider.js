// models/Provider.js
class Provider {
    constructor({ name, contactEmail, contactPhone, azureSubscriptions = [] }) {
        this.name = name;
        this.contactEmail = contactEmail;
        this.contactPhone = contactPhone;
        this.azureSubscriptions = azureSubscriptions; // Assuming an array of Azure Subscription IDs or objects
    }


}

module.exports = Provider;