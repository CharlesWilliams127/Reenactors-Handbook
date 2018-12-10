const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getKits', mid.requiresSecure, controllers.Kit.getKits);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getAccount', mid.requiresSecure, controllers.Account.getAccount);
  app.get('/getKitByOwner', mid.requiresSecure, controllers.Kit.getKitByOwner);
  app.get('/getKitsByOwner', mid.requiresLogin, controllers.Kit.getKitsByOwner);
  // app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Kit.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Kit.make);
  app.post('/addKitItem', mid.requiresLogin, controllers.Kit.addKitItem);
  // app.get('/addKitItem', mid.requiresLogin, controllers.Kit.itemMakerPage);
  app.get('/', mid.requiresSecure, controllers.Kit.homePage);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.get('/home', mid.requiresSecure, controllers.Kit.homePage);
  app.post('/deleteKitItem', mid.requiresLogin, controllers.Kit.deleteKitItem);
  app.delete('/deleteKit', mid.requiresLogin, controllers.Kit.deleteKit);
};

module.exports = router;
