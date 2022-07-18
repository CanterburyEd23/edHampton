<?php
    //URL construction
	$url='http://api.geonames.org/wikipediaBoundingBoxJSON?north=' . $_GET['North'] . '&south=' . $_GET['South'] . '&east=' . $_GET['East'] . '&west=' . $_GET['West'] . '&username=canterburyed23';

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