<?php
    $executionStartTime = microtime(true) / 1000;
    $result = file_get_contents('countryBorders.geo.json'); // Reading The geo.json file
    $data = json_decode($result, true);

    $options = '';
    foreach ($data['features'] as $feature) {
        $iso2 = $feature['properties']['iso_a2'];
        $countryName = $feature['properties']['name'];

        $options .= "<option value=\"$iso2\">$countryName</option>"; // fetching the data into the $options variable
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['options'] = $options;

    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
?>