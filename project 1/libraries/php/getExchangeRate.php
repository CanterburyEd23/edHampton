<?php
    //URL construction
	$url='https://openexchangerates.org/api/latest.json?app_id=' . $_REQUEST['APIKey'];

	$ch = curl_init();
	//cURL object creation
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
	//cURL execution
    $result=curl_exec($ch);
	curl_close($ch);  //cURL cleanup

	//Conversion of results into an associative array
    $decode = json_decode($result,true);	

	//Setting correct header and response info
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);
?>
