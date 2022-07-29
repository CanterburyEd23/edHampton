<?php
	// example use from browser
	// http://localhost/companydirectory/libraries/php/insertStaff.php?name=New%20Department&locationID=<id>

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

	$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?,?,?,?,?)');
	$query->bind_param("ssssi", $_REQUEST['firstName'], $_REQUEST['lastName'], $_REQUEST['job'], $_REQUEST['email'], $_REQUEST['department']);
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
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);
	echo json_encode($output); 

?>
