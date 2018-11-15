const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Kit.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Kit.make);
  app.post('/addKitItem', mid.requiresLogin, controllers.Kit.addKitItem);
  // app.get('/addKitItem', mid.requiresLogin, controllers.Kit.itemMakerPage);
  app.get('/', mid.requiresSecure, controllers.Kit.homePage);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.get('/changePass', mid.requiresLogin, controllers.Account.changePassPage);
  app.get('/home', mid.requiresSecure, controllers.Kit.homePage);
};

module.exports = router;
