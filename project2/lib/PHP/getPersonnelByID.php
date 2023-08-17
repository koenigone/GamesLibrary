<?php

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	$query = $conn->prepare('SELECT p.id, p.firstName, p.lastName, p.email, p.jobTitle, p.departmentID, d.name as departmentName, l.name as locationName 
    FROM personnel p 
    LEFT JOIN department d ON p.departmentID = d.id 
    LEFT JOIN location l ON d.locationID = l.id 
    WHERE p.id = ?');

$query->bind_param("i", $_REQUEST['id']);
$query->execute();

$result = $query->get_result();
$personnel = [];

while ($row = mysqli_fetch_assoc($result)) {
array_push($personnel, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $personnel;

mysqli_close($conn);
echo json_encode($output);

?>