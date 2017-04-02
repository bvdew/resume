<?php
// example of how to use basic selector to retrieve HTML contents
include('simple_html_dom.php');
 
//base url
$url = 'https://www.etsy.com/search?q=resume+template';
$html_base = getHTML($url);

//get all stores
$storeNames = [];
foreach($html_base->find('.card-shop-name') as $store) {
    $store = $store->plaintext;
    $store = trim($store);
    isset($storeNames[$store])?$storeNames[$store]++:$storeNames[$store]=1;
}
$html_base->clear(); 
unset($html_base);

//get pages 2 - 5
for( $p = 2; $p <= 5; $p++){
    $url = 'https://www.etsy.com/search?q=resume+template&explicit=1&page='.$p;
    $html_base = getHTML($url);

    //get all stores
    foreach($html_base->find('.card-shop-name') as $store) {
        $store = $store->plaintext;
        $store = trim($store);
        isset($storeNames[$store])?$storeNames[$store]++:$storeNames[$store]=1;
    }
    $html_base->clear(); 
    unset($html_base);
}

echo json_encode($storeNames);


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