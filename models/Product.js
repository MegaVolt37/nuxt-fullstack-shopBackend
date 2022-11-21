const { Schema, model, Types } = require('mongoose')
const schema = new Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String
})
module.exports = model('Product', schema)