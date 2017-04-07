<?php
    require 'dblogin.php';

    //get the templates
    $query = "SELECT * FROM filelocation;";
    $result = $conn->query($query);
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }

    //close mysql
    $conn->close();

?>

<!DOCTYPE HTML>
<html>

<head>
    <meta charset=utf-8>
    <title>Create Key</title>
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <style>
    html,
    body {
        height: 100%;
    }
    .container {
        padding-top: 50px;
        padding-bottom: 50px;
    }

    p#link {
        padding: 40px 0;
        font-size: 30px;
    }
    </style>

    <body>
        <div class="container">
            <div class="row">
                <h1>Create a Key</h1>
            </div>
            <div class="row">
                <label class="col-xs-3">Select Template</label>
                <select id="fileid">
                    <option val="0" selected>Select a Template</option>
                <?php
                    foreach($rows as $v){
                        echo '<option value="'.$v['fileid'].'">'.$v['filename'].'</option>';
                    }
                ?>
                </select>
            </div>
            <div class="row">
                <label class="col-xs-3">Transaction Id</label>
                <input type="text" id="transactionId" />
            </div>
            <div class="row">&nbsp;</div>
            <div class="row">
                <button type="button" class="btn btn-primary">Submit</button>
            </div>
            <div class="row">
                <p id="link"></p>
            </div>

            <p class="status"></p>
        </div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
        <script>
            $(document).on("click", "button", function(){
                var fileid = $("#fileid option:selected").val(),
                    transactionId = $("#transactionId").val();
                if(fileid != 0 && transactionId != ''){

                    $(".status").append("<p>Getting Key from Database</p>");
                    $.ajax({
                        url: "setKey.php",
                        method: "POST",
                        data: { 
                            'fileid': fileid,
                            "transactionId": transactionId
                        }
                    })
                    .done(function (key) {
                        key = $.trim(key);
                        $(".status").append("<p>Key Created in Database</p>");
                        $("p#link").empty().append("http://www.creativeconfidentdesigns.com/?key=" + key);
                    })
                    .fail(function (result) {
                        $(".status").append("<p>Creating Key in Database FAILED!</p>");
                    })
                    .always(function(){
                        $(".status").append("<p>DONE!</p>");
                    });
                }
            })
        </script>
    </body>

</html>
