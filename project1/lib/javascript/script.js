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

var latitudeDisplay = $('.latResult');
var longitudeDisplay = $('.lngResult');

// Displays the Lat&Lng of clicked location as Inputs Value
map.on('click', function(e) {
  latitudeDisplay.val(e.latlng.lat);
  longitudeDisplay.val(e.latlng.lng);

  onMapClick(e);
});

// Puts a Marker On Clicked Location
function onMapClick(e) {
  var marker = L.marker(e.latlng).addTo(map);
  markersClick.push(marker);
}


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
selectElement.on('change', function() {
  var selectedIso2 = $(this).val();

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



// Different Map Layers
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

var wikipediaLayer = L.layerGroup();
var citiesMarkerCluster = L.markerClusterGroup();

// Leaflet Map Layer Control
var baseMaps = {
  'Stadia Alidade Smooth Dark': Stadia_AlidadeSmoothDark,
  'Esri World Imagery': Esri_WorldImagery,
  'Open Street Map': osm,
  "<span style='color: #6b0f0f'>OpenStreetMap HOT</span>": OpenStreetMap_HOT
};

var overlayMaps = {
  'Wikipedia Links': wikipediaLayer,
  'Country Cities': citiesMarkerCluster
};

// Base layerControl
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);


// Wikipedia Custom Marker
var wikipediaMarkerIcon = L.icon({
  iconUrl: 'wiki-marker.png',

  iconSize:     [40, 40], // size of the icon
  iconAnchor:   [12, 45], // point of the icon which will correspond to marker's location
  popupAnchor:  [4, -40] // point from which the popup should open relative to the iconAnchor
});

// Cities Custom Marker
var CityMarkerIcon = L.icon({
  iconUrl: 'city-marker.png',

  iconSize:     [35, 40], // size of the icon
  iconAnchor:   [22, 35],
  popupAnchor:  [4, -15]
});

var countryMarker;
var capitalMarker;

// Adding Wikipedia Markers for Country & it's Capital To Base layerControl
selectElement.change(function() {
  var iso2Code = $('#selectCountry').val();

  $.ajax({
    url: 'lib/PHP/wikipedia.php',
    type: 'GET',
    data: {
      iso2: iso2Code
    },
    success: function(response) {
      var countryName = response.countryName;

      // AJAX request to fetch the latitude and longitude of the capital from OpenCage Geocoding API
      $.ajax({
        url: 'https://api.opencagedata.com/geocode/v1/json',
        type: 'GET',
        data: {
          q: countryName,
          key: 'a9539fc65a4c4710bcf9c629eb4a60dc'
        },
        dataType: 'json',
        success: function(geocodeData) {
          if (geocodeData.results.length > 0) {
            var countryLat = geocodeData.results[0].geometry.lat;
            var countryLng = geocodeData.results[0].geometry.lng;

            // Remove existing markers if any
            if (countryMarker) {
              map.removeLayer(countryMarker);
            }

            // AJAX request to get the Wikipedia link
            $.ajax({
              url: 'https://en.wikipedia.org/api/rest_v1/page/summary/' + countryName,
              type: 'GET',
              dataType: 'json',
              success: function(data) {
                var countryWikipediaUrl = data.content_urls.desktop.page;
                var countryTitle = data.title;
                var countryImage = data.thumbnail ? data.thumbnail.source : ''; // If available, use the thumbnail image
            
                // Custom HTML content for the popup
                var popupContent = `
                  <div style="text-align: center; width: 260px;">
                    <h2>${countryTitle}</h2>
                    <img src="${countryImage}" alt="${countryTitle}" style="max-width: 200px; margin: 0 auto;">
                    <p><a href="${countryWikipediaUrl}" target="_blank">Learn more about ${countryTitle}</a></p>
                  </div>
                `;
            
                // Country Wikipedia Marker
                countryMarker = L.marker([countryLat, countryLng], {icon: wikipediaMarkerIcon, title: `${countryTitle} Wikipedia link`})
                  .bindPopup(popupContent)
                  .addTo(wikipediaLayer);
              },
              error: function() {
                alert('Error fetching Wikipedia link.');

                if (countryMarker) {
                  map.removeLayer(countryMarker);
                }
              }
            });
          } else {
            alert('No data found for the country.');
          }
        },
        error: function() {
          alert('Error finding the Country Latitude and Longitude');
        }
      });
    },
    error: function() {
      alert('Error fetching country name.');
    }
  });
});


selectElement.change(function() {
  var iso2Code = $(this).val();

  // API call to Rest Countries to get the country info
  $.ajax({
    url: 'https://restcountries.com/v2/alpha/' + iso2Code,
    method: 'GET',
    success: function(data) {
      var capital = data.capital;

      // Using a geocoding service to get the lat/lng of the capital
      $.ajax({
        url: 'https://api.opencagedata.com/geocode/v1/json',
        method: 'GET',
        data: {
          key: 'a9539fc65a4c4710bcf9c629eb4a60dc',
          q: capital
        },
        success: function(response) {
          var lat = response.results[0].geometry.lat;
          var lng = response.results[0].geometry.lng;

          if (capitalMarker) {
            map.removeLayer(capitalMarker);
          }

          // Creating a Wikipedia link for the capital city
          var wikipediaLink = '<a href="https://en.wikipedia.org/wiki/' + capital + '" target="_blank"> More about ' + capital + '</a>';

          // AJAX request to get additional information from Wikipedia
          $.ajax({
            url: 'https://en.wikipedia.org/api/rest_v1/page/summary/' + capital,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
              var popupContent = '<h2>' + capital + '</h2>';
              if (data.thumbnail) {
                popupContent += '<img src="' + data.thumbnail.source + '" alt="' + capital + '" style="max-width: 200px;">';
              }
              popupContent += '<p>' + data.extract + '</p>';
              popupContent += '<p>' + wikipediaLink + '</p>';

              capitalMarker = L.marker([lat, lng], {icon: wikipediaMarkerIcon}).addTo(wikipediaLayer);
              capitalMarker.bindPopup(popupContent);
            },
            error: function() {
              alert('Error fetching Wikipedia data for the capital.');
            }
          });
        },
        error: function() {
          alert('Error retrieving geocoding data.');

          if (capitalMarker) {
            map.removeLayer(capitalMarker);
          }
        }
      });
    },
    error: function() {
      alert('Error retrieving country data.');
    }
  });
});

// an array to hold the feature groups
var markerGroups = [];

// Using GeoNames API to Retrive Country Cities and Place Markers on each City
selectElement.change(async function() {
  var iso2Code = $(this).val();
  var username = 'mohammadmohammad';
  var maxRows = 50;

  try {
    const data = await $.ajax({
      url: `http://api.geonames.org/searchJSON?country=${iso2Code}&maxRows=${maxRows}&username=${username}`,
      method: 'GET',
      dataType: 'JSON',
    });

    // Clearing the existing markers before adding new ones
    citiesMarkerCluster.clearLayers();
    markerGroups = []; // Clear the previous marker groups

    // Splitting the markers into groups of 10
    var groupSize = 10;
    for (var i = 0; i < data.geonames.length; i += groupSize) {
      var markersSubset = data.geonames.slice(i, i + groupSize);
      var markerGroup = L.featureGroup();

      markersSubset.forEach(function(city) {
        var marker = L.marker([city.lat, city.lng]);

        marker.bindPopup(city.name);
        markerGroup.addLayer(marker);
      });

      markerGroups.push(markerGroup);
      citiesMarkerCluster.addLayer(markerGroup);
    }

  } catch (error) {
    alert('Error fetching cities:', error);
  }
});



// APIs Info Tables
var countryInfoDiv = $('#CountryInfoResultsDiv');
var currencyDiv = $('#CurrencyResultsDiv');
var timezoneDiv = $('#TimezoneResultsDiv');
var weatherDiv = $('#WeatherResultsDiv');
var wikipediaDiv = $('#WikipediaResultsDiv');
var tableOverlay = $('#tableOverlay');
var closeBtn = $('.closeWindowBtn');


// Get Info Based on The Selected Country (GeoNames API)
function getCountryInfoBySelected() {
  if (currencyDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block' || weatherDiv.css('display') === 'block' || wikipediaDiv.css('display') === 'block') {
    $(currencyDiv).add(timezoneDiv).add(weatherDiv).add(wikipediaDiv).css('display', 'none');
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
          closeBtn.css('display', 'block');
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
  if (countryInfoDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block' || weatherDiv.css('display') === 'block' || wikipediaDiv.css('display') === 'block') {
    $(countryInfoDiv).add(timezoneDiv).add(weatherDiv).add(wikipediaDiv).css('display', 'none');
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
      closeBtn.css('display', 'block');
    });
  }
}

// Get Country Timezone -- (OpenCage API)
function getTimezoneInfoBySelected() {

  // Hiding The other Tables
  if (countryInfoDiv.css('display') === 'block' || currencyDiv.css('display') === 'block' || weatherDiv.css('display') === 'block' || wikipediaDiv.css('display') === 'block') {
      $(countryInfoDiv).add(currencyDiv).add(weatherDiv).add(wikipediaDiv).css('display', 'none');
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
      closeBtn.css('display', 'block');
  });
}

// Retrive Weather Data -- (OpenWeather API)
function getWeatherInfoByCoords() {
  // Hiding The other Tables
  if (countryInfoDiv.css('display') === 'block' || currencyDiv.css('display') === 'block' || timezoneDiv.css('display') === 'block' || wikipediaDiv.css('display') === 'block') {
    $(countryInfoDiv).add(currencyDiv).add(timezoneDiv).add(wikipediaDiv).css('display', 'none');
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
      closeBtn.css('display', 'block');
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
$('#tableOverlay, .closeWindowBtn').click(function() {
  $('#tableOverlay').add('.closeWindowBtn').css('display', 'none');
  countryInfoDiv.css('display', 'none');
  currencyDiv.css('display', 'none');
  timezoneDiv.css('display', 'none');
  weatherDiv.css('display', 'none');
  wikipediaDiv.css('display', 'none');
});