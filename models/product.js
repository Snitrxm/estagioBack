const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
  name: { type: String, required: true},
  qtd: { type: Number, required: true, unique: true},
  price: { type: Number, required: true },
});

productSchema.index({ 'name': 'text' });

module.exports = mongoose.model('Product', productSchema);