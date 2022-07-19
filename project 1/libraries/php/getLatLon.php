<?php
    //URL construction
	$url='http://api.openweathermap.org/geo/1.0/direct?q=' . $_GET['CityName'] . '&limit=1&appid=05b5574976782477ccf8ab24bedc1f41';

	//cURL object creation, execution, and cleanup
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
    $result=curl_exec($ch);
	curl_close($ch);

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
