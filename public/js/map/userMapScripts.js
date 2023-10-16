let map ;

let notificationObject =
{
    notificationTitle : '',
    notificationBody : '',
    notificationIcon : ''
};

// initialize the map and show it on the dashboard.
function initMap() 
{
    // Map options.
    let options =
    {
        center :
        {
            lat : 41.015137,
            lng : 28.979530
        },
        zoom : 12
    }

    // New map.
    map  = new google.maps.Map
    (
        document.getElementById('map'),
        options
    );
};

$(document).ready(
    function()
    {
        // Create a new button to cancel the order.
        let buttonLink = document.createElement('a') ;
        buttonLink.className += "btn btn-primary" ;
        buttonLink.id = "cancel_and_hide";
        
        let buttonText = document.createTextNode("Cancel Now") ;
        buttonLink.appendChild(buttonText) ;

        const buttonDiv = document.querySelector('.buttonDiv') ;

        $("#order_and_show").click(
            function()
            {
                    // Change the text of the title when get order from the user. 
                    $('#order_title').text('Cancel the order right now') ;
                    $("#order_and_show").hide() ;

                   
                    buttonDiv.appendChild(buttonLink) ;

                    // Get and store user location.
                    function getUserLocation(position) 
                    {
                        // To store user location.
                        let origin ;

                        origin = `${position.coords.latitude},${position.coords.longitude}` ;

                        // Send user location to the server.
                        axios.post('/car/get-nearest-car', 
                        {
                            origin,
                        })
                        .then(function (response) 
                        {
                            // Fetch directions for driving travel mode.
                            let directionsRenderer = new google.maps.DirectionsRenderer(
                            {
                                markerOptions:
                                {
                                    // To prevent the default start and end markers from showing.
                                    visible: false
                                },
                            }) ;
                            
                            let directionsService = new google.maps.DirectionsService ;
                            
                            directionsRenderer.setMap(map) ;

                            calculateAndDisplayRoute(directionsService, directionsRenderer);

                            function calculateAndDisplayRoute(directionsService, directionsRenderer) 
                            {
                                directionsService.route(
                                {
                                    origin : 
                                    {
                                        lat : position.coords.latitude,
                                        lng : position.coords.longitude
                                    },  
                                    destination : 
                                    {
                                        lat : parseFloat(response.data.lastLocation.split(',')[0]), 
                                        lng : parseFloat(response.data.lastLocation.split(',')[1]),
                                    },  
                                    travelMode: 'DRIVING'
                                }, 
                                function(response, status) 
                                {
                                    if (status == 'OK') 
                                    {
                                        directionsRenderer.setDirections(response) ;
                                        
                                        let startLocation = response.routes[ 0 ].legs[ 0 ].start_location ;
                                        let endLocation = response.routes[ 0 ].legs[ 0 ].end_location ;
                                        let startAdress = response.routes[ 0 ].legs[ 0 ].start_address ;
                                        let endAdress = response.routes[ 0 ].legs[ 0 ].end_address ;
                                        
                                        makeMarker( endLocation, "http://maps.google.com/mapfiles/kml/pal4/icon7.png", 'Your Destination', endAdress) ;
                                        makeMarker( startLocation, "http://maps.google.com/mapfiles/kml/pal3/icon32.png", "Your Location", startAdress) ;
                                    } 
                                    else 
                                    {
                                        window.alert('Directions request failed due to ' + status);
                                    }
                                }) ;

                                function makeMarker( position, icon, title, information) 
                                {
                                    let marker = new google.maps.Marker(
                                    {
                                        position: position,
                                        map: map,
                                        icon: icon,
                                        title: title
                                    });

                                    // Add popup window for user location information
                                    let infoWindow = new google.maps.InfoWindow
                                    (
                                        {
                                            content : information
                                        }
                                    ) ;
                        
                                    // Add listener to show information about the location.
                                    marker.addListener
                                    (
                                        'click', 
                                        () =>
                                        {
                                            infoWindow.open(map, marker) ;
                                        }
                                    ) ;
                                }
                            }

                            // Send desktop notification when order is successfully arised.
                            notificationObject.notificationTitle = "Order Information";
                            notificationObject.notificationBody = "Your order is successfully created, the car is on the way.";
                            notificationObject.notificationIcon = "https://www.suunto.com/contentassets/65e562441a8a42cab28ede23a57a8d2d/icon-success.png";
                            setNotification(notificationObject.notificationTitle, notificationObject.notificationBody, notificationObject.notificationIcon);

                            // Save trip information into database.
                            
                            let carId = response.data.id ;

                            axios.post('/trip/start-trip', 
                            {
                                origin,
                                carId
                            })
                            .then((res) =>
                            {
                                let idOfTrip = res.data.split('=')
                                sessionStorage.setItem("tripID", idOfTrip[1]);
                                // TODO edit this.
                                document.cookie = `tripId=${idOfTrip[1]}; HttpOnly`;    
                            
                                // Save the trip id in mongo db.
                                let trip_id = sessionStorage.getItem("tripID");
                                let licensePlate = response.data.licensePlate;
                                axios.post('/car/raspberry', 
                                {
                                    origin,
                                    trip_id,
                                    licensePlate
                                })
                                .then((response) =>{})
                                .catch((error) => 
                                {
                                    console.log(error) ;
                                }) ;
                            })
                            .catch((error) => 
                            {
                                console.log(error) ;
                            }) ;
                            
                            // Get the required information from the responce object.
                            let licensePlate = response.data.licensePlate;
                            let time = response.data.duration.text;
                            
                            // Set the required information to its selectors.
                            $('#license_plate').text(licensePlate);
                            $('#time').text(time);
                            
                            // Show the required information on the user dashboard.
                            $(".ordered_car_info").show() ;
                        })
                        .catch((error) =>
                        {
                            console.log(error);
                        }) ;
                    }

                    // If position error occured. 
                    function errorHandler() 
                    {
                        handleLocationError(true, infoWindow, map.getCenter()) ;
                    }

                    // Handle Geolocation errors.
                    function handleLocationError(browserHasGeolocation, infoWindow, pos) 
                    {
                        infoWindow.setPosition(pos);
                        
                        infoWindow.setContent
                        (
                            browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser does not support geolocation.'
                        ) ;
                        
                        infoWindow.open(map);
                    }

                    // requiest HTML5 geolocation.
                    if (navigator.geolocation) 
                    {
                        navigator.geolocation.getCurrentPosition(getUserLocation, errorHandler) ;
                    }

                    else 
                    {
                        // Browser doesn't support Geolocation
                        handleLocationError(false, infoWindow, map.getCenter());
                    }         
        }) ;
   
        $(".buttonDiv").on( "click", '#cancel_and_hide',
            function()
            {
                let confirmCancelTheOrder = confirm("Are you sure you want to cancel the order?") ;
               
                if(confirmCancelTheOrder == true)
                {
                    function reloadPage() 
                    {
                        sessionStorage.setItem("reloading", "true");
                        let trip_id = sessionStorage.getItem("tripID");
                        
                        axios.post('/trip/cancel-trip', 
                        {
                            trip_id
                        })
                        .then((response) =>
                        {
                            console.log(response.data);
                        })
                        .catch((error) => 
                        {
                            console.log(error) ;
                        }) ;

                        sessionStorage.setItem("tripID", "");
                        document.location.reload();
                    }

                    reloadPage();
                }
        }) ;

        window.onload = function() 
        {
            var reloading = sessionStorage.getItem("reloading");
            if (reloading) 
            {
                sessionStorage.removeItem("reloading");
                
                // Send desktop notification when order is canceled.
                notificationObject.notificationTitle = "Order Information";
                notificationObject.notificationBody = "Your order is canceled.";
                notificationObject.notificationIcon = "https://www.suunto.com/contentassets/65e562441a8a42cab28ede23a57a8d2d/icon-success.png";
                setNotification(notificationObject.notificationTitle, notificationObject.notificationBody, notificationObject.notificationIcon);
            }
        }
    }
) ;