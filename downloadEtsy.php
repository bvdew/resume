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
                $query = 'SELECT storeid FROM etsy_stores WHERE storeName = "' . $value->storename . '";';
                //echo "<br/><br/>" . $query;
                $result = $conn->query($query);
                $row = $result->fetch_array(MYSQLI_ASSOC);
                $storeid = $row['storeid'];
                $result->free(); 
                
                $totalSalesQuery = 'INSERT INTO etsy_dailysales (storeid, date, totalSales) SELECT "'
                    . $storeid . '", STR_TO_DATE("' . $value->date . '", "%m/%d/%Y %H:%i:%s"), "' . $value->totalSales . '" FROM etsy_dailysales '
                    . 'WHERE NOT EXISTS( SELECT * FROM etsy_dailysales WHERE storeid = "' . $storeid . '" AND '
                    . 'date = STR_TO_DATE("'. $value->date .'", "%m/%d/%Y %H:%i:%s") ) LIMIT 1;';
                //echo "<br/><br/>" . $totalSalesQuery;
                $result = $conn->query($totalSalesQuery);

            }
        }
    }

    //INSERT ITEM SALES
    $itemSalesQuery = "";
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
        
    }

    //close mysql
    $conn->close();
?>