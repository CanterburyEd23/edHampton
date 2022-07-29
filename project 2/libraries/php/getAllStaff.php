<?php

	// example use from browser
	// http://localhost/companydirectory/libraries/php/getAllStaff.php

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
	$query = 'SELECT p.id, p.lastName, p.firstName FROM personnel p ORDER BY p.lastName, p.firstName'; // SQL does not accept parameters and so is not prepared

	$result = $conn->query($query);
	
	//Query error handling
	if (!$result) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}
    
	//Query success
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
