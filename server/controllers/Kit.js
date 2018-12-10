const models = require('../models');

const Kit = models.Kit;

// function for rendering the making kits page
const makerPage = (req, res) => {
  Kit.KitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), kits: docs });
  });
};

// function for rendering the home page with all public kits
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

// function for adding or editing a kit
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

// function for adding or editing a kit item
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
      { name: req.body.parentKit,
        owner: req.session.account._id },
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

// function for deleting a kit and its associated items
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

// function for deleting an individual kit item
const deleteKitItem = (req, res) => {
  const deleteFilter = {
    name: req.body.parentKit,
    owner: req.session.account._id,
  };

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

const getKits = (req, res) => {
  let search = {};
  console.log(req.query.name);

  // search through the DB using Regex
  if(req.query.name) {
    search = {
      public: true,
      name: new RegExp(req.query.name, 'i')
    };
  }
  else {
    search = {
      public: true,
    };
  }

  return Kit.KitModel.find(search,
    'name description kitItems startTimePeriod endTimePeriod public image owner',
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }

      console.log(docs);

      return res.json(
        { kits: docs });
    });
};

// function for rendering an individual kit
const getKitByOwner = (req, res) => {
  const search = {
    owner: req.query.owner,
    name: req.query.name,
    public: true,
  };

  Kit.KitModel.find(search,
    'name description kitItems startTimePeriod endTimePeriod public image',
    (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occured' });
      }

      return res.json(
        { kit: doc });
    });
};

const getKitsByOwner = (req, res) => {
  return Kit.KitModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ kits: docs });
  });
}

module.exports.makerPage = makerPage;
module.exports.make = makeKit;
module.exports.addKitItem = addKitItem;
module.exports.homePage = homePage;
module.exports.deleteKit = deleteKit;
module.exports.deleteKitItem = deleteKitItem;
module.exports.getKits = getKits;
module.exports.getKitByOwner = getKitByOwner;
module.exports.getKitsByOwner = getKitsByOwner;
