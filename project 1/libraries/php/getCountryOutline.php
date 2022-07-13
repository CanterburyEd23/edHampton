<?php
    //Fetch and prepare the data from the countryBorders file
	$dataFetch = file_get_contents("../json/countryBorders.geo.json");
	$data = json_decode($dataFetch);
	$features = $data->features;
	
	$coordinates = "";
	    
    for( $i = 0; $i < sizeof($features); $i++ ) {  //for each feature in the features array, if the iso2 code matches the request input...      
        $feature = $features[$i];
        if ($feature->properties->iso_a2 === $_GET['Country']) {
            $coordinates = $feature->geometry;            
            break;
        }
	};

	print_r(json_encode($coordinates));  //Returns the coordinates array as readable JSON.
?>
