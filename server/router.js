const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
	app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
	app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/logout', mid.requiresLogin, controllers.Account.logout);
	app.get('/changePassPage', mid.requiresLogin, controllers.Account.changePassPage);
	app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
    app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Post.make);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;