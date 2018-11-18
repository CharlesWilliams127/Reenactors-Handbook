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

const homePage = (req, res) => {
  const search = {
    public: true,
  };

  Kit.KitModel.find(search,
    'name description kitItems startTimePeriod endTimePeriod public image owner',
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }

      return res.render('home',
        { csrfToken: req.csrfToken(),
          kits: docs, account: req.session.account });
    });
};

const viewer = (req, res) => {
  const search = {
    owner: req.query.owner,
    name: req.query.name,
    public: true,
  };

  const query = Kit.KitModel.findOne(search,
    'name description kitItems startTimePeriod endTimePeriod public image owner');

  const promise = query.exec();
  promise.then((doc) => res.json({ redirect: `/viewerPage?name=${doc.name}&owner=${doc.owner}` }));

  return promise;
};

const viewerPage = (req, res) => {
  const search = {
    owner: req.query.owner,
    name: req.query.name,
    public: true,
  };

  Kit.KitModel.find(search,
    'name description kitItems startTimePeriod endTimePeriod public image',
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }

      return res.render('viewer',
        { csrfToken: req.csrfToken(),
          kits: docs, account: req.session.account });
    });
};

const makeKit = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Kit needs a name' });
  }

  let tempPublic = true;

  if (!req.body.public) {
    tempPublic = false;
  }

  const kitData = {
    name: req.body.name,
    description: req.body.description,
    startTimePeriod: req.body.startTimePeriod,
    endTimePeriod: req.body.endTimePeriod,
    public: tempPublic,
    image: req.body.imageURL,
    owner: req.session.account._id,
  };

  const query = Kit.KitModel.findOneAndUpdate(
    { name: req.body.name, owner: req.session.account._id },
    kitData, { upsert: true });

  const kitPromise = query.exec();
  kitPromise.then(() => res.json({ redirect: '/maker' }));

  kitPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occured' });
  });

  return kitPromise;
};

const addKitItem = (req, res) => {
  if (!req.body.itemName) {
    return res.status(400).json({ error: 'Kit Item needs a name' });
  }

  const deleteFilter = {
    name: req.body.parentKit,
    owner: req.session.account._id,
  };

  const kitItemData = {
    name: req.body.itemName,
    description: req.body.itemDescription,
    price: req.body.itemPrice,
    links: req.body.Link,
    image: req.body.itemImageURL,
  };

  const pullQuery = Kit.KitModel.update(
    deleteFilter,
    { $pull: { kitItems: { name: req.body.itemName } } }
  );

  const pullPromise = pullQuery.exec();
  pullPromise.then(() => {
    console.log(req.body);

    const query = Kit.KitModel.findOneAndUpdate(
      { name: req.body.parentKit },
      { $push: { kitItems: kitItemData } }
    );

    const promise = query.exec();
    promise.then(() => res.json({ redirect: '/maker' }));

    promise.catch((err) => {
      console.log(err);
      return res.status(400).json({ error: 'An error occured pushing' });
    });

    return promise;
  });

  pullPromise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occured pulling' });
  });
  return pullPromise;
};

const deleteKit = (req, res) => {
  const deleteFilter = {
    name: req.body.itemToDelete,
    owner: req.session.account._id,
  };

  const query = Kit.KitModel.deleteOne(
    deleteFilter
  );

  const promise = query.exec();

  promise.then(() => res.json({ redirect: '/maker' }));

  promise.catch((err) => {
    console.log(err);
    return res.status(400).json({ error: 'An error occured' });
  });

  return promise;
};

const deleteKitItem = (req, res) => {
  const deleteFilter = {
    name: req.body.parentKit,
    owner: req.session.account._id,
  };

  console.log(deleteFilter);
  console.log(req.body.itemToDelete);
  const query = Kit.KitModel.update(
    deleteFilter,
    { $pull: { kitItems: { name: req.body.itemToDelete } } }
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
module.exports.homePage = homePage;
module.exports.viewer = viewer;
module.exports.viewerPage = viewerPage;
module.exports.deleteKit = deleteKit;
module.exports.deleteKitItem = deleteKitItem;
// module.exports.itemMakerPage = itemMakerPage;
