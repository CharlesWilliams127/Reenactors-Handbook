const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let KitItemModel = {};

const convertID = mongoose.Types.ObjectId;
const setStringVal = (name) => _.escape(name).trim();

const KitItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setStringVal,
  },
  description : {
    type: String,
    required: true,
    trim: true,
    set: setStringVal,
  },
  price: {
    type: Number,
    required: false,
  },
  // how to make this item, if applicable
  recipeSteps: [{
    type: String,
    trim: true,
    set: setStringVal,
    }],
  // represents a string URL, probably will be hosted on Imgur for now
  image: {
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

KitItemSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  name: doc.name,
  description: doc.description,
  price: doc.price,
  recipeSteps: doc.recipeSteps,
  image: doc.image,
});

KitItemSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return KitItemSchema.find(search).select('name description price recipeSteps image').exec(callback);
};

KitItemModel = mongoose.model('KitItem', KitItemSchema);

module.exports.KitItemModel = KitItemModel;
module.exports.KitItemSchema = KitItemSchema;
