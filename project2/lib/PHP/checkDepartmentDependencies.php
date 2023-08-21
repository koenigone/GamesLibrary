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

// Checking if the Department has dependencies
$checkDependenciesQuery = $conn->prepare('SELECT COUNT(*) FROM personnel WHERE departmentID = ?');
$checkDependenciesQuery->bind_param("i", $_REQUEST['id']);
$success = $checkDependenciesQuery->execute();

if(!$success) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "error checking dependencies";
    $output['data'] = [];

    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$result = $checkDependenciesQuery->get_result();
$row = $result->fetch_assoc();

if ($row['COUNT(*)'] > 0) {
    $output['hasDependencies'] = true;
} else {
    $output['hasDependencies'] = false;
}

mysqli_close($conn);

echo json_encode($output);

?>
