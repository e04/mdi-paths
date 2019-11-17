import {accessible, flight_land, info, thumb_up, work} from '../dist'

const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.68, lng: 139.96},
    zoom: 11,
});

[accessible, flight_land, info, thumb_up, work].forEach((path,index) => {
    new google.maps.Marker({
        position: {lat: 35.68, lng: 139.76 + (index * 0.1)},
        map: map,
        icon: {
            fillColor: '#FFFFFF',
            fillOpacity: 1,
            path: path,
            strokeColor: '#000000',
            strokeWeight: 2,
        },
    })
})
