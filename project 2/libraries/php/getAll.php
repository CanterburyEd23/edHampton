<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production	
	// ini_set('display_errors', 'On');  //error reporting for development
	// error_reporting(E_ALL);


	//creating a connection to the database...
	$executionStartTime = microtime(true);  //Timer
	include("config.php");  //connection details (need to be added to gitIgnore)
	header('Content-Type: application/json; charset=UTF-8');
		
	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);  // creates a connection to the mySQL database

	if (mysqli_connect_errno()) {  //If connection results in error, logs details, closes connection.
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}


	//On succesful connection...
	//Attempts this query
	// SQL does not accept parameters and so is not prepared
	$query = 'SELECT p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name';

	$result = $conn->query($query);
	
	//If the query results in failure, logs details and closes connection
	if (!$result) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}
    
	//If query was a success, makes each row from the database into an array entry in the data array
   	$data = [];
	while ($row = mysqli_fetch_assoc($result)) {
		array_push($data, $row);
	}

	//Then, returns success, and returns the data array in JSON format, ready for the front-end js to use, then closes the connection
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);
	echo json_encode($output); 

?>