const express = require('express') ;

const router = express.Router() ;

const bcrypt = require('bcryptjs') ;
const passport = require('passport') ;

// Calling Models
const User = require('../models/User') ;
const AdminNotification = require('../models/AdminNotification') ;

// Welcome Page => GET.
router.get('/', (req, res) => 
{
    res.render(
                    'commonRoutes/welcome', 
                    
                    {
                        pageTitle : "Welcome Page" 
                    }
              ) ;
});

// Register Page => GET.
router.get('/register', (req, res) => 
{
    res.render(
                    'commonRoutes/register', 
                    
                    {
                        pageTitle : "Register Page" 
                    },
              ) ;
}) ;

// Register Page => POST.
router.post('/register', (req, res) => 
{
    const { name, email, mobilePhone,  birthDate, password, password2 } = req.body ;

    let errors = [] ;
   
    // Inputs Validation.

    // Check required fields
    if (!name || !email || !mobilePhone || !birthDate || !password || !password2) 
    {
        errors.push({ msg: 'Please enter all fields' }) ;
    }

    // Check password length
    if (password.length < 6) 
    {
        errors.push({ msg: 'Password must be at least 6 characters' }) ;
    }

    // Check passwords match
    if (password !== password2) 
    {
        errors.push({ msg: 'Passwords do not match' }) ;
    }

    // Display Errors.
    if (errors.length > 0) 
    {
        res.render
        (
            'commonRoutes/register', 
            {
                pageTitle : "Register Page",
                errors,
                name,
                email,
                mobilePhone,
                birthDate,
                password,
                password2
            }
        ) ;
    }

    // Validation passed.
    else
    {
        // Check if email exists.
        User.findOne( { where : { email: email } } )
            .then( (user) => 
            {
                if (user) 
                {
                    // Email exists
                    errors.push({ msg: 'Email already exists.' }) ;
                    res.render(
                                'commonRoutes/register', 
                                {
                                    pageTitle : "Register Page",
                                    errors,
                                    name,
                                    email,
                                    mobilePhone,
                                    birthDate,
                                    password,
                                    password2
                                }
                              ) ;
                }

                else 
                {
                    const newUser = new User({
                        name,
                        email,
                        mobilePhone,
                        birthDate,
                        password,
                        role : 'customer'
                    }) ;
            
                    bcrypt.genSalt(10, (err, salt) => 
                    {
                        bcrypt.hash(newUser.password, salt, (err, hash) => 
                        {
                            if (err) 
                            {
                                throw err ;
                            } 

                            newUser.password = hash ;
                            newUser.save()
                            .then( user => 
                            {
                                // Constructing date and time.
                                // TO DO 
                                // Make a util folder then inside it create a file call currentdate and put the following code snippet inside it.
                                let today = new Date() ;

                                let ss = String(today.getSeconds()).padStart(2, '0') ;
                                let mnt = String(today.getMinutes()).padStart(2, '0') ;
                                let hh = String(today.getHours()).padStart(2, '0') ;

                                let dd = String(today.getDate()).padStart(2, '0') ;
                                let mm = String(today.getMonth() + 1).padStart(2, '0') ;
                                let yyyy = today.getFullYear() ; 

                                let CurrentDateTime = `${yyyy}/${mm}/${dd} ${hh}:${mnt}:${ss}` ;

                                AdminNotification.create
                                ({
                                    status : "Info",
                                    detail : `New Customer has registered.`,
                                    date : CurrentDateTime,
                                })
                                .then(result => {})
                                .catch(err => 
                                {
                                    console.log(err) ;
                                }) ;
                                
                                req.flash
                                (
                                    'success_msg',
                                    'Succesfully registered'
                                ) ;
                                
                                res.redirect('/login') ;
                            })

                            .catch(err => console.log(err)) ;
                        }) ;
                    }) ;
                }
            })
            .catch(err => console.log(err)) ;
    }
}) ;

// Login Page => GET.
router.get('/login', (req, res) => 
{
    res.render(
                    'commonRoutes/login', 
                    
                    {
                        pageTitle : "Login Page" 
                    }
              ) ;
}) ;

// Login Page => POST.
router.post('/login', (req, res, next) => 
{
    const { email, password } = req.body ;
    
    let errors = [] ;

    // Check required fields
    
    if (!email || !password) 
    {
        errors.push({ msg: 'Please enter all fields' }) ;
    }

    // Display Errors.
    if (errors.length > 0) 
    {
        res.render(
                        'commonRoutes/login', 
                        {
                            pageTitle : "Login Page",
                            errors,
                        }
                  ) ;
    } 
    
    else 
    {
        passport.authenticate(
                                'local',
                                function(err, user, info) 
                                {
                                    if (err) 
                                    { 
                                        return next(err); 
                                    }
                            
                                    if (!user) 
                                    { 
                                        req.flash
                                        (
                                            'error_msg',
                                            `${info.message}`
                                        ) ;
                                        return res.redirect('/login'); 
                                    }
                            
                                    req.logIn(
                                                user, 
                                                function(err) 
                                                {
                                                    if(err) 
                                                    { 
                                                        return next(err); 
                                                    }
                                                    
                                                    if(user.role === 'customer')
                                                    {
                                                        req.flash
                                                        (
                                                            'success_msg',
                                                            `Welcome back, ${user.name}`
                                                        ) ;
                                                        
                                                        res.redirect('/user/dashboard') ;
                                                    }
                                                    else if(user.role === 'admin')
                                                    {
                                                        req.flash
                                                        (
                                                            'success_msg',
                                                            `Welcome back, ${user.name}`
                                                        ) ;
                                                        
                                                        res.redirect('/admin/dashboard') ;
                                                    }
                                                    
                                                }
                                    );
                                })(req, res, next);
                                

    }
}) ;

// Logout => GET.
router.get('/logout', (req, res) => 
{
    req.logout() ;
    req.flash('success_msg', 'You are logged out') ;
    res.redirect('/login') ;
});
  

module.exports = router ;

