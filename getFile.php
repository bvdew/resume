<?php
    require 'dblogin.php';
    $key = $_POST['key'];

    //create queries
    $query = "SELECT fileid FROM downloadkey WHERE uniqueid = '".$key."'";
    $query2 = "UPDATE downloadkey SET downloads = downloads + 1, lastdownload = NOW() WHERE uniqueid = '".$key."'";

    //get the fileid and update the downloads
    $result = $conn->query($query);
    $conn->query($query2);
    $row = mysqli_fetch_assoc($result);
    $fileid = $row['fileid'];

    //get the file location
    $query3 = "SELECT filename FROM filelocation WHERE fileid='".$fileid."'";
    $result = $conn->query($query3);
    $row = mysqli_fetch_assoc($result);
    $filename = $row['filename'];

    //close mysql
    $conn->close();

    //return the filename
    echo $filename;
?>