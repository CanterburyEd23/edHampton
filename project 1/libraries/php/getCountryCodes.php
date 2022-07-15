<?php
    //Fetch and prepare the data from the countryBorders.geo.json file
	$dataFetch = file_get_contents("../json/countryBorders.geo.json");
	$data = json_decode($dataFetch);
	$features = $data->features;

	//Create and populate the all_countries array from the features array.
	$all_countries = array();
	for( $i = 0; $i < sizeof($features); $i++ ) {  //for each feature in the features array, do...
    	$feature = $features[$i];
   		$country_name = $feature->properties->name;
   		$country_code = $feature->properties->iso_a2;
    	$array = [$country_name, $country_code];  
   		array_push($all_countries, $array);  //extract the country name and ISO2 code from each feature, put them into an array, and push that array to the all_countries array.
	}

	//Sort the all_countries array into alphabetical order, based on the country_name property of each nested array.
	usort($all_countries, function($country1, $country2) {
   		return strcasecmp($country1[0], $country2[0]);
	});

	print_r(json_encode($all_countries));  //Returns the all_countries array as readable JSON.
?>
