const express = require('express') ;
const bodyParser = require('body-parser') ;
const expressLayouts = require('express-ejs-layouts') ;
const flash = require('connect-flash') ;
// const session = require('express-session') ;
const session = require('cookie-session') ;
const passport = require('passport');
const path = require('path') ;
const http = require('http') ;
const socketio = require('socket.io') ;

const commonRoutes = require('./routes/commonRoutes') ;
const carRoutes = require('./routes/cars') ;
const tripRoutes = require('./routes/trips') ;
const userRoutes = require('./routes/users') ;
const adminRoutes = require('./routes/admins') ;

const Car = require('./models/Car') ;
const User = require('./models/User') ;
const Trip = require('./models/Trip') ;
const AdminNotification = require('./models/AdminNotification') ;


// Passport Config
require('./config/passport')(passport) ;

// DB Config.
const db = require('./config/database') ;
// DB Config
const connectToMongoDb = require('./config/mongoDB');


// Creating the express application.
const app = express() ;
const server = http.createServer(app) ;

// Initialize a new instance of socket.io by passing the the HTTP server object.
const io = socketio(server) ;

// Listen on the connection event for incoming sockets.
io.on('connection', (socket) => 
{
    socket.on('new_notification', function( data ) 
    {
        console.log(data.title, data.message);
        io.sockets.emit( 'show_notification', 
        { 
            title: data.title, 
            message: data.message, 
            icon: data.icon,
        });
    });
});

// Serving static files.
app.use(express.static(path.join(__dirname, 'public'))) ;

// Express Session
app.use(session(
                    {
                        secret: 'secret',
                        resave: true,
                        saveUninitialized: true,
                    }
               )
        ) ;

User.hasMany(Trip) ;
Car.hasMany(Trip) ;
User.hasMany(Car) ;
AdminNotification.sync() ;

// Connect to MySQL
//db.sync({ force : true})
db.authenticate()
    .then( () => 
            {
                console.log('Database connected...') ;
            } 
         )
    .catch( (err) => 
            {
                console.log(err.message) ;
            }
          ) ;

//
connectToMongoDb();

// EJS
app.use(expressLayouts) ;
app.set('view engine', 'ejs') ;

// Bodyparser 
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: false })) ; 

// for parsing application/json
app.use(bodyParser.json()) ; 

// Passport middleware
app.use(passport.initialize()) ;
app.use(passport.session()) ;

// Connect Flash
app.use(flash()) ;

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', commonRoutes) ;
app.use('/car', carRoutes) ;
app.use('/trip', tripRoutes) ;
app.use('/user', userRoutes) ;
app.use('/admin', adminRoutes) ; 

const PORT = process.env.PORT || 5000 ;

server.listen(PORT, '0.0.0.0', console.log(`Server is running on port ${PORT}`)) ;
