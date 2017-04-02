<?php
    require 'dblogin.php';

    $stores = $_POST['stores'];
    $items = $_POST['itemsSold'];
    $stores = json_decode($stores);

    //INSERT STORES
    $storeQuery = "";

    if(sizeof($stores) > 0){
        foreach($stores as $storename => $value){
            if( isset($value->year) ){
                $storeQuery .= 'INSERT INTO etsy_stores (storeName, dateAdded, onlineSince) SELECT "'
                    . $storename . '", NOW(), "' . $value->year . '" FROM etsy_stores '
                    . 'WHERE NOT EXISTS( SELECT storeName FROM etsy_stores WHERE storeName = "' . $storename . '" ) LIMIT 1;';
            }
        }
        if ($conn->multi_query($storeQuery) === TRUE) {
            echo "<br/>New records created successfully";
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
    if(sizeof($stores) > 0){
        $limit = 0;
        foreach($stores as $storename => $value){
            echo "<br/>".$storename;
            print_r($value);
            if( isset($value->sales) ){
                $query = 'SELECT storeid FROM etsy_stores WHERE storeName = "' . $storename . '";';
                //echo "<br/><br/>" . $query;
                $result = $conn->query($query);
                $row = $result->fetch_array(MYSQLI_ASSOC);
                $storeid = $row['storeid'];
                $result->free(); 
                
                $totalSalesQuery = 'INSERT INTO etsy_dailysales (storeid, date, totalSales) SELECT "'
                    . $storeid . '", NOW(), "' . $value->sales . '" FROM etsy_dailysales '
                    . 'WHERE NOT EXISTS( SELECT * FROM etsy_dailysales WHERE storeid = "' . $storeid . '" AND '
                    . 'date = NOW() ) LIMIT 1;';
                //echo "<br/><br/>" . $totalSalesQuery;
                if($conn->query($totalSalesQuery) === TRUE){
                    echo "<br/>New records created successfully";
                    while($conn->more_results()) {
                        $conn->next_result();
                        if($res = $conn->store_result()) {
                            $res->free(); 
                        }
                    }
                }  else {
                    echo "Error: <br>" . $conn->error;
                }

            }
        }
    }

    //INSERT ITEM SALES
    /*$itemSalesQuery = "";
    if(sizeof($items) > 0){
        $limit = 0;
        foreach($items as $value){
            if( isset($value->storename) && isset($value->itemid) && isset($value->sold) && isset($value->date) ){
                $query = 'SELECT storeid FROM etsy_stores WHERE storeName = "' . $value->storename . '";';
                //echo "<br/><br/>" . $query;
                $result = $conn->query($query);
                $row = $result->fetch_array(MYSQLI_ASSOC);
                $storeid = $row['storeid'];
                $result->free(); 
                
                $itemSalesQuery = 'INSERT INTO etsy_items (storeid, itemid, sold, dateSold) SELECT "'
                    . $storeid . '", "' . $value->itemid . '", "' . $value->sold . '", STR_TO_DATE("' . $value->date . '", "%m/%d/%Y %H:%i:%s") FROM etsy_items '
                    . 'WHERE NOT EXISTS( SELECT * FROM etsy_items WHERE storeid = "' . $storeid . '" AND '
                    . 'dateSold = STR_TO_DATE("'. $value->date .'", "%m/%d/%Y %H:%i:%s") AND itemid = "' . $value->itemid . '" ) LIMIT 1;';
                //echo "<br/><br/>" . $itemSalesQuery;
                $result = $conn->query($itemSalesQuery);
            }
        }
        
    }*/

    //close mysql
    $conn->close();
?>