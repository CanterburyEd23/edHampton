<?php
    //Fetch and prepare the data from the countryBorders file
	$dataFetch = file_get_contents("../json/countryBorders.geo.json");
	$data = json_decode($dataFetch);
	$features = $data->features;
	
    //Create the coordinates string, and populate it with the requested country outline info
	$coordinates = "";	    
    for( $i = 0; $i < sizeof($features); $i++ ) {  //for each feature in the features array, if the iso2 code matches the request input, do...      
        $feature = $features[$i];
        if ($feature->properties->iso_a2 === $_GET['Country']) {
            $coordinates = $feature->geometry;            
            break;
        }
	};

	print_r(json_encode($coordinates));  //Returns the coordinates string as readable JSON.
?>
