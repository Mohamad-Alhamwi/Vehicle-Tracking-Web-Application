const express = require('express') ;

const User = require('../models/User') ;
const Car = require('../models/Car') ;
const Trip = require('../models/Trip') ;
const RaspberryPi = require('../models/RaspberryPi');
const { isAuthenticatedAdmin } = require('../config/authentication') ;

const router = express.Router() ;

// Dashboard Page => GET.
router.get('/dashboard',isAuthenticatedAdmin, (req, res) => 
{
    res.render(
                    'admin/dashboard', 
                    
                    {
                        pageTitle : "Dashboard", 
                        path : '/admin/dashboard'
                    }
              ) ;
}) ;

// Profile Page => GET.
router.get('/profile', isAuthenticatedAdmin, (req, res) => 
{
    res.render(
                    'admin/profile', 
                    
                    {
                        pageTitle : "Profile",
                        path : '/admin/profile',
                        user: req.user
                    }
              ) ;
}) ;

// Profile Page => POST.
router.post('/update-profile', (req, res) =>
{
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
            // console.log('Updated User!') ;
            res.redirect('/admin/profile') ;
        })
        .catch((err) =>
        {
            console.log(err) ;
        }) ;
}) ;

// Trips Page => GET.
router.get('/trips', isAuthenticatedAdmin, (req, res) => 
{
    Trip.findAll()
    .then((trips) =>
    {
        res.render
        (
            'admin/trips', 
                    
            {
                tripsList : trips,
                pageTitle : "Trips",
                path : '/admin/trips' 
            }
        ) ;
    })
    .catch((err) => 
    {
        console.log(err) ;
    }) ;
}) ;

// Trip Details Page => GET.
router.get('/trips/trip/:tripId', isAuthenticatedAdmin, (req, res) => 
{
    let tripId = req.params.tripId ;
    Trip.findAll({ where: { id : tripId} })
        .then((tripInfo) =>
        {
            let tripInformation = tripInfo[0].dataValues ;
            tripInformation.userName = req.user.name
            
            res.render
            (
                'admin/tripDetails', 
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

// Cars List Page => GET.
router.get('/cars-list', isAuthenticatedAdmin, (req, res) => 
{
    Car.findAll()
    .then((cars) =>
    {
        res.render
        (
            
            'admin/cars-list',
            {
                carsList : cars,
                pageTitle : "Cars List",
                path : '/admin/cars-list' 
            }
        ) ;
    })
    .catch((err) => 
    {
        console.log(err) ;
    }) ;
}) ;

// Add Car Page => GET.
router.get('/add-car', isAuthenticatedAdmin, (req, res) => 
{
    res.render(
                    'admin/add-car', 
                    
                    {
                        pageTitle : "Add Car",
                        path : '/admin/add-car',
                        editing : false
                    }
              ) ;
}) ;

// Add Car Page => POST.
router.post('/add-car', (req, res) => 
{
    let licensePlate = req.body.licensePlate ;
    let status = req.body.status ;
    
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


    Car.create
    ({
        licensePlate : licensePlate,
        status : status,
        addedDate : CurrentDateTime,
        userId : req.user.id
    })
    .then(result => 
    {
        req.flash('success_msg', 'Car created succesfully.') ;
        res.redirect('/admin/add-car') ;
    })
    .catch(err => 
    {
        console.log(err) ;
    }) ;

    RaspberryPi.findOne({ licensePlate : licensePlate }).then(collection => 
    {
        if (collection) 
        {
            licensePlate
        } 
        else 
        {
            const newRecord = new RaspberryPi(
            {
                licensePlate
            });

            newRecord
            .save()
            .then(collection => {})
            .catch(err => console.log(err));
        }
    });
}) ;

// Edit Car Form Page  => POST.
router.post('/edit-car-form', (req, res) =>  
{
    Car.findByPk(req.body.carId)
        .then((car) =>
        {
           const carInfo =
           {
               id : car.id,
               licensePlate : car.licensePlate,
               status : car.status
           }

           res.render
           ( 
               'admin/add-car', 
                {
                    pageTitle : "Edit Car",
                    car : carInfo ,
                    path : '/admin/edit-car-form',
                    editing : true
                }
            )
        })
        .catch((err) =>
        {
            console.log(err) ;
        });
});

// Edit Car Page  => POST.
router.post('/edit-car', (req, res) =>  
{
    const carId = req.body.carId ;
    const updatedCarLicensePlate = req.body.licensePlate ;
    const updatedCarStatus = req.body.status ;

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

    Car.findByPk(carId)
        .then((car) =>
        {
            car.licensePlate = updatedCarLicensePlate ;
            car.status = updatedCarStatus ;
            car.editedDate = CurrentDateTime ;
            car.userId = req.user.id
            
            return car.save() ;
        })
        .then((result) =>
        {
            req.flash('success_msg', 'Car is updated succesfully.') ;
            console.log('Updated Car!') ;
            res.redirect('/admin/cars-list') ;
        })
        .catch((err) =>
        {
            console.log(err) ;
        }) ;
});

// User List Page  => GET.
router.get('/users-list', isAuthenticatedAdmin, (req, res) => 
{
    User.findAll()
    .then((users) =>
    {
        res.render
        (
            
            'admin/users-list', 
            {
                usersList : users,
                pageTitle : 'Users List',
                path : '/admin/users-list',
            }
        ) ;
    })
    .catch((err) => 
    {
        console.log(err) ;
    }) ;
}) ;

// Map Page => GET.
router.get('/map', isAuthenticatedAdmin, (req, res) => 
{
    Car.findAll()
    .then((cars) =>
    {
        res.render
        (
            'admin/map', 
            
            {
                pageTitle : "Map",
                path : '/admin/map',
                carsList : cars  
            }
      ) ;
    })
    .catch((err) => 
    {
        console.log(err) ;
    }) ;
}) ;

module.exports = router ;






   

