<?php

	// example use from browser
	// http://localhost/companydirectory/libraries/php/deleteDepartmentStaffCheck.php?id=<ID>

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
	// $_REQUEST used for development / debugging. Remember to change to $_GET for production

	// 'SELECT firstName FROM personnel WHERE departmentID =  ?'

	$query = $conn->prepare('SELECT count(id) as pc FROM personnel WHERE departmentID = ?');
	$query->bind_param("i", $_GET['ID']);
	$query->execute();
	
	//Query error handling
	if (false === $query) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		echo json_encode($output);	
		mysqli_close($conn);
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

	echo json_encode($output);
	mysqli_close($conn);

?>
