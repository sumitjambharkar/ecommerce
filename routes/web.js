const authController = require('../app/http/controllrs/authController')
const cartController = require('../app/http/controllrs/customers/cartContoller')
const homeController = require('../app/http/controllrs/homeController')
const guest =  require('../app/http/middleware/guest')

function initRoutes(app){
    
    app.get('/',homeController().index)
    
    app.get('/login',guest,authController().login)

    app.post('/login',authController().postLogin)
    
    app.get('/register',guest,authController().register)

    app.post('/register',authController().postRegister)

    app.post('/logout',authController().logout)

    app.get('/cart',cartController().index)

    app.post('/update-cart',cartController().update)

}

module.exports = initRoutes