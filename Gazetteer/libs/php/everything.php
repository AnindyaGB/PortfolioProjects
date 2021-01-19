<?php

	$executionStartTime = microtime(true) / 1000;

    ////////////////////////////////////////////////////////////////
    $Country = $_REQUEST['country'];
    //forward geocode
	$url='https://api.opencagedata.com/geocode/v1/json?q=' . $Country . '&key=2b658fe319ef461ca1f17b088240787c';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $forwardGeo = json_decode($result,true);	
    
    $lat = $forwardGeo['results'][0]['geometry']['lat'];
    $lng = $forwardGeo['results'][0]['geometry']['lng'];

    ///////////////////////////////////////////////////////////////
    //Weather
	$url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $lat . '&lon=' . $lng . '&exclude=minutely,hourly,daily&alerts&appid=9d7d5443594b4a598ad2f7764d07115d';

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $weather = json_decode($result,true);	
    
    /////////////////////////////////////////////////////////////////////
    //Covid
    $url='https://api.covid19api.com/total/country/' . $Country;

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $covid = json_decode($result,true);

    $Confirmed = [];
    $Deaths = [];
    $Recovered = [];
    $dateCov = [];
    foreach ($covid as $covidvalue) {

        array_push($Confirmed, $covidvalue['Confirmed']);
        array_push($Deaths, $covidvalue['Deaths']);
        array_push($Recovered, $covidvalue['Recovered']);
        $date = substr($covidvalue['Date'], 0,10);
        array_push($dateCov, $date);
    }



    /////////////////////////////////////////////////////////////
    //Rest

    $url='https://restcountries.eu/rest/v2/name/' . $Country . '?fullText=true';

    $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $rest = json_decode($result,true);	

    $capitalCity = $rest[0]['capital'];
    $currencyCode = $rest[0]['currencies'][0]['code'];
    $naitiveName = $rest[0]['nativeName'];
    $capitalCitySpace = preg_replace('/\s+/', "%20", $capitalCity );
    $capitalCityJoint = preg_replace('/,+/', "%2C%", $capitalCitySpace );

    /////////////////////////////////////////////////////////////////////
    //forward geocode for Captial City
	$url='https://api.opencagedata.com/geocode/v1/json?q=' . $capitalCityJoint . '&key=2b658fe319ef461ca1f17b088240787c';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $forwardGeoCaptial = json_decode($result,true);	

    $lat = $forwardGeo['results'][0]['geometry']['lat'];
    $lng = $forwardGeo['results'][0]['geometry']['lng'];

    //////////////////////////////////////////////////////////////////////
    //Exchange rate info

    $url = 'https://v6.exchangerate-api.com/v6/47e5a1fc1aa02bbd3ccc8292/latest/'. $currencyCode;
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$exchangeRate = json_decode($result,true);



    //outputs
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    $output['data']['countryLat'] = $lat;
    $output['data']['countryLng'] = $lng;
    $output['data']['temp'] = $weather['current']['temp'];
    $output['data']['feels_like'] = $weather['current']['feels_like'];
    $output['data']['humidity'] = $weather['current']['humidity'];
    $output['data']['wind_speed'] = $weather['current']['wind_speed'];
    $output['data']['weather'] = $weather['current']['weather'][0]['description'];

    $output['data']['covidConfirmed'] = $Confirmed;
    $output['data']['covidDeaths'] = $Deaths;
    $output['data']['covidRecovered'] = $Recovered;
    $output['data']['covidDate'] = $dateCov;
    $output['data']['countryName'] = $rest[0]['name'];
    $output['data']['capitalName'] = $capitalCity;
    $output['data']['population'] = $rest[0]['population'];
    $output['data']['currencyName'] = $rest[0]['currencies'][0]['name'];
    $output['data']['currencyCode'] = $currencyCode;
    $output['data']['currencySymbol'] = $rest[0]['currencies'][0]['symbol'];
    $output['data']['flag'] = $rest[0]['flag'];
    $output['data']['language'] = $rest[0]['languages'][0]["name"];
    $output['data']['continent'] = $rest[0]['subregion'];
    $output['data']['naitiveName'] = $naitiveName;
    $output['data']['borders'] = $rest[0]['borders'];
    $output['data']['capitalJoint'] = $capitalCityJoint;
    $output['data']['CapitalLat'] = $forwardGeoCaptial['results'][0]['geometry']['lat'];
    $output['data']['CapitalLng'] = $forwardGeoCaptial['results'][0]['geometry']['lng'];
    $output['data']['exchangeUSD'] = $exchangeRate['conversion_rates']['USD'];
    $output['data']['exchangeEUR'] = $exchangeRate['conversion_rates']['EUR'];
    $output['data']['exchangeGBP'] = $exchangeRate['conversion_rates']['GBP'];

    













    

    
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
