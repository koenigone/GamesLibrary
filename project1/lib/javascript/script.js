// Preloader Script
$(window).on('load', function () {
    if ($('#preloader').length) {$('#preloader').delay(500).fadeOut('slow', function () {
        $(this).remove();
    });
}});

// Initializing Leaflet map
var map = L.map('map').setView([0, 0], 13);
var marker;
var geojsonLayer;
var markers = [];

// Different Map Layers
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});

// Adding Cities to Layer Control
var rotherham = L.marker([53.43, -1.35]).bindPopup('This is Rotherham');
var sheffild = L.marker([53.38, -1.46]).bindPopup('This is sheffild');
var doncaster = L.marker([53.52, -1.13]).bindPopup('This is doncaster');
var rawmarsh = L.marker([53.45, -1.33]).bindPopup('This is rawmarsh');
var dalton = L.marker([53.43, -1.31]).bindPopup('This is Dalton');

var cities = L.layerGroup([rotherham, sheffild, doncaster, dalton]);

// Leaflet Map Layer Control
var baseMaps = {
  'Stadia Alidade Smooth Dark': Stadia_AlidadeSmoothDark,
  'Esri World Imagery': Esri_WorldImagery,
  'Open Street Map': osm,
  "<span style='color: #6b0f0f'>OpenStreetMap HOT</span>": OpenStreetMap_HOT
};

var overlayMaps = {
  'Cities': cities
};

var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

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

// Takes Selected Country And Displays It On The Map
var selectElement = $('#selectCountry');

$.ajax({
  url: 'lib/PHP/countryBorders.php',
  method: 'GET',
  dataType: 'json',
  success: function(data) {
    if (data.status.code === '200') {
      selectElement.html(data.data.options); // Adding the options to the HTML select element
    } else {
      console.log('Error:', data.status.description);
    }
  },
  error: function(error) {
    console.log('Error:', error);
  }
});

$('#selectCountryBtn').click(function() {
  var selectedIso2 = selectElement.val();

  if (selectedIso2) {
    // Fetching the country coordinates based on the ISO2 code
    $.ajax({
    url: 'lib/PHP/countryCoordinates.php',
    method: 'GET',
    dataType: 'json',
    data: { iso2: selectedIso2 },
    success: function(data) {
      if (data.status.code === '200') {
        var countryCoordinates = data.data.coordinates;

        // Clearing previous GeoJSON layer from the map
        if (geojsonLayer) {
          map.removeLayer(geojsonLayer);
        }

        // Createing GeoJSON layer
        geojsonLayer = L.geoJSON(countryCoordinates).addTo(map);

        // Fitting the map to the bounds of the GeoJSON layer
        map.fitBounds(geojsonLayer.getBounds());
      } else {
        console.log('Error:', data.status.description);
      }
      },
      error: function(error) {
        console.log('Error:', error);
      }
    });
  }
});

// Using JS Navigator to display user's location upon opening the website
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
  
      var geolocationMarker = L.marker([latitude, longitude]).bindPopup('This Is Your Current Location!').addTo(map);
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