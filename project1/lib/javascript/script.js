// Preloader Script
$(window).on('load', function () {
    if ($('#preloader').length) {$('#preloader').delay(500).fadeOut('slow', function () {
        $(this).remove();
    });
}});

// Initializing Leaflet map
var map = L.map('map').setView([0, 0], 13);
var marker;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Takes Search Input And Displays It On The Map
$('#searchBarBtn').click(function() {
    var location = $('#searchInput').val();

    if (location.trim() === '') {
      alert('Please enter a valid country or city.');
      return;
    }

    var geocodeUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(location);

    $.ajax({
      url: geocodeUrl,
      dataType: 'json',
      success: function(data) {
        if (data.length === 0) {
          alert('Location not found.');
          return;
        }

        var latitude = parseFloat(data[0].lat);
        var longitude = parseFloat(data[0].lon);

        if (marker) {
          marker.remove();
        }

        marker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 10);
      },
      error: function() {
        alert('An error occurred during geocoding.');
      }
    });
});

// Taking Latitude&Longitude inputs and displaying them on the map with a marker
$('#searchBtn, #sidebarSearchBtn').click(function() {
    var latitudeInput = parseFloat($('#latitudeInput, #sideBarlatitudeInput').val());
    var longitudeInput = parseFloat($('#longitudeInput, #sideBarLongitudeInput').val());
  
    if (isNaN(latitudeInput) || isNaN(longitudeInput) || !isFinite(latitudeInput) || !isFinite(longitudeInput)) {
        alert('Please enter valid latitude and longitude values.');
        return;
    }
  
    if (marker) {
        marker.remove();
    }
  
    marker = L.marker([latitudeInput, longitudeInput]).addTo(map);
    map.setView([latitudeInput, longitudeInput], 13);
});

// Using JS Navigator to display user's location upon opening the website
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
  
      var marker = L.marker([latitude, longitude]).addTo(map);
      map.setView([latitude, longitude], 13);
    });
  } else {
    console.log('Geolocation is not supported by your browser.');
  }

// Locate Button To Display User's Current Location
L.control.locate().addTo(map);