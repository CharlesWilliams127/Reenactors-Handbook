const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let KitCommentModel = {};

const KitCommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

KitCommentSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  description: doc.description,
  createdDate: doc.createdDate,
});

KitCommentModel = mongoose.model('KitComment', KitCommentSchema);

module.exports.KitCommentModel = KitCommentModel;
module.exports.KitCommentSchema = KitCommentSchema;
