<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="lib/style/style.css">
    <link rel="stylesheet" href="lib/style/mobileSideBar.css">
    <link rel="stylesheet" href="lib/style/preloader.css">
    <link rel="stylesheet" href="bootstrap-5.0.2-dist\css\bootstrap.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <link rel="stylesheet" href="leaflet-locatecontrol-gh-pages\dist\L.Control.Locate.min.css">
    <link rel="stylesheet" href="Leaflet.EasyButton-master\src\easy-button.css">
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="leaflet-locatecontrol-gh-pages\dist\L.Control.Locate.min.js"></script>
    <script src="Leaflet.EasyButton-master\src\easy-button.js"></script>
    <script src="https://kit.fontawesome.com/16651470f2.js" crossorigin="anonymous"></script>
    <script type="application/javascript" src="lib/javascript/jquery-3.7.0.min.js"></script>
    <title>GAZETTEER</title>
</head>
<body>
    <!------- HEADER SECTION ------->
    <header class="navbar">
        <!-- logo -->
        <div class="main-logo">
            <img src="tempLogo.png" alt="missing img">
            <span class="title-blue">GAZE</span>
            <span class="title-green">TT</span>
            <span class="title-red">EER</span>
        </div>

        <!-- searchbar -->
        <div class="selectCountryDiv">
            <select class="form-select" id="selectCountry" name="selectCountry">
                <option>Select Country</option>
                <?php
                    include 'lib/PHP/countryBorders.php';
                    echo implode("\n", $options);
                ?>
            </select>
            <button type="button" id="selectCountryBtn">Search</button>
        </div>

        <!-- On Click Lat & Lng -->
        <div class="mapClickResultDiv">
            <input type="text" class="form-control clickLat" id="latResult" placeholder="latitude" readonly>
            <input type="text" class="form-control clickLng" id="lngResult" placeholder="longitude" readonly>
        </div>

        <div id="sidebar-button">
            <i id="sidebar-button" class="fa-solid fa-bars"></i>
        </div>

    </header>
    <!------- MAIN SECTION ------->
    <main>
        <div class="mobile-sidebar">
            <div id="overlay"></div>
            <div id="sidebar">
                <!-- Item One-->
                <div class="navbar-head sidebar-item">
                    <span class="title-blue">GAZE</span>
                    <span class="title-green">TT</span>
                    <span class="title-red">EER</span>
                </div>
                <!-- Item Two-->
                
                
                <div class="div-rights">
                    <h5>Developed by <i class="fa-regular fa-copyright"></i> KoenigOne<br>mm6dd.mh@gmail.com</h5>
                </div>
            </div>
        </div>

        <!-- Main Map Div -->
        <div id="map"></div>

        <!-- Markers Control Buttons -->
        <div class="markersControlBtns">
            <button id="deleteMarkerBtn" title="delete marker"><i class="fa-regular fa-square-minus"></i></button>
            <button id="deleteAllMarkersBtn" title="delete all markers"><i class="fa-solid fa-delete-left"></i></button>
        </div>
        
        <div id='CountryInfoResultsDiv'>
            <button type="button" class="closeWindowBtn btn btn-secondary">Close</button>
            <!--- Country Info Table --->
            <table class="CountryInfoTable">
                <thead>
                    <th>Component</th>
                    <th>Result</th>
                </thead>
                <tbody>
                    <tr>
                        <th>continent</th>
                        <td id="CountryContinentResult"></td>
                    </tr>
                    <tr>
                        <th>country</th>
                        <td id="CountryNameResult"></td>
                    </tr>
                    <tr>
                        <th>Country Code:</th>
                        <td id="CountryCodeResult"></td>
                    </tr>
                    <tr>
                        <th>Postcode</th>
                        <td id="CountryPostcodeResult"></td>
                    </tr>
                    <tr>
                        <th>State</th>
                        <td id="CountryStateResult"></td>
                    </tr>
                    <tr>
                        <th>State Code</th>
                        <td id="CountryStateCodeResult"></td>
                    </tr>
                    <tr>
                        <th>State District</th>
                        <td id="CountryStateDistrictResult"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!--- Country Currency Table --->
        <div id='CurrencyResultsDiv'>
            <button type="button" class="closeWindowBtn btn btn-secondary">Close</button>
            <table>
                <thead>
                    <th>Component</th>
                    <th>Result</th>
                </thead>
                <tbody>
                    <tr>
                        <td>ISO Code:</td>
                        <td id="CurrencyISOCodeResult"></td>
                    </tr>
                    <tr>
                        <td>Currency Name:</td>
                        <td id="CurrencyNameResult"></td>
                     </tr>
                    <tr>
                        <td>Subunit:</td>
                        <td id="CurrencySubunitResult"></td>
                    </tr>
                    <tr>
                        <td>Flag:</td>
                        <td id="CurrencyFlagResult"></td>
                    </tr>
                </tbody>
            </table>
        </div>

            <!--- Country Timezone Table --->
        <div id='TimezoneResultsDiv'>
            <button type="button" class="closeWindowBtn btn btn-secondary">Close</button>
            <table>
                <thead>
                    <th>Component</th>
                    <th>Result</th>
                </thead>
                <tbody>
                    <tr>
                        <td>name</td>
                        <td id="TimezoneNameResult"></td>
                    </tr>
                    <tr>
                        <td>now_in_dst</td>
                        <td id="TimezoneDstResult"></td>
                    </tr>
                    <tr>
                        <td>offset_sec</td>
                        <td id="TimezoneSecResult"></td>
                    </tr>
                    <tr>
                        <td>offset_string</td>
                        <td id="TimezoneStringResult"></td>
                    </tr>
                        <tr>
                        <td>short_name</td>
                        <td id="TimezoneShortNameResult"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!--- Country Weather Table --->
        <div id='WeatherResultsDiv'>
            <button type="button" class="closeWindowBtn btn btn-secondary">Close</button>
            <table>
                 <thead>
                    <th>Component</th>
                    <th>Result</th>
                </thead>
                <tbody>
                    <tr>
                        <td>weatherMain</td>
                        <td id="WeatherMainResult"></td>
                    </tr>
                    <tr>
                        <td>weatherDesc</td>
                        <td id="WeatherDescResult"></td>
                    </tr>
                    <tr>
                        <td>weatherIcon</td>
                        <td id="WeatherIconResult"></td>
                    </tr>
                    <tr>
                        <td>tamp</td>
                        <td id="WeatherTempResult"></td>
                     </tr>
                    <tr>
                        <td>feels_like</td>
                        <td id="WeatherFeelsLikeResult"></td>
                    </tr>
                    <tr>
                        <td>temp_min</td>
                        <td id="WeatherTempMinResult"></td>
                    </tr>
                    <tr>
                        <td>temp_max</td>
                        <td id="WeatherTempMaxResult"></td>
                     </tr>
                    <tr>
                        <td>pressure</td>
                        <td id="WeatherPressureResult"></td>
                    </tr>
                    <tr>
                        <td>wind_speed</td>
                        <td id="WeatherWindSpeedResult"></td>
                     </tr>
                    <tr>
                        <td>visibility</td>
                        <td id="WeatherVisibilityResult"></td>
                    </tr>
                </tbody>
            </table>
        </div>

    </main>
    
    <div id="preloader"></div>
    <script type="application/javascript" src="lib/javascript/script.js"></script>
    <script type="application/javascript" src="lib/javascript/mobileSideBar.js"></script>
</body>
</html>