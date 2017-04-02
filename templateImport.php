<?php
    require 'dblogin.php';

    //get the fields
    $query2 = "SHOW columns FROM template_fields";
    $result = $conn->query($query2);
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r['Field'];
    }

    //close mysql
    $conn->close();

?>

<!DOCTYPE HTML>
<html>

<head>
    <meta charset=utf-8>
    <title>Import a Template</title>
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
    table.table.table-inverse td {
        background-color: #B2EBF2;
    }
    
    table.table.table-inverse tr.total td {
        background-color: #81D4FA;
        font-weight: 600;
    }
    </style>

    <body>
        <div class="container">
            <div class="row">
                <h1>Import/Modify a Template</h1>
            </div>
            <div class="row">
                <label class="col-xs-3">Template Filename</label>
                <input class="col-xs-4" type="text" id="location" placeholder="demo.docx">
            </div>
            <div class="row">
                <h2>Template Fields</h2>
            </div>
            <div class="row">
            <?php
                foreach($rows as $f => $v){
                    if($v != "fileid" && $v != "dateUpdated"){
                    echo '<input class="col-xs-1" type="checkbox" id="'.$v.'">
                            <label class="col-xs-3">'.$v.'</label>';
                    }
                }
            ?>
            </div>
            <div class="row">&nbsp;</div>
            <div class="row">
                <button type="button" class="btn btn-primary">Submit</button>
            </div>
            <p class="status"></p>
        </div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
        <script>
            $(document).on("click", "button", function(){
                var filename = $("#location").val(),
                    fields = [];
                if(filename != ""){

                    $("input[type='checkbox']").each(function(){
                        var fieldName = $(this).attr("id"),
                            checked = $(this).prop("checked") ? 1 : 0;

                        fields.push({
                            "fieldName": fieldName,
                            "checked": checked
                        })
                    })

                    console.log(fields);
                    $(".status").append("<p>Saving Fields to Database</p>");
                    $.ajax({
                        url: "updateTemplateFields.php",
                        method: "POST",
                        data: { 
                            'filename': filename,
                            "fields": JSON.stringify(fields)
                        }
                    })
                    .done(function (result) {
                        $(".status").append("<p>Fields Saved to Database</p>");
                    })
                    .fail(function (result) {
                        $(".status").append("<p>Fields Saved to Database FAILED!</p>");
                    })
                    .always(function(){
                        $(".status").append("<p>DONE!</p>");
                    });
                }
            })
        </script>
    </body>

</html>
