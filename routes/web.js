const homeController= require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')

const guest=require('../app/http/middlewares/guest')
function initRoutes(app) {
  homeController().index
  app.get("/",homeController().index)
  
  app.get("/login",guest,authController().login)
  app.post("/login",authController().postLogin)
  app.get("/register",guest,authController().register)
  app.post("/register",authController().postRegister)
  app.post("/logout",authController().logout)
  app.get("/cart",cartController().index)
  app.post('/update-cart',cartController().update)
  app.post('/orders',orderController().store)
  app.get('/customer/orders',orderController().index)

}

module.exports=initRoutes