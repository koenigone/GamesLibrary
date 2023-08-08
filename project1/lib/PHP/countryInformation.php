<?php
$executionStartTime = microtime(true) / 1000;

// Checking if the ISO2 is valid
if (!isset($_POST['iso2'])) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "ISO2 code is missing.";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

$iso2 = $_POST['iso2'];

$username = 'mohammadmohammad';
$apiURL = 'http://api.geonames.org/countryInfoJSON?country=' . $iso2 . '&username=' . $username;

$curl = curl_init($apiURL);

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);

if ($response === false) {
    $output['status']['code'] = "500";
    $output['status']['name'] = "Internal Server Error";
    $output['status']['description'] = "Error executing cURL request: " . curl_error($curl);
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    curl_close($curl);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

curl_close($curl);
$data = json_decode($response, true);

// Getting the country information
$countryInfo = $data['geonames'][0];

// Preparing the output data
$output['status']['code'] = "200";
$output['status']['name'] = "OK";
$output['status']['description'] = "Success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data']['continent'] = $countryInfo['continentName'];
$output['data']['country'] = $countryInfo['countryName'];
$output['data']['country_code'] = $countryInfo['countryCode'];
$output['data']['isoAlpha3'] = $countryInfo['isoAlpha3'];
$output['data']['capital'] = $countryInfo['capital'];
$output['data']['population'] = $countryInfo['population'];
$output['data']['language'] = $countryInfo['languages'];
$output['data']['areaInSqKm'] = $countryInfo['areaInSqKm'];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>