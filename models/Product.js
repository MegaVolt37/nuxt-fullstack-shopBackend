const { Schema, model, Types, default: mongoose } = require('mongoose')
const schema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  priceStock: { type: Number },
  discount: { type: Number },
  stock: { type: Number },
  article: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  country: { type: String, required: true },
  weight: { type: String, required: true },
  image: {
    type: String,
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,

})
module.exports = mongoose.model('Product', schema)