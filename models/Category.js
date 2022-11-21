const { Schema, model, Types } = require('mongoose')
const schema = new Schema({
  title: String,
})
module.exports = model('Category', schema)