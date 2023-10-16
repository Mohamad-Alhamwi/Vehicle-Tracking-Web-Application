const express = require('express') ;
const Car = require('../models/Car');
const Trip = require('../models/Trip');
const AdminNotification = require('../models/AdminNotification') ;
const RaspberryPi = require('../models/RaspberryPi');

const axios = require('axios')

const router = express() ;

// Getting location information from car => POST.
router.post('/location-information', (req, res) => 
{
    // Access the provided query parameters.
    let lat = req.body.lat ;
    let lng = req.body.lng ;
    let state = req.body.state ;
    let licensePlate = req.body.licensePlate ;
 
    console.log('\n*******************************************************************************') ;
    console.log('\033[1;42m[Success]\033[0m Receiving Car Information...') ;
    console.log(`Car Latitude: ${lat}\nCar Longtude: ${lng}\nCar Licence Plate: ${licensePlate}\nCar State: ${state}`) ;
    console.log('*******************************************************************************\n') ;

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
        detail : `The car with the ${licensePlate} license plate is ${state}.`,
        date : CurrentDateTime,
    })
    .then(result => 
    {})
    .catch(err => 
    {
        console.log(err) ;
    }) ;

    Car.findOne({ where: { licensePlate : licensePlate } })
    .then((car) => 
    {
        car.status = state ;
        car.lastLocation = `${lat},${lng}` ;

        car.save() ;
        res.send('saved');
    })
    .catch((err) =>
    {
        res.send('error');
        console.log(err);;
    }) ;
});

// Google Distance Matrix Api requist => POST 
router.post('/get-nearest-car', (req, res) => 
{
    
    // Get user location from request.
    const { origin } = req.body;

    // Get cars location from database.
    Car.findAll( { attributes : ['id', 'licensePlate', 'lastLocation'] } )
    .then((cars) =>
    {
        let destinations = '' ;

        // Looping throw cars to get thier locations.
        for (let car of cars)
        {
            destinations += car.lastLocation + '|'
        }

        destinations = destinations.substring(0, destinations.length - 1) ;
        
        // Saving the API key .
        const key = 'AIzaSyB914bYqvLm_eb4lwZFX97zPhR942oY-Jw&fbclid=IwAR1BOxJ-HQX2gOIEprwd_n2WOCVKZTq9AmdHm9qglDGncVW8nweCbDF50NA' ;

        // Saving the get request in variable to use later.
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destinations}&key=${key}` ;

        axios.get(url)
        .then(function (response) 
        {
            for (let index = 0 ; index < cars.length ; ++ index) 
            {
                response.data.rows[0].elements[index].id = cars[index].id;
                response.data.rows[0].elements[index].licensePlate = cars[index].licensePlate;
                response.data.rows[0].elements[index].lastLocation = cars[index].lastLocation;
            }

            // This is last array with car id
            const lastArray = response.data.rows[0].elements
            
            let timeArray = new Array() ;
            let indexArray = new Array() ;

            let minValue;
            let maxValue;
            let counterOfMax  ;
            let counterOfmin ;

            for (let counter = 0 ; counter < lastArray.length ; ++ counter) 
            {
                if(lastArray[counter].duration.text.split(' ')[1] == 'hours')
                {
                    continue ;
                }
                else
                {
                    timeArray.push(lastArray[counter].duration.text.split(' ')) ;
                    indexArray.push(counter);                
                }
            }

            minValue = timeArray[0];
            counterOfmin = indexArray[0];
            for (let counter = 1 ; counter < timeArray.length ; ++ counter) 
            {
                if(minValue > timeArray[counter])
                {
                    minValue = timeArray[counter];
                    counterOfmin = indexArray[counter];
                }
            }
            
            // Go through comparing function
            const selectedCar = lastArray[2];

            // Send selected car in the response
            res.send(selectedCar);
        })
        .catch(function (error) 
        {
            console.log(error);
        });
    })
    .catch((err) => 
    {
        console.log(err) ;
    }) ;
});

// Requist to database te get all cars' information in order to show them on admin dashboard map => GET. 
router.get('/get-cars', (req, res) =>
{
     // Get cars information from database.
     Car.findAll( { attributes : ['id', 'licensePlate', 'lastLocation'] } )
     .then((cars) =>
     {      
          // Send cars information to the client(admin).
          res.send(cars);
     })
     .catch((err) => 
     {
          console.log(err) ;
     }) ;
}) ;

// Getting information from car => POST.
router.post('/information', (req, res) => 
{
    // Access the provided query parameters.
    let information = req.body.information ;
 
    console.log('\n*******************************************************************************') ;
    console.log('\033[1;42m[Success]\033[0m Receiving Car Information...') ;
    console.log(`${information}`) ;
    console.log('*******************************************************************************\n') ;

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

    Trip.findOne({ where: { id : 277 } })
    .then((trip) => 
    {
        if(information === 'Arrived to customer')
        {
            trip.arrivalTime = CurrentDateTime ;
        }
        else if(information === 'Arrived to distination')
        {
            trip.status = 'Completed' ;
            trip.endTime = CurrentDateTime ;
        }

        trip.save() ;
        res.send('Received');
    })
    .catch((err) =>
    {
        res.send('error');
        console.log(err);
    }) ;
});

// Getting tripid and user location from client => POST.
router.post('/raspberry', (req, res) => 
{
    // Access the provided query parameters.
    let userLocation = req.body.origin ;
    let currentTripId = req.body.trip_id ;
    let licensePlate = req.body.licensePlate ;

    RaspberryPi.findOne({ licensePlate : 'AE0000AE' }).then(collection => 
    {
        collection.updateOne(
            { userLocation: userLocation, tripId: currentTripId },
            
            function( err, result ) 
            {
                if (err)
                {
                    console.log(err);
                }
            }
        )
    });
});

module.exports = router ;
