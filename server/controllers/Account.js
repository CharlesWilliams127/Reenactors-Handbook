const models = require('../models');
const Account = models.Account;

// function for rendering login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// function for rendering signup page
const signupPage = (req, res) => {
  res.render('signup', { csrfToken: req.csrfToken() });
};

// function for rendering change password page
const changePassPage = (req, res) => {
  res.render('changePass', { csrfToken: req.csrfToken() });
};

// function for rendering logout page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// function responsible for logging the user in
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

// function responsible for registering a new user
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/home' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// function responsible for changing a user's password
const changePass = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;
  const newPassword = `${req.body.newPass}`;

  if (!username || !password || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    return Account.AccountModel.generateHash(newPassword, (salt, hash) => {
      console.log(username);
      const query = Account.AccountModel.findOneAndUpdate(
        { username },
        { salt, password: hash },
        { new: true }
      );

      const updatePassPromise = query.exec();
      updatePassPromise.then((doc) => {
        req.session.account = Account.AccountModel.toAPI(doc);
        res.json({ redirect: '/home' });
      });

      updatePassPromise.catch((updateErr) => {
        console.log(updateErr);
        return res.status(400).json({ error: 'An error occured' });
      });

      return updatePassPromise;
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.changePass = changePass;
module.exports.changePassPage = changePassPage;
module.exports.getToken = getToken;
