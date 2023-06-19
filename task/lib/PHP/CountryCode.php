<?php

  #control error reporting and display settings during the execution
  ini_set('display_errors', 'On');
  error_reporting(E_ALL);

  $executionStartTime = microtime(true);

  $APIkey = 'mohammadmohammad';
  $latitude = $_REQUEST['countryCodeLat'];
  $longitude = $_REQUEST['countryCodeLng'];
  $url = 'http://api.geonames.org/countryCodeJSON?formatted=true&lat=' . $latitude . '&lng=' . $longitude . '&username=' . $APIkey . '&style=full';

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL,$url);

  $result=curl_exec($ch);

  curl_close($ch);

  $decode = json_decode($result,true);	

  $output['status']['code'] = "200";
  $output['status']['name'] = "ok";
  $output['status']['description'] = "success";
  $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode; // removed ['geonames'] since it caused "undefined" problem
  
  header('Content-Type: application/json; charset=UTF-8');

  echo json_encode($output);

?>
