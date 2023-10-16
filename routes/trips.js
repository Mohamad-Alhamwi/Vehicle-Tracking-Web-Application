const express = require('express') ;

// Calling Models
const Trip = require('../models/Trip')
const AdminNotification = require('../models/AdminNotification') ;


const router = express() ;

// Start trip and save it in database => POST. 
router.post('/start-trip', (req, res) =>
{
    let userId = req.user.id ;
    let userLocation = req.body.origin ;
    let carId = req.body.carId ;
    let carLocation = req.carLocation
    
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

    Trip.create
    ({
        startTime : CurrentDateTime,
        userId : userId,
        userLocation : userLocation,
        carId : carId,
        carLocation : '40.9997452,28.9409954',
        status : 'uncompleted',
    })
    .then((result) => 
    {
        AdminNotification.create
        ({
            status : "Info",
            detail : `New trip with the #${result.dataValues.id} id has began.`,
            date : CurrentDateTime,
        })
        .then(result => {})
        .catch(err => 
        {
            console.log(err) ;
        }) ;
        
        let tripID = 'tripID' + '=' + result.dataValues.id;
        res.send(tripID) ;
    })
    .catch(err => 
    {
        console.log(err) ;
    }) ;
}) ;

// Cancel the  trip and update the status of the trip in the database => POST. 
router.post('/cancel-trip', (req, res) =>
{
    let tripId = req.body.trip_id ;

    console.log(tripId);
    Trip.findOne({ where: { id : tripId } })
    .then((trip) => 
    {
        trip.status = 'Canceled' ;

        trip.save() ;
        res.send('Trip is canceled.');
    })
    .catch((err) =>
    {
        console.log(err);;
    }) ;
}) ;

module.exports = router ;
