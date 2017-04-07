<?php
    require 'dblogin.php';

    $fileid = $_POST['fileid'];
    $transactionId = $_POST['transactionId'];

    //create download key
    $uniqueid = '';
    for( $i=0; $i<5; $i++ ) {
        $uniqueid .= chr( rand( 65, 90 ) );
    }
    $uniqueid = strtolower($uniqueid);

    //get the fields
    $query1 = "INSERT INTO downloadKey (uniqueid, datecreated, downloads, lastdownload, fileid, transactionid) VALUES ";
    $query1 .= "('".$uniqueid."', NOW(), 0, NULL, '".$fileid."', '".$transactionId."');";
    $conn->query($query1);

    //close mysql
    $conn->close();

    echo $uniqueid;
?>