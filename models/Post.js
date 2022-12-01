const { Schema, model, Types, default: mongoose } = require('mongoose')
const schema = new Schema({
  title: { type: String, required: true, unique: true },
  text: { type: String, required: true },
  avatarUrl: String,
  viewsCount: {
    type: Number,
    default: 0
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true,

})
module.exports = mongoose.model('Post', schema);
