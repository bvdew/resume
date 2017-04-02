$(function(){

    var storeNames = [],
        toCall = 0,
        doneCall = 0;

    $(".status").append("<p>Getting Stores</p>")
    toCall++;
    $.ajax({
        url: "getEtsyStores.php",
    })
    .done(function (result) {
        $(".status").append("<p>Stores Received</p>")
        storeNames = $.parseJSON(result);
        console.log(storeNames);
        var i = 0;
        $.each(storeNames, function(store, value){
            //if( i < 5){
                loadSales(store);
            //}
            i++;
        })
    })
    .fail(function (result) {
        console.log(result);
    })
    .always(function(){
        doneCall++;
    });

    function loadSales(store){
        $(".status").append("<p>Getting Sales for Store: " + store + "</p>");
        toCall++;
        $.ajax({
            url: "getEtsyStoreSales.php",
            method: "POST",
            data: {
                "store": store
            }
        })
        .done(function (result) {
            sales = $.parseJSON(result);
            console.log(sales);
            storeNames[store] = {
                "sales": sales.sales,
                "year": sales.year
            }
            $(".status").append("<p>Received Sales for Store: " + store + " (" + sales.year + ", " + sales.sales + ")</p>")
        })
        .always(function(){
            doneCall++;
        });
    }

    var doneInterval = setInterval(function(){
        console.log(toCall, doneCall);
        if (toCall == doneCall){
            clearInterval(doneInterval);
            console.log(storeNames);

            $(".status").append("<p>Sending Etsy Sales to Database</p>");
            $.ajax({
                url: "downloadEtsy.php",
                method: "POST",
                data: { 
                    'stores': JSON.stringify(storeNames),
                    'itemsSold': JSON.stringify([])
                }
            })
            .done(function (result) {
                $(".status").append("<p>Etsy Sales Saved to Database</p>");
            })
            .fail(function (result) {
                $(".status").append("<p>Sending Etsy Sales to Database FAILED!</p>");
            })
            .always(function(){
                $(".status").append("<p>DONE!</p>");
            });
        }
    }, 2000);

})