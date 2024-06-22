
const mongoose = require('mongoose');

const ResourceCost = mongoose.model('ResourceCost', new mongoose.Schema({
    cost: Number,
    usage: Number,
    date: Date,
    resource: String,
    resourceGroup: String,
    location: String,
    currency: String
}));

module.exports = {
    
    ResourceCost
};