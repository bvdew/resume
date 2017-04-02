<?php
    require 'dblogin.php';

    $filename = $_POST['filename'];
    $fields = json_decode($_POST['fields']);

    //get the fields
    $query1 = "SELECT fileid FROM filelocation WHERE filename = '" . $filename . "' LIMIT 1";
    $result = $conn->query($query1);
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    print_r($rows);

    echo sizeof($rows);

    //insert new file
    $fileid = md5($filename);
    if(sizeof($rows) == 0){
        $query2 = "INSERT INTO filelocation (fileid, filename, datecreated) VALUES ('" . $fileid . "', '" . $filename . "', NOW())";
        //echo $query2;
        $conn->query($query2);
    } else {
        $fileid = $rows[0]['fileid'];
    }

    //delete previous template field
    $query2 = "DELETE FROM template_fields WHERE fileid = '" . $fileid . "'";
    //echo $query2;
    $conn->query($query2);

    //insert fields
    echo "<br/>fileid: " . $fileid;
    print_r($fields);

    $query3 = 'INSERT INTO template_fields (fileid, ';
    $query4 = "";
    
    foreach($fields as $v){
        $query3 .= $v->fieldName . ', ';
        $query4 .= "'" . $v->checked . "', ";
    }

    echo $query4;
    
    $query3 .= "dateUpdated) VALUES ( '" .$fileid . "', " . $query4 . "NOW());";

    echo "<br/><br/>".$query3;

    $conn->query($query3);

    //close mysql
    $conn->close();

?>