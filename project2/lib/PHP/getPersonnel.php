<?php

header('Content-Type: application/json; charset=UTF-8');
$executionStartTime = microtime(true);

include("config.php");

$query = "SELECT personnel.*, department.name as departmentName, location.name as locationName
          FROM personnel 
          LEFT JOIN department ON personnel.departmentID = department.id
          LEFT JOIN location ON department.locationID = location.id
          ORDER BY lastName ASC";

$result = mysqli_query($conn, $query);

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);

?>
