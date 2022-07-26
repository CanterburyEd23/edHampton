<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getStaffFiltered.php

	// remove next two lines for production	
	// ini_set('display_errors', 'On');  //error reporting for development
	// error_reporting(E_ALL);

	//Open a connection to the database
	$executionStartTime = microtime(true);
	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');
		
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	//Connection error handling
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

	//On success...	
	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production    
    if ($_REQUEST['departmentID'] > 0 && $_REQUEST['locationID'] > 0) {
        $query = $conn->prepare('SELECT * FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.departmentID = ? AND d.locationID = ? ORDER BY p.lastName, p.firstName, d.name, l.name');
        $query->bind_param("ii", $_REQUEST['departmentID'], $_REQUEST['locationID']);
    } elseif ($_REQUEST['departmentID'] > 0 && $_REQUEST['locationID'] <= 0) {
        $query = $conn->prepare('SELECT * FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.departmentID = ? ORDER BY p.lastName, p.firstName, d.name, l.name');
        $query->bind_param("i", $_REQUEST['departmentID']);
    } elseif ($_REQUEST['departmentID'] <= 0 && $_REQUEST['locationID'] > 0) {
        $query = $conn->prepare('SELECT * FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.locationID = ? ORDER BY p.lastName, p.firstName, d.name, l.name');
        $query->bind_param("i", $_REQUEST['locationID']);
    } else {
        $query = $conn->prepare('SELECT * FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name');
    };    
	$query->execute();
		
	//Query error handling
	if (false === $query) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}
    
	//Query success
    $result = $query->get_result();
   	$data = [];
	while ($row = mysqli_fetch_assoc($result)) {
		array_push($data, $row);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);
	echo json_encode($output); 

?>
