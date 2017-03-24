<?php
    require 'dblogin.php';

    $stores = json_decode($_POST['stores']);
    $dailySold = json_decode($_POST['dailySold']);
    $items = json_decode($_POST['itemsSold']);

    //INSERT STORES
    $storeQuery = "";

    if(sizeof($stores) > 0){
        foreach($stores as $value){
            if( isset($value->storename) && isset($value->year) ){
                $storeQuery .= 'INSERT INTO etsy_stores (storeName, dateAdded, onlineSince) SELECT "'
                    . $value->storename . '", NOW(), "' . $value->year . '" FROM etsy_stores '
                    . 'WHERE NOT EXISTS( SELECT storeName FROM etsy_stores WHERE storeName = "' . $value->storename . '" ) LIMIT 1;';
            }
        }
        //echo $storeQuery;
        if ($conn->multi_query($storeQuery) === TRUE) {
            echo "New records created successfully";
            while($conn->more_results()) {
                $conn->next_result();
                if($res = $conn->store_result()) {
                    $res->free(); 
                }
            }
        } else {
            echo "Error: <br>" . $conn->error;
        }
    }

    //INSERT DAILY SALES
    $totalSalesQuery = "";
    if(sizeof($dailySold) > 0){
        $limit = 0;
        foreach($dailySold as $value){
            if( isset($value->storename) && isset($value->date) && isset($value->totalSales) ){
                
                $totalSalesQuery .= 'INSERT IGNORE INTO etsy_dailysales (storeid, date, totalSales) '
                    . 'SELECT storeid, STR_TO_DATE("' . $value->date . '", "%m/%d/%Y %H:%i:%s"), "' 
                    . str_replace(',', '', $value->totalSales) . '" FROM etsy_stores WHERE storeName = "' 
                    . $value->storename . '" LIMIT 1;';

            }
            $limit++;
            if($limit > 19){
                //echo "<br/><br/>";
                //echo $totalSalesQuery;
                if ($conn->multi_query($totalSalesQuery)) {
                    while($conn->more_results()) {
                        $conn->next_result();
                        if($res = $conn->store_result()) {
                            $res->free(); 
                        }
                    }
                } else {
                    echo "<br/>Query did not run<br/><br/>";
                    echo $conn->error;
                }
                $totalSalesQuery = "";
                $limit = 0;
            }
        }
    }

    //INSERT ITEM SALES
    $itemSalesQuery = "";
    if(sizeof($items) > 0){
        $limit = 0;
        foreach($items as $value){
            if( isset($value->storename) && isset($value->itemid) && isset($value->sold) && isset($value->date) ){
                
                $itemSalesQuery .= 'INSERT IGNORE INTO etsy_items (storeid, itemid, sold, dateSold) '
                    . 'SELECT storeid, "' . $value->itemid . '", "' . $value->sold . '", STR_TO_DATE("' . $value->date . '", "%m/%d/%Y %H:%i:%s")' 
                    . ' FROM etsy_stores WHERE storeName = "' 
                    . $value->storename . '" LIMIT 1;';

            }
            $limit++;
            if($limit > 19){
                echo "<br/><br/>";
                echo $itemSalesQuery;
                if ($conn->multi_query($itemSalesQuery)) {
                    while($conn->more_results()) {
                        $conn->next_result();
                        if($res = $conn->store_result()) {
                            $res->free(); 
                        }
                    }
                } else {
                    echo "<br/>Query did not run<br/><br/>";
                    echo $conn->error;
                }
                $itemSalesQuery = "";
                $limit = 0;
            }
        }
        
    }

    //close mysql
    $conn->close();
?>