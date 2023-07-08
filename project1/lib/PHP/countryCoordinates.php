<?php
    $executionStartTime = microtime(true) / 1000;

    // Checking if the ISO2 is valid
    if (!isset($_GET['iso2'])) {
        $output['status']['code'] = "400";
        $output['status']['name'] = "Bad Request";
        $output['status']['description'] = "ISO2 code is missing.";
        $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
        exit;
    }

    $iso2 = $_GET['iso2'];

    $result = file_get_contents('countryBorders.geo.json');
    $data = json_decode($result, true);

    $countryCoordinates = null;
    foreach ($data['features'] as $feature) { // Getting Countries Coordinates To Hightlight Their Bordres Nn The Map
        if ($feature['properties']['iso_a2'] === $iso2) {
            $countryCoordinates = $feature['geometry'];
            break;
        }
    }

    if ($countryCoordinates) {
        $output['status']['code'] = "200";
        $output['status']['name'] = "OK";
        $output['status']['description'] = "Success";
        $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
        $output['data']['coordinates'] = $countryCoordinates;
    } else {
        $output['status']['code'] = "404";
        $output['status']['name'] = "Not Found";
        $output['status']['description'] = "Country not found.";
        $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    }

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
?>