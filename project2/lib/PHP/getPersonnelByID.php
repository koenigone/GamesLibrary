<?php

  header('Content-Type: application/json; charset=UTF-8');
	$executionStartTime = microtime(true);

	include("config.php");

	$query = $conn->prepare('SELECT p.id, p.firstName, p.lastName, p.email, p.jobTitle, p.departmentID, d.name as departmentName, l.name as locationName 
    FROM personnel p 
    LEFT JOIN department d ON p.departmentID = d.id 
    LEFT JOIN location l ON d.locationID = l.id 
    WHERE CONCAT(p.firstName, " ", p.lastName) LIKE ?');

    $searchTerm = '%' . $_REQUEST['name'] . '%';
    $query->bind_param("s", $searchTerm);
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
