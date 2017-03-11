<?php
    require 'dblogin.php';
    $key = $_POST['key'];
    
    //create queries
    $query = "SELECT downloads FROM downloadkey WHERE uniqueid = '".$key."'";

    //get the number of downloads
    $result = $conn->query($query);
    $row = mysqli_fetch_assoc($result);
    $downloads = $row['downloads'];

    //close mysql
    $conn->close();

    //return the filename
    echo $downloads;
?>