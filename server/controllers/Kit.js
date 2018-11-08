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

const makeKit = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Kit needs a name' });
  }
  if ((req.body.startTimePeriod && req.body.endTimePeriod)
  && (req.body.endTimePeriod < req.body.startTimePeriod)) {
    return res.status(400).json({ error: 'Kit\'s start period cannot be before its end period' });
  }
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

module.exports.makerPage = makerPage;
module.exports.make = makeKit;
