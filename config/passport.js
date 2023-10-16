const LocalStrategy = require('passport-local').Strategy ;
const bcrypt = require('bcryptjs') ;

// Load User Model.
const User = require('../models/User') ;

module.exports = function(passport)
{
    passport.use
    (
        new LocalStrategy
        (
            { 
                usernameField : 'email' 
            },

            (email, password, done) =>
            {
                // Match User.
                User.findOne( { where : { email : email} })
                .then
                (
                    user =>
                    {
                        // If no match.
                        if(!user)
                        {
                            return done
                            (
                                null,
                                false,
                                { message : 'Incorrect email or password.'}
                            )
                        }

                        // Match the password.
                        bcrypt.compare
                        (
                            password,
                            user.password,
                            (err, isMatch) =>
                            {
                                if(err) throw err ;

                                if(isMatch)
                                {
                                    // TODO remove unnecesarry attributes
                                    return done(null, user) ; /*, {message: 'Logged In Successfully'}*/
                                }

                                else
                                {
                                    return done
                                    (
                                        null,
                                        false,
                                        { message : 'Incorrect username or password.'}
                                    )                                    
                                }
                            }
                        ) ;
                    }
                ) 
                .catch(err => console.log(err))
            }
        ) 
    ) ;

    passport.serializeUser((user, done) => 
    {
        done(null, user.id);
    }) ;
    
    passport.deserializeUser((id, done) => 
    {
        User.findByPk(id).then(function(user) 
        {
            done(user.errors, user.get());
        }) ;
    }) ;
} ;