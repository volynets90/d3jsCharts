<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://www.zohoapis.com/crm/v2/Plans_KPI?cvid=3678676000000373003",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_POSTFIELDS => "",
  CURLOPT_HTTPHEADER => array(
    "Authorization: bc89ac189d07391f30ebe48e1e399775",
    "Postman-Token: b06bd918-9c36-4016-a435-3ea4656f8e83",
    "cache-control: no-cache"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
  $fd = fopen("./scripts/data.json", 'w') or die("не удалось создать файл");
  fwrite($fd, $response);
  fclose($fd);
}
?>