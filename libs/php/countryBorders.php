<?php

     $executionStartTime = microtime(true);

 
   $countryData = json_decode(file_get_contents("countryBorders.geo.json"), true);

  // geojson = {"type":"FeatureCollection","features": [{"type":"Feature","properties":countryBorders['features'][j]['properties'],"geometry":countryBorders['features'][j]['geometry']}]};

//$countryData['features'][i]['geometry']

/*
for ($x = 0; $x < count($countryData['features']); $x++) {
    if($countryData['features'][$x]['properties']['iso_a2'] == $_REQUEST['code_a2']){
        $border = $countryData['features'][$x];
        return $border;

    }
  
}
*/



    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $countryData['features'];
    

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>