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

// Default map layer
var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);


var latitudeDisplay = $('.latResult');
var longitudeDisplay = $('.lngResult');

// Taking user's location and setting it as default selected country with a marker on his location
var userLocationMarker = L.ExtraMarkers.icon({
  shape: 'circle',
  markerColor: 'green',
  icon: 'fa-solid fa-street-view',
  iconColor: 'white', // Icon color
  iconRotate: 0,
  number: '1',
  svg: false
});

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
          var geolocationMarker = L.marker([latitude, longitude], {icon: userLocationMarker}).bindPopup('This Is Your Current Location!').addTo(map);
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
          geojsonLayer.setStyle({ color: '#47d185', fillColor: '#6ee0a1' });

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

var OpenStreetMap_BZH = L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
	bounds: [[46.2, -5.5], [50, 0.7]]
});

var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var wikipediaLayer = L.layerGroup().addTo(map);
var citiesMarkerCluster = L.markerClusterGroup().addTo(map);
var airportMarkerCluster = L.markerClusterGroup().addTo(map);
var prisonsMarkerCluster = L.markerClusterGroup().addTo(map);
var universityMarkerCluster = L.markerClusterGroup().addTo(map);

// Leaflet Map Layer Control
var baseMaps = {
  "<span style='color: #6b0f0f'>OpenStreetMap HOT (Default)</span>": OpenStreetMap_HOT,
  'Esri World Imagery': Esri_WorldImagery,
  'Open Street Map': osm,
  'OpenStreet BZH': OpenStreetMap_BZH,
  'OpenStreep France': OpenStreetMap_France
};

var overlayMaps = {
  '<i class="fa-brands fa-wikipedia-w text-success"></i> Wikipedia Links': wikipediaLayer,
  '<i class="fa-solid fa-city text-success"></i> Country Cities': citiesMarkerCluster,
  '<i class="fa-solid fa-building-columns text-success"></i> Universities': universityMarkerCluster,
  '<i class="fa-solid fa-plane text-success"></i> Airports': airportMarkerCluster,
  '<i class="fa-solid fa-handcuffs text-success"></i> Prisons': prisonsMarkerCluster
};

// Base layerControl
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// Wikipedia Custom Marker
var wikipediaMarker = L.ExtraMarkers.icon({
  shape: 'circle',
  markerColor: 'blue',
  icon: 'fa-brands fa-wikipedia-w',
  iconColor: 'white',
  iconRotate: 0,
  number: '1',
  svg: false
});

// Cities Custom Marker
var citiesMarker = L.ExtraMarkers.icon({
  shape: 'square',
  markerColor: 'purple',
  icon: 'fa-solid fa-city',
  iconColor: 'white',
  iconRotate: 0,
  number: '1',
  svg: false
});

// Universities Custom Marker
var UniversityMarker = L.ExtraMarkers.icon({
  shape: 'square',
  markerColor: 'red',
  icon: 'fa-solid fa-building-columns',
  iconColor: 'white',
  number: '1',
  svg: false
});

// Airports Custom Marker
var airportMarker = L.ExtraMarkers.icon({
  shape: 'square',
  markerColor: 'white',
  icon: 'fa-solid fa-plane',
  iconColor: 'black',
  iconRotate: 50,
  number: '1',
  svg: false
});

// Prisons Custom Marker
var prisonMarker = L.ExtraMarkers.icon({
  shape: 'square',
  markerColor: 'black',
  icon: 'fa-solid fa-handcuffs',
  iconColor: 'white',
  number: '1',
  svg: false
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

      wikipediaLayer.clearLayers(); // removing layer from prev selected country

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
                countryMarker = L.marker([countryLat, countryLng], {icon: wikipediaMarker, title: `${countryTitle} Wikipedia link`});
                countryMarker.bindPopup(popupContent);
                countryMarker.addTo(wikipediaLayer);
              },
              error: function() {
                alert('Error fetching Wikipedia link.');
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

      wikipediaLayer.clearLayers(); // removing layer from prev selected country

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

              capitalMarker = L.marker([lat, lng], {icon: wikipediaMarker}).addTo(wikipediaLayer);
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
  const username = 'mohammadmohammad';
  var maxRows = 100;

  try {
    const data = await $.ajax({
      url: `https://secure.geonames.org/searchJSON?country=${iso2Code}&maxRows=${maxRows}&username=${username}`,
      method: 'GET',
      dataType: 'JSON',
    });

    citiesMarkerCluster.clearLayers(); // removing layer from prev selected country

    markerGroups = []; // Clear the previous marker groups

    // Splitting the markers into groups of 10
    var groupSize = 10;
    for (var i = 0; i < data.geonames.length; i += groupSize) {
      var markersSubset = data.geonames.slice(i, i + groupSize);
      var markerGroup = L.featureGroup();

      markersSubset.forEach(function(city) {
        var marker = L.marker([city.lat, city.lng], {icon: citiesMarker});

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

// Retriving Universities locations from GeoNames API
selectElement.change(function() {
  var iso2Code = $(this).val();
  const username = 'mohammadmohammad'

  universityMarkerCluster.clearLayers(); // removing layer from prev selected country

  // Fetch university location data from GeoNames API using AJAX
  $.ajax({
      url: `https://api.geonames.org/searchJSON?q=university&country=${iso2Code}&maxRows=10&username=${username}`,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
          data.geonames.forEach(location => {
              const lat = location.lat;
              const lng = location.lng;

              
              var universitiesMarker = L.marker([lat, lng], {icon: UniversityMarker}).addTo(universityMarkerCluster);
              universitiesMarker.bindPopup(location.name);
          });
      },
      error: function(error) {
          alert('Error fetching data:', error);
      }
  });
});

// Retriving Airports locations from GeoNames API
selectElement.change(function() {
  var iso2Code = $(this).val();

  airportMarkerCluster.clearLayers(); // removing layer from prev selected country

  $.ajax({ // retriving airports data from GeoNames API
    url: 'https://api.geonames.org/searchJSON',
    dataType: 'json',
    data: {
      country: iso2Code,
      featureCode: 'AIRP',
      maxRows: 15,
      username: 'mohammadmohammad',
    },
    success: function(data) {

      var airports = data.geonames;

      airports.forEach(function(airport) { // Placing markers on the airports
        var lat = airport.lat;
        var lng = airport.lng;
        var name = airport.name;

        var airportsMarker = L.marker([lat, lng], {icon: airportMarker}).addTo(airportMarkerCluster);
        airportsMarker.bindPopup(name).openPopup();
      });
    },
    error: function(xhr, status, error) {
      alert('Error fetching airports:', error);
    }
  });
});

// Retriving Prisons locations from GeoNames API
selectElement.change(function() {
  const iso2Code = $(this).val();
  var username = 'mohammadmohammad';

  prisonsMarkerCluster.clearLayers(); // removing layer from prev selected country

  // GeoNames API to retrive prisons locations
  $.ajax({
      url: `https://api.geonames.org/searchJSON?q=prison&country=${iso2Code}&maxRows=10&username=${username}`,
      method: 'GET',
      dataType: 'json',
      success: function(data) {
          data.geonames.forEach(location => {
              const lat = location.lat;
              const lng = location.lng;

              var prisonsMarkers = L.marker([lat, lng], {icon: prisonMarker}).addTo(prisonsMarkerCluster);

              prisonsMarkers.bindPopup(location.name);
          });
      },
      error: function(error) {
          alert('Error fetching data:', error);
      }
  });
});


// APIs Info Tables
var countryInfoDiv = $('#CountryInfoResultsDiv');
var currencyDiv = $('#CurrencyResultsDiv');
var timezoneDiv = $('#TimezoneResultsDiv');
var weatherDiv = $('#WeatherResultsDiv');

// Get Info Based on The Selected Country (GeoNames API)
function getCountryInfoBySelected() {

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
          $('#CountryISO3Result').html(countryInfo.isoAlpha3);
          $('#CountryCapitalResult').html(countryInfo.capital);
          $('#CountryPopulationResult').html(numeral(countryInfo.population).format('0,0')); // formatting the number
          $('#CountryLanguageResult').html(countryInfo.language);
          $('#CountryAreaResult').html(numeral(countryInfo.areaInSqKm).format('0,0') + ' KM');

        } else {
          alert('Error:', data.status.description);
        }
      },
      error: function(error) {
        alert('Error:', error);
      }
    });
  }
};

// Get Country Currency Information -- (OpenCage API)
function getCurrencyInfoBySelected() {
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
      $('#currencySymbol').html(currencyInfo.symbol);

      var currencyCode = currencyInfo.iso_code;

      var exchangeInput = $('#CurrencyExchangeInput'); // user input
      var exchangeResult = $('#CurrencyExchangeResult'); // result

      // Function to update the result based on the input value
      function updateResult(inputValue) {
 
        $.get('https://openexchangerates.org/api/latest.json', { // call to openExchangeRates API
          app_id: '61ce4d4569c8431988a21c5d58020ac5',
          base: 'USD',
          symbols: currencyCode,
        }, function(exchangeRateData) {
          var exchangeRate = exchangeRateData.rates[currencyCode];
          var result = (inputValue * exchangeRate).toFixed(2);
          exchangeResult.val(result);
        });
      }

      // setting default value for the input and updating the result
      exchangeInput.val(1);
      updateResult(1);

      // an event listener to capture changes in the input value
      exchangeInput.on('input', function () {
        var inputValue = parseFloat(exchangeInput.val());
        if (!isNaN(inputValue)) {
          updateResult(inputValue);
        }
      });
    });
  }
}

// Get Country Timezone -- (OpenCage API)
function getTimezoneInfoBySelected() {
  var selectedIso2 = $('#selectCountry').val();
  
  $.ajax({
    url: 'https://api.opencagedata.com/geocode/v1/json',
    data: {
      q: selectedIso2,
      key: 'a9539fc65a4c4710bcf9c629eb4a60dc'
    },
    success: function(data) {
      var timezoneInfo = data.results[0].annotations.timezone;

      $('#TimezoneNameResult').html(timezoneInfo.name);
      $('#TimezoneDstResult').html(timezoneInfo.now_in_dst + 'Hr');
      $('#TimezoneSecResult').html(timezoneInfo.offset_sec + 's');
      $('#TimezoneStringResult').html(timezoneInfo.offset_string);
      $('#TimezoneShortNameResult').html(timezoneInfo.short_name);
    },
    error: function(error) {
      alert('Error retriving the timezone of the current country', error);
    }
  });
}

// Retrive Weather Data -- (OpenWeather API)
function getWeatherInfoBySelected() {
  var selectedCountry = $('#selectCountry').val();
  var apiKey = '4a1a815cc1274059a29112128230808';
  var apiUrl = 'https://api.weatherapi.com/v1/forecast.json'; // weatherAPI endpoint

  $.ajax({
    url: apiUrl,
    type: 'GET',
    dataType: 'json',
    data: {
      key: apiKey,
      q: selectedCountry + ',iso2',
      days: 7
    },
    success: function(data) {

      var weatherLocation = data.location;
      var weatherData = data.current;
      var forecastDays = data.forecast.forecastday;

      // Looping through forcast days
      for (var i = 0; i < forecastDays.length; i++) {
        var dayData = forecastDays[i].day;
        var date = new Date(forecastDays[i].date);
        var temperature = dayData.avgtemp_c;

        var conditionCode = dayData.condition.code;
        var conditionIconUrl = dayData.condition.icon;

        var dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

        // Constructing the ID of the element based on the day abbreviation
        var temperatureElementId = '#weather' + dayOfWeek + 'Result';
        var imageElementId = '#weather' + dayOfWeek + 'Img';
        
        // Updating the content
        $(temperatureElementId).html(temperature + '°C');
        $(imageElementId).attr('src', conditionIconUrl).attr('alt', dayOfWeek);
      }

      $('#weatherCountryResult').html(weatherLocation.country);
      $('#weatherTempResult').html(weatherData.temp_c + '°C');
      $('#weatherConditionResult').html(weatherData.condition.text);
      $('#weatherLastUpdated').html(weatherData.last_updated);
    },
    error: function(error) {
      console.log('Error fetching weather data:', error);
    }
  });
}

// Locate Button To Display User's Current Location
L.control.locate().addTo(map);

// Custom EasyButtons to display Info Modals
var countryInfoModal = L.easyButton({
  states: [{
    stateName: 'show-modal',
    icon: '<i class="fas fa-info-circle text-primary"></i>',
    title: 'Show Country Info',
    onClick: function() {
      getCountryInfoBySelected();
      countryInfoDiv.modal('show');
    }
  }]
}).addTo(map);

var currencyInfoModal = L.easyButton({
  states: [{
    stateName: 'show-modal',
    icon: '<i class="fa-solid fa-money-bill text-warning"></i>',
    title: 'Show Currency Info',
    onClick: function() {
      getCurrencyInfoBySelected();
      currencyDiv.modal('show');
    }
  }]
}).addTo(map);

var timezoneInfoModal = L.easyButton({
  states: [{
    stateName: 'show-modal',
    icon: '<i class="fa-solid fa-clock text-success"></i>',
    title: 'Show Timezone Info',
    onClick: function() {
      getTimezoneInfoBySelected();
      timezoneDiv.modal('show');
    }
  }]
}).addTo(map);

var weatherInfoModal = L.easyButton({
  states: [{
    stateName: 'show-modal',
    icon: '<i class="fa-solid fa-cloud text-info"></i>',
    title: 'Show Weather Info',
    onClick: function() {
      getWeatherInfoBySelected();
      weatherDiv.modal('show');
    }
  }]
}).addTo(map);