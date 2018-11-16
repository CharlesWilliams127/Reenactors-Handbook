const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const kitItem = require('./KitItem');


let KitModel = {};

const convertID = mongoose.Types.ObjectId;
const setStringVal = (name) => _.escape(name).trim();

const KitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setStringVal,
  },
  description: {
    type: String,
    required: false,
    trim: true,
    set: setStringVal,
  },
  // array of items that make up this kit
  kitItems: [kitItem.KitItemSchema],
  startTimePeriod: {
    type: Number,
    required: false,
  },
  // TODO: add assert that this is not less than the start time period date
  endTimePeriod: {
    type: Number,
    required: false,
  },
  // represents a string URL, probably will be hosted on Imgur for now
  image: {
    type: String,
    required: false,
  },
  // represents if a user wants their kit to appear for all users on the home page
  public: {
    type: Boolean,
    required: true,
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

KitSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  name: doc.name,
  description: doc.description,
  KitItems: doc.KitItems,
  startTimePeriod: doc.startTimePeriod,
  endTimePeriod: doc.endTimePeriod,
  public: doc.public,
  image: doc.image,
  owner: doc.owner,
});

KitSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return KitModel.find(search)
  .select('name description kitItems startTimePeriod endTimePeriod public image')
  .exec(callback);
};

KitModel = mongoose.model('Kit', KitSchema);

module.exports.KitModel = KitModel;
module.exports.KitSchema = KitSchema;
