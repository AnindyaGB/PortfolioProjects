<?php

	$executionStartTime = microtime(true) / 1000;

	//$url= 'https://openexchangerates.org/api/latest.json?app_id=0f67b20b1dd94b68aaabb87421ce8687&symbols='. $_REQUEST['currencyCode']
	//$url = 'https://api.exchangeratesapi.io/latest?symbols='. $_REQUEST['currencyCode'];
	$url = 'https://v6.exchangerate-api.com/v6/47e5a1fc1aa02bbd3ccc8292/latest/'. $_REQUEST['currencyCode'];
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['conversion_rates'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
