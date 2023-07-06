<?php
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    // Generating Options from an exteranl file
    $json = file_get_contents('countryBorders.geo.json');
    $data = json_decode($json, true);

    $options = [];

    foreach ($data['features'] as $feature) {
        $isoCode = $feature['properties']['iso_a2'];
        $countryName = $feature['properties']['name'];

        $options[] = "<option value=\"$isoCode\">$countryName</option>";
    }

    echo implode("\n", $options);
?>