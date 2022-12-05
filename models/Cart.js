const { Schema, model, Types, default: mongoose } = require('mongoose')
const schema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  priceStock: { type: Number },
  discount: { type: Number },
  stock: { type: Number },
  countStorage: { type: Number },
  countCart: { type: Number },
  image: {
    type: String,
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})
module.exports = mongoose.model('Cart', schema)