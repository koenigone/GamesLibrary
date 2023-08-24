<?php

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);
    exit;
}

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
