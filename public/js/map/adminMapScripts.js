let map ;

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
    ) ;
} ;

// Get cars information from database. => GET.
axios.get('/car/get-cars')
.then(function (response) 
{
    // Loop Through Markers.
    for(let counter = 0 ; counter < response.data.length ; ++ counter)
    {
        addMarker(response.data[counter]) ;
    }
})
.catch(function (error) 
{
    console.log(error);
}) ;

// Add Marker Function.
function addMarker(props)
{
    let coords =
    {
        lat : parseFloat(props.lastLocation.split(',')[0]),
        lng : parseFloat(props.lastLocation.split(',')[1]) 
    } ;

    // Add marker.
    let marker = new google.maps.Marker
    (
        {
            position : coords,
            map : map,
        }
    ) ;
    
    //  Set Icon Image.
    marker.setIcon('http://maps.google.com/mapfiles/kml/pal4/icon7.png') ;

    // Check Content,
    if(props.licensePlate)
    {
        // Add popup window for information
        let infoWindow = new google.maps.InfoWindow
        (
            {
                content : `<h6>Car: ${props.licensePlate}</h6>`
            }
        ) ;

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