<?php
// example of how to use basic selector to retrieve HTML contents
include('simple_html_dom.php');

$store = $_POST["store"];

//get store sales
//base url
$url = 'https://www.etsy.com/shop/'.$store;
$html_base = getHTML($url);

//get all stores
$year = 0;
$sales = 0;
foreach($html_base->find('.etsy-since') as $y) {
    $y = $y->plaintext;
    $y = trim($y);
    $year = intval(preg_replace('/[^0-9]+/', '', $y), 10);
}

foreach($html_base->find('a') as $s) {
    $s = $s->plaintext;
    $s = trim($s);

    if (strpos($s, ' Sales') !== false) {
        $sales = intval(preg_replace('/[^0-9]+/', '', $s), 10);
    }
}

echo json_encode(array("year" => $year, "sales" => $sales));

$html_base->clear(); 
unset($html_base);

function getHTML($base){
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($curl, CURLOPT_HEADER, false);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_URL, $base);
    curl_setopt($curl, CURLOPT_REFERER, $base);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
    $str = curl_exec($curl);
    curl_close($curl);

    // Create a DOM object
    $html_base = new simple_html_dom();
    // Load HTML from a string
    $html_base->load($str);

    return $html_base;
}
?>