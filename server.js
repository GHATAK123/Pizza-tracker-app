require('dotenv').config()
const express=require('express')
const app=express()
const ejs=require('ejs')
const path=require('path')
const expressLayout=require('express-ejs-layouts')
const Emitter = require('events')
const DB_CONNECTION_URL=process.env.MONGO_CONNECTION_URL
const COOKIE_SECRET=process.env.COOKIE_SECRET

const PORT=process.env.PORT;

const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
// Database Connection
mongoose.connect(DB_CONNECTION_URL,{ useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true
});
const connection = mongoose.connection;
connection.once('open',()=>{
  console.log('Database connected...');
}).catch(err => {
  console.log('Connection failed...');
});

// session store
let mongoStore=new MongoDbStore({
  mongooseConnection:connection,
  collection:'sessions'
})
//Event Emitter
const eventEmitter = new Emitter();
app.set('eventEmitter',eventEmitter);
// session config
app.use(session({
  secret:COOKIE_SECRET,
  resave:false,
  store:mongoStore,
  saveUninitialized:false,
  cookie:{maxAge:1000*60*60*24} // 24 hours
}))

//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Assets folder
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())


app.use((req,res,next) => {
  res.locals.session=req.session
  res.locals.user=req.user
  next()
})
// set Template Engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')
// routes 
require('./routes/web')(app)
app.use((req,res)=>{
  res.status(404).render('errors/404')

})



const server = app.listen(PORT,()=>{
  console.log(`Listening on port  ${PORT}`);
})

const io = require('socket.io')(server)

io.on('connection',(socket)=>{
  socket.on('join',(orderId)=>{
    socket.join(orderId)
    
  })

})

eventEmitter.on('orderUpdated',(data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)

})

eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})


