// Preloader Script
$(window).on('load', function () {
    if ($('#preloader').length) {$('#preloader').delay(500).fadeOut('slow', function () {
        $(this).remove();
    });
}});

// Initializing Leaflet map
var map = L.map('map').setView([0, 0], 13);
var marker;
var markers = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(map);

// Displays the Lat&Lng of clicked location as Inputs Value
map.on('click', function(e) {
  $('#latResult').val(e.latlng.lat);
  $('#lngResult').val(e.latlng.lng);
});

// Puts a Marker On Clicked Location
function onMapClick(e) {
  var marker = L.marker(e.latlng).addTo(map);
  markers.push(marker);
}

map.on('click', onMapClick);

// Deletes The Markers One by One
$('#deleteMarkerBtn').click(function() {
  if (markers.length > 0) {
    let marker = markers.pop();
    map.removeLayer(marker);
  }
});

// Deletes All Markers
$('#deleteAllMarkersBtn').click(function() {
  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    map.removeLayer(marker);
  }
  markers = [];
});

// Takes Search Input And Displays It On The Map
$('#searchBarBtn').click(function() {
    var location = $('#searchInput').val();

    if (location.trim() === '') {
      $('#searchErrorDiv').html('Please enter a valid country or city name.');
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

        var searchMarker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 13);
        markers.push(searchMarker);

        $('#latResult').val(latitude);
        $('#lngResult').val(longitude);

        $('#searchErrorDiv').html('');
      },
      error: function() {
        $('#searchErrorDiv').html('An error occurred during geocoding.');
      }
    });
});

// Taking Latitude&Longitude inputs and displaying them on the map with a marker
$('#searchBtn').click(function() {
    var latitudeInput = parseFloat($('#latitudeInput').val());
    var longitudeInput = parseFloat($('#longitudeInput').val());
  
    if (isNaN(latitudeInput) || isNaN(longitudeInput) || !isFinite(latitudeInput) || !isFinite(longitudeInput)) {
      $('#inputsErrorDiv').html('Please enter valid latitude and longitude values.');
      return;
    }

    if (marker) {
        marker.remove();
    }
  
    var searchMarker = L.marker([latitudeInput, longitudeInput]).addTo(map);
    map.setView([latitudeInput, longitudeInput], 13);
    markers.push(searchMarker);
    $('#latResult').val(latitudeInput);
    $('#lngResult').val(longitudeInput);
    $('#inputsErrorDiv').html('');
    $('#mobileInputsErrorDiv').html('');
});

// Mobile version of the above function
$('#sidebarSearchBtn').click(function() {
  var mobileLatitudeInput = parseFloat($('#sideBarlatitudeInput').val());
  var mobileLongitudeInput = parseFloat($('#sideBarLongitudeInput').val());

  if (isNaN(mobileLatitudeInput) || isNaN(mobileLongitudeInput) || !isFinite(mobileLatitudeInput) || !isFinite(mobileLongitudeInput)) {
    $('#mobileInputsErrorDiv').html('Please enter valid lat&lng values');
    return;
  }

  if (marker) {
    marker.remove();
  }

  var searchMarker = L.marker([mobileLatitudeInput, mobileLongitudeInput]).addTo(map);
  map.setView([mobileLatitudeInput, mobileLongitudeInput], 13);
  markers.push(searchMarker);

  $('#latResult').val(mobileLatitudeInput);
  $('#lngResult').val(mobileLongitudeInput);
  $('#mobileInputsErrorDiv').html('');
});

// Using JS Navigator to display user's location upon opening the website
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
  
      var geolocationMarker = L.marker([latitude, longitude]).addTo(map);
      map.setView([latitude, longitude], 13);
      markers.push(geolocationMarker);

      $('#latResult').val(latitude);
      $('#lngResult').val(longitude);
    });
  } else {
    console.log('Geolocation is not supported by your browser.');
  }

// Locate Button To Display User's Current Location
L.control.locate().addTo(map);

var countryInfoDiv = $('#CountryInfoResultsDiv');
var currencyDiv = $('#CurrencyResultsDiv');
var timezoneDiv = $('#TimezoneResultsDiv');
var weatherDiv = $('#WeatherResultsDiv');


// Get Country Name & Capital Based on the clicked location (OpenCage API)
function countryInfoHandleClick() {
  // Hiding The other Tables
  if (currencyDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block' || weatherDiv.css('display') === 'block') {
    $(currencyDiv).add(timezoneDiv).add(weatherDiv).css('display', 'none');
  };

  $(countryInfoDiv).css('display', 'block');

  var latitude = $('#latResult').val();
  var longitude = $('#lngResult').val();

  $.get('https://api.opencagedata.com/geocode/v1/json', {
    q: latitude + ',' + longitude,
    key: 'a9539fc65a4c4710bcf9c629eb4a60dc',
  }, function(data) {

    var continent = data.results[0].components.continent;
    var country = data.results[0].components.country;
    var country_code = data.results[0].components.country_code;
    var postcode = data.results[0].components.postcode;
    var state = data.results[0].components.state;
    var state_code = data.results[0].components.state_code;
    var state_district = data.results[0].components.state_district;

    $('#CountryContinentResult').html(continent);
    $('#CountryNameResult').html(country);
    $('#CountryCodeResult').html(country_code);
    $('#CountryPostcodeResult').html(postcode);
    $('#CountryStateResult').html(state);
    $('#CountryStateCodeResult').html(state_code);
    $('#CountryStateDistrictResult').html(state_district);
  });
};

// Get Country Currency Information -- (OpenCage API)
function currencyInfoHandleClick() {
  // Hiding The other Tables
  if (countryInfoDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block' || weatherDiv.css('display') === 'block') {
    $(countryInfoDiv).add(timezoneDiv).add(weatherDiv).css('display', 'none');
  };

  $(currencyDiv).css('display', 'block');

  var latitude = $('#latResult').val();
  var longitude = $('#lngResult').val();

  $.get('https://api.opencagedata.com/geocode/v1/json', {
    q: latitude + ',' + longitude,
    key: 'a9539fc65a4c4710bcf9c629eb4a60dc',
  }, function(data) {

    var isoCode = data.results[0].annotations.currency.iso_code;
    var name = data.results[0].annotations.currency.name;
    var subunit = data.results[0].annotations.currency.subunit;
    var flag = data.results[0].annotations.flag;

    $('#CurrencyISOCodeResult').html(isoCode);
    $('#CurrencyNameResult').html(name);
    $('#CurrencySubunitResult').html(subunit);
    $('#CurrencyFlagResult').html(flag);
  });
}

// Get Country Timezone -- (OpenCage API)
function timezoneInfoClickHandle() {

  // Hiding The other Tables
  if (countryInfoDiv.css('display') === 'block' || currencyDiv.css('display') === 'block' || weatherDiv.css('display') === 'block') {
      $(countryInfoDiv).add(currencyDiv).add(weatherDiv).css('display', 'none');
  };
    
  $(timezoneDiv).css('display', 'block');
    
  var latitude = $('#latResult').val();
  var longitude = $('#lngResult').val();
    
  $.get('https://api.opencagedata.com/geocode/v1/json', {
    q: latitude + ',' + longitude,
    key: 'a9539fc65a4c4710bcf9c629eb4a60dc',
    }, function(data) {
    
      var name = data.results[0].annotations.timezone.name;
      var now_in_dst = data.results[0].annotations.timezone.now_in_dst;
      var offset_sec = data.results[0].annotations.timezone.offset_sec;
      var offset_string = data.results[0].annotations.timezone.offset_string;
      var short_name = data.results[0].annotations.timezone.short_name;
    
      $('#TimezoneNameResult').html(name);
      $('#TimezoneDstResult').html(now_in_dst);
      $('#TimezoneSecResult').html(offset_sec);
      $('#TimezoneStringResult').html(offset_string);
      $('#TimezoneShortNameResult').html(short_name);
  });
}

// Retrive Weather Data -- (OpenWeather API)
function weatherInfoClickHandle() {
  // Hiding The other Tables
  if (countryInfoDiv.css('display') === 'block' || currencyDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block') {
    $(countryInfoDiv).add(currencyDiv).add(timezoneDiv).css('display', 'none');
  }

  $(weatherDiv).css('display', 'block');

  var appid = 'd82b4a56a2b2017d3b9863326d8378ec';
  var latitude = $('#latResult').val(); 
  var longitude = $('#lngResult').val();

  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appid}`,
    method: 'GET',
    dataType: 'JSON',
    success: function(data) {
      if (!data.weather || data.weather.length === 0) {
        alert('Weather Data not found.');
        return;
      }

      var weatherMain = data.weather[0].main;
      var weatherDesc = data.weather[0].description;
      var weatherIcon = data.weather[0].icon;
      var temp = data.main.temp;
      var feels_like = data.main.feels_like;
      var temp_min = data.main.temp_min;
      var temp_max = data.main.temp_max;
      var pressure = data.main.pressure;
      var wind_speed =  data.wind.speed;
      var visibility = data.visibility;

      $('#WeatherMainResult').html(weatherMain);
      $('#WeatherDescResult').html(weatherDesc);
      $('#WeatherIconResult').html(weatherIcon);
      $('#WeatherTempResult').html(temp);
      $('#WeatherFeelsLikeResult').html(feels_like);
      $('#WeatherTempMinResult').html(temp_min);
      $('#WeatherTempMaxResult').html(temp_max);
      $('#WeatherPressureResult').html(pressure);
      $('#WeatherWindSpeedResult').html(wind_speed);
      $('#WeatherVisibilityResult').html(visibility);

    },
    error: function(error) {
      alert(`error ${error.message}`);
    }
  })
};

// Map Info Buttons
var countryInfoBtn = L.easyButton('fa-solid fa-info', countryInfoHandleClick).addTo(map);
var currencyInfoBtn = L.easyButton('fa-sharp fa-solid fa-coins', currencyInfoHandleClick).addTo(map);
var timezoneInfoBtn = L.easyButton('fa-solid fa-clock', timezoneInfoClickHandle).addTo(map);
var weatherInfoBtn = L.easyButton('fa-solid fa-cloud', weatherInfoClickHandle).addTo(map);

// Closing Result Div Window Buttons
$('.closeWindowBtn').click(function() {
  $(countryInfoDiv).css('display', 'none');
  $(currencyDiv).css('display', 'none');
  $(timezoneDiv).css('display', 'none');
  $(weatherDiv).css('display', 'none');
});