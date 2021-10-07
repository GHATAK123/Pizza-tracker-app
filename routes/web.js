const homeController= require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const statusController =  require('../app/http/controllers/admin/statusController');
const userProfileController =  require('../app/http/controllers/admin/userProfileController');
const paymentController =  require('../app/http/controllers/admin/paymentController');
const adminUserProfileControler =  require('../app/http/controllers/admin/adminController');

const guest=require('../app/http/middlewares/guest')
const auth=require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')
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
  app.post('/orders',auth,orderController().store)
  app.get('/customer/orders',auth,orderController().index)
  app.get('/customer/orders/:id',auth,orderController().show)

  app.get('/admin/orders',admin,AdminOrderController().index)
  app.post('/admin/order/status',admin,statusController().update)
  app.post('/admin/user-profile/status',admin,userProfileController().update)
  app.post('/admin/payment/status',admin,paymentController().update)
  app.post('/admin/profile/status',admin,adminController().update)

}

module.exports=initRoutes
