const { Schema, model, Types, default: mongoose } = require('mongoose')
const schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: String,
}, {
  timestamps: true,

})
module.exports = mongoose.model('User', schema);
