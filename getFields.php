<?php
    require 'dblogin.php';
    $key = $_POST['key'];
    //create queries
    $query = "SELECT fileid FROM downloadkey WHERE uniqueid = '".$key."'";

    //get the fileid and update the downloads
    $result = $conn->query($query);
    $row = mysqli_fetch_assoc($result);
    $fileid = $row['fileid'];

    //get the fields
    $query2 = "SELECT * FROM template_fields WHERE fileid='".$fileid."'";
    $result = $conn->query($query2);
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print json_encode($rows);

    //close mysql
    $conn->close();
?>