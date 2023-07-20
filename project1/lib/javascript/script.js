// Preloader Script
$(window).on('load', function () {
    if ($('#preloader').length) {$('#preloader').delay(500).fadeOut('slow', function () {
        $(this).remove();
    });
}});

// Initializing Leaflet map
var map = L.map('map').setView([0, 0], 0);
var marker;
var geojsonLayer;
var markersClick = [];

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

// Wikipedia Links overlay
var wikipediaLayerGroup = L.layerGroup.wikipediaLayer({
  images: 'leaflet-wikipedia-master/images',
  target: '_blank',
  limit: '50',
  popupOnMouseover: true,
  clearOutsideBounds: true,
});


// Leaflet Map Layer Control
var baseMaps = {
  'Stadia Alidade Smooth Dark': Stadia_AlidadeSmoothDark,
  'Esri World Imagery': Esri_WorldImagery,
  'Open Street Map': osm,
  "<span style='color: #6b0f0f'>OpenStreetMap HOT</span>": OpenStreetMap_HOT
};

var overlayMap = {
  'Wikipedia Links': wikipediaLayerGroup
}

// Base layerControl
var layerControl = L.control.layers(baseMaps, overlayMap).addTo(map);


var latitudeDisplay = $('.latResult');
var longitudeDisplay = $('.lngResult');

// Displays the Lat&Lng of clicked location as Inputs Value
map.on('click', function(e) {
  latitudeDisplay.val(e.latlng.lat);
  longitudeDisplay.val(e.latlng.lng);
});

// Puts a Marker On Clicked Location
function onMapClick(e) {
  var marker = L.marker(e.latlng).addTo(map);
  markersClick.push(marker);
}

map.on('click', onMapClick);

// Deletes The Markers One by One
$('#deleteMarkerBtn').click(function() {
  if (markersClick.length > 0) {
    let marker = markersClick.pop();
    map.removeLayer(marker);
    
    latitudeDisplay.val('');
    longitudeDisplay.val('');
  }
});

// Deletes All Markers
$('#deleteAllMarkersBtn').click(function() {
  for (var i = 0; i < markersClick.length; i++) {
    var marker = markersClick[i];
    map.removeLayer(marker);
  }
  markersClick = [];

  latitudeDisplay.val('');
  longitudeDisplay.val('');
});

// Taking user's location and setting it as default selected country with a marker on his location
var selectElement = $('#selectCountry');

$.ajax({
  url: 'lib/PHP/countryBorders.php',
  method: 'GET',
  dataType: 'json',
  success: function(data) {
    if (data.status.code === '200') {
      selectElement.html(data.data.options); // Adding the options to the HTML select element

      // Retrieve the user's country ISO2 code
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;

          // Adding a marker on current user's location
          var geolocationMarker = L.marker([latitude, longitude]).bindPopup('This Is Your Current Location!').addTo(map);
          markersClick.push(geolocationMarker);

          var geocodingUrl = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + latitude + '&lon=' + longitude;
          $.ajax({
            url: geocodingUrl,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
              if (response.address && response.address.country_code) {
                var userCountryIso2 = response.address.country_code.toUpperCase();

                selectElement.val(userCountryIso2);
                selectElement.trigger('change');

              } else {
                alert('Country code not found in geocoding response');
              }
            },
            error: function (xhr, status, error) {
              alert('Reverse geocoding failed:', error);
            }
          });

          latitudeDisplay.val(latitude);
          longitudeDisplay.val(longitude);

        });
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    } else {
      alert('Error:', data.status.description);
    }
  },
  error: function(error) {
    alert('Error:', error);
  }
});


// Adding a highlighted borders on the selected country
$('#selectCountry').on('change', function() {
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

          // Creating GeoJSON layer
          geojsonLayer = L.geoJSON(countryCoordinates).addTo(map);
          geojsonLayer.setStyle({ color: '#2661bf', fillColor: '#4287f5' });

          // Fitting the map to the bounds of the GeoJSON layer
          map.fitBounds(geojsonLayer.getBounds());

          
        } else {
          alert('Error:', data.status.description);
        }
      },
      error: function(error) {
        alert('Error:', error);
      }
    });
  }
});


// APIs Info Tables
var countryInfoDiv = $('#CountryInfoResultsDiv');
var currencyDiv = $('#CurrencyResultsDiv');
var timezoneDiv = $('#TimezoneResultsDiv');
var weatherDiv = $('#WeatherResultsDiv');
var tableOverlay = $('#tableOverlay');


// Get Info Based on The Selected Country (GeoNames API)
function getCountryInfoBySelected() {
  if (currencyDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block' || weatherDiv.css('display') === 'block') {
    $(currencyDiv).add(timezoneDiv).add(weatherDiv).css('display', 'none');
  }

  var selectedIso2 = $('#selectCountry').val();

  if (selectedIso2) {
    // Fetching the country information based on the ISO2 code
    $.ajax({
      url: 'lib/PHP/countryInformation.php',
      method: 'POST',
      dataType: 'json',
      data: { iso2: selectedIso2 },
      success: function(data) {
        if (data.status.code === '200') {
          var countryInfo = data.data;

          // Displaying country information in the easy button
          $('#CountryContinentResult').html(countryInfo.continent);
          $('#CountryNameResult').html(countryInfo.country);
          $('#CountryCodeResult').html(countryInfo.country_code);
          $('#CountryCapitalResult').html(countryInfo.capital);
          $('#CountryPopulationResult').html(countryInfo.population);
          $('#CountryLanguageResult').html(countryInfo.language);

          // Show the country information div
          countryInfoDiv.css('display', 'block');
          tableOverlay.css('display', 'block');
        } else {
          alert('Error:', data.status.description);
        }
      },
      error: function(error) {
        alert('Error:', error);
      }
    });
  }
}

// Get Country Currency Information -- (OpenCage API)
function getCurrencyInfoBySelected() {
  // Hiding the other tables
  if (countryInfoDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block' || weatherDiv.css('display') === 'block') {
    $(countryInfoDiv).add(timezoneDiv).add(weatherDiv).css('display', 'none');
  }

  var selectedIso2 = $('#selectCountry').val();

  if (selectedIso2) {
    $.get('https://api.opencagedata.com/geocode/v1/json', {
      q: selectedIso2,
      key: 'a9539fc65a4c4710bcf9c629eb4a60dc',
    }, function(data) {
      var currencyInfo = data.results[0].annotations.currency;

      $('#CurrencyISOCodeResult').html(currencyInfo.iso_code);
      $('#CurrencyNameResult').html(currencyInfo.name);
      $('#CurrencySubunitResult').html(currencyInfo.subunit);

      var currencyCode = currencyInfo.iso_code;

      // Make a request to get the exchange rate
      $.get('https://openexchangerates.org/api/latest.json', {
        app_id: '61ce4d4569c8431988a21c5d58020ac5',
        base: 'USD',
        symbols: currencyCode,
      }, function(exchangeRateData) {
        var exchangeRate = exchangeRateData.rates[currencyCode];

        $('#CurrencyExchangeResult').html(exchangeRate);
      });

      currencyDiv.css('display', 'block');
      tableOverlay.css('display', 'block');
    });
  }
}

// Get Country Timezone -- (OpenCage API)
function getTimezoneInfoBySelected() {

  // Hiding The other Tables
  if (countryInfoDiv.css('display') === 'block' || currencyDiv.css('display') === 'block' || weatherDiv.css('display') === 'block') {
      $(countryInfoDiv).add(currencyDiv).add(weatherDiv).css('display', 'none');
  };
    
  var selectedIso2 = $('#selectCountry').val();
    
  $.get('https://api.opencagedata.com/geocode/v1/json', {
    q: selectedIso2,
    key: 'a9539fc65a4c4710bcf9c629eb4a60dc',
    }, function(data) {
      var timezoneInfo = data.results[0].annotations.timezone;
    
      $('#TimezoneNameResult').html(timezoneInfo.name);
      $('#TimezoneDstResult').html(timezoneInfo.now_in_dst + 'Hr');
      $('#TimezoneSecResult').html(timezoneInfo.offset_sec + 's');
      $('#TimezoneStringResult').html(timezoneInfo.offset_string);
      $('#TimezoneShortNameResult').html(timezoneInfo.short_name);

      // results table
      timezoneDiv.css('display', 'block');
      tableOverlay.css('display', 'block');
  });
}

// Retrive Weather Data -- (OpenWeather API)
function getWeatherInfoByCoords() {
  // Hiding The other Tables
  if (countryInfoDiv.css('display') === 'block' || currencyDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block') {
    $(countryInfoDiv).add(currencyDiv).add(timezoneDiv).css('display', 'none');
  }

  var appid = 'd82b4a56a2b2017d3b9863326d8378ec';
  var latitude = latitudeDisplay.val();
  var longitude = longitudeDisplay.val();

  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appid}`,
    method: 'GET',
    dataType: 'JSON',
    success: function(data) {
      if (!data.weather || data.weather.length === 0) {
        alert('Weather Data not found.');
        return;
      }
      var weatherData = data.weather[0];
      var mainWeather = data.main;
      var windData = data.wind;
      var visibility = data.visibility;

      var iconUrl = `http://openweathermap.org/img/w/${weatherData.icon}.png`;

      $("#WeatherMainResult").text(weatherData.main);
      $("#WeatherDescResult").text(weatherData.description);
      $("#WeatherIconResult").html(`<img src="${iconUrl}" alt="Weather Icon">`);
      $("#WeatherTempResult").text(mainWeather.temp + "°C");
      $("#WeatherFeelsLikeResult").text(mainWeather.feels_like + "°C");
      $("#WeatherTempMinResult").text(mainWeather.temp_min + "°C");
      $("#WeatherTempMaxResult").text(mainWeather.temp_max + "°C");
      $("#WeatherPressureResult").text(mainWeather.pressure + " hPa");
      $("#WeatherWindSpeedResult").text(windData.speed + " m/s");
      $("#WeatherVisibilityResult").text(visibility + " meters");

      // results table
      weatherDiv.css('display', 'block');
      tableOverlay.css('display', 'block');

    },
    error: function(error) {
      alert(`Make sure to place a marker! ${error.description}`);
    }
  })
};

// Locate Button To Display User's Current Location
L.control.locate().addTo(map);
// Map Info Buttons
var countryInfoBtn = L.easyButton('fa-solid fa-info', getCountryInfoBySelected, 'Country Info').addTo(map);
var currencyInfoBtn = L.easyButton('fa-sharp fa-solid fa-coins', getCurrencyInfoBySelected, 'Currency Info').addTo(map);
var timezoneInfoBtn = L.easyButton('fa-solid fa-clock', getTimezoneInfoBySelected, 'Country Timezone').addTo(map);
var weatherInfoBtn = L.easyButton('fa-solid fa-cloud', getWeatherInfoByCoords, 'Weather Info based on the placed markers').addTo(map);

// Overlay to hide results tables
$('#tableOverlay').click(function() {
  $(this).css('display', 'none');
  $(countryInfoDiv).css('display', 'none');
  $(currencyDiv).css('display', 'none');
  $(timezoneDiv).css('display', 'none');
  $(weatherDiv).css('display', 'none');
});

// Closing the results window
$('.closeWindowBtn').click(function() {
  tableOverlay.css('display', 'none');
  countryInfoDiv.css('display', 'none');
  currencyDiv.css('display', 'none');
  timezoneDiv.css('display', 'none');
  weatherDiv.css('display', 'none');
});