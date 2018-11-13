const models = require('../models');

const Kit = models.Kit;

const makerPage = (req, res) => {
  Kit.KitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), kits: docs });
  });
};

// const itemMakerPage = (req, res) => {
//   Kit.KitModel.findByOwner(req.session.account._id, (err, docs) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ error: 'An error occured' });
//     }
//     return res.render('app', { csrfToken: req.csrfToken(), kits: docs });
//   });
// };

const makeKit = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Kit needs a name' });
  }
  // if ((req.body.startTimePeriod && req.body.endTimePeriod)
  // && (req.body.endTimePeriod < req.body.startTimePeriod)) {
  //   return res.status(400).json({ error: 'Kit\'s start period cannot be before its end period' });
  // }
  // TODO: add check for that start time period is before end time period

  const kitData = {
    name: req.body.name,
    description: req.body.description,
    startTimePeriod: req.body.startTimePeriod,
    endTimePeriod: req.body.endTimePeriod,
    owner: req.session.account._id,
  };

  const newKit = new Kit.KitModel(kitData);
  const kitPromise = newKit.save();
  kitPromise.then(() => res.json({ redirect: '/maker' }));

  kitPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Kit already exists' });
    }
    return res.status(400).json({ error: 'An error occured' });
  });

  return kitPromise;
};

const addKitItem = (req, res) => {
  if (!req.body.itemName) {
    return res.status(400).json({ error: 'Kit Item needs a name' });
  }

  const kitItemData = {
    name: req.body.itemName,
    description: req.body.itemDescription,
    price: req.body.itemPrice,
    links: req.body.Link,
  }

  const query = Kit.KitModel.findOneAndUpdate(
    { name: req.body.parentKit },
    {$push: {kitItems: kitItemData}}
  );

  const promise = query.exec();
  promise.then(() => res.json({ redirect: '/maker' }));

  promise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occured' });
  });

  return promise;
};

module.exports.makerPage = makerPage;
module.exports.make = makeKit;
module.exports.addKitItem = addKitItem;
// module.exports.itemMakerPage = itemMakerPage;
