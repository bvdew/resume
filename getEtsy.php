<?php
// example of how to use basic selector to retrieve HTML contents
include('simple_html_dom.php');
 
//base url
$url = 'https://www.etsy.com/search?q=resume+template';
$html_base = getHTML($url);

//get all stores
$storeNames = [];
foreach($html_base->find('.card-shop-name') as $store) {
    $store = trim($store);
    echo $store."<br/>";
    if( !isset($storeName[$store]) ){
        $storeNames[$store] = 1;
    } else {
        $storeNames[$store] = $storeNames[$store] + 1;
    }
    
}

print_r($storeNames);

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