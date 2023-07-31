<?php
$iso2Code = $_GET['iso2'];

$result = file_get_contents('countryBorders.geo.json'); // Reading The geo.json file
$data = json_decode($result, true);

$countryName = '';
foreach ($data['features'] as $feature) {
    if ($feature['properties']['iso_a2'] === $iso2Code) {
        $countryName = $feature['properties']['name'];
        break;
    }
}

$output['countryName'] = $countryName;
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>