const express = require('express') ;

const User = require('../models/User') ;
const Car = require('../models/Car') ;
const Trip = require('../models/Trip') ;
const { isAuthenticatedUser } = require('../config/authentication') ;

const router = express.Router() ;

// Dashboard Page => GET.
router.get('/dashboard', isAuthenticatedUser, (req, res) => 
{
    res.render(
                    'user/dashboard', 
                    
                    {
                        pageTitle : "Dashboard", 
                        path : '/user/dashboard'
                    }
              ) ;
}) ;

// Profile Page => GET.
router.get('/profile', isAuthenticatedUser, (req, res) => 
{
    res.render(
                    'user/profile', 
                    
                    {
                        pageTitle : "Profile",
                        path : '/user/profile', 
                        user: req.user
                    }
              ) ;
}) ;

// Profile Page => POST.
router.post('/update-profile', (req, res) =>
{
    console.log(req.body) ;

    const userId = req.user.id ;
    const updatedUserName = req.body.name ;
    const updatedUserEmail = req.body.email ;
    const updatedUserMobileNumber = req.body.mobilePhone ;
    const updatedUserbirthDate = req.body.birthDate ;
    
    User.findByPk(userId)
        .then((user) =>
        {
            user.name = updatedUserName ;
            user.email = updatedUserEmail ;
            user.mobilePhone = updatedUserMobileNumber ;
            user.birthDate = updatedUserbirthDate ;
            
            return user.save() ;
        })
        .then((result) =>
        {
            req.flash('success_msg', 'Your profile is updated succesfully.') ;
            res.redirect('/user/profile') ;
        })
        .catch((err) =>
        {
            console.log(err) ;
        }) ;
}) ;

// Trips Page => GET.
router.get('/trips', isAuthenticatedUser, (req, res) => 
{
    Trip.findAll({ where: { userId : req.user.id } })
    .then((trips) =>
    {
        res.render
        (
            
            'user/trips', 
            {
                tripsList : trips,
                pageTitle : "Trips",
                path : '/user/trips'
            }
        ) ;
    })
    .catch((err) => 
    {
        console.log(err) ;
    }) ;
}) ;

// Trip Details Page => GET.
router.get('/trip/:tripId', isAuthenticatedUser, (req, res) => 
{
    let tripId = req.params.tripId ;
    Trip.findAll({ where: { id : tripId} })
        .then((tripInfo) =>
        {
            let tripInformation = tripInfo[0].dataValues ;
            tripInformation.userName = req.user.name
            res.render
            (
                'user/tripDetails', 
                {
                    pageTitle : "Trip Details",
                    path : '',
                    tripInformation
                }
            ) ;
        })
        .catch((err) =>
        {
            console.log(err) ;
        }) ;
}) ;

module.exports = router ;

