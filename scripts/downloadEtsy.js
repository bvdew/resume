$(function(){
    $(".status").append("<p>Downloading Etsy Store Sales</p>");
    var stores = [],
        dailySold = [],
        items = [];
    $.ajax({
        url: "http://gsx2json.com/api?id=14A6a4qkvl3MfsBzevZ6MxZ9suLPPolI9FJ7TZBUjyEA&sheet=2",
        method: "GET"
    })
    .done(function (result) {
        $(".status").append("<p>Received Etsy Store Sales");
        dailySales = result.rows;
        console.log(dailySales);

        $(dailySales).each(function () {
            if (this.year != null){
                stores.push({
                    "storename": this.store,
                    "year": this.year
                })
            }
            dailySold.push({
                "storename": this.store,
                "date": this.date,
                "totalSales": this.totalsales
            })
        });
    })
    .fail(function (result) {
        console.log(result);
        $(".status").append("<p>Downloading Etsy Store Sales FAILED!</p>");
    })
    .always(function () { });


    $(".status").append("<p>Downloading Etsy Store Item Sales</p>");
    $.ajax({
        url: "http://gsx2json.com/api?id=14A6a4qkvl3MfsBzevZ6MxZ9suLPPolI9FJ7TZBUjyEA&sheet=3",
        method: "GET"
    })
    .done(function (result) {
        $(".status").append("<p>Received Etsy Store Item Sales</p>");
        soldItems = result.rows;
        console.log(soldItems);

        $(soldItems).each(function () {
            items.push({
                "storename": this.storeid,
                "itemid": this.itemid,
                "sold": this.sold,
                "date": this.date
            });
        });
    })
    .fail(function (result) {
        $(".status").append("<p>Downloading Etsy Store Sales FAILED!</p>");
        console.log(result);
    })
    .always(function () { });

    var storeInterval = setInterval(function(){
        if(stores.length && dailySold.length && items.length){
            clearInterval(storeInterval);
            console.log(stores);
            $(".status").append("<p>Sending Etsy Sales to Database</p>");
            $.ajax({
                url: "downloadEtsy.php",
                method: "POST",
                data: { 
                    'stores': JSON.stringify(stores),
                    'dailySold': JSON.stringify(dailySold),
                    'itemsSold': JSON.stringify(items)
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
                $(".status").append("<p>Make sure to delete the rows in the Google Sheet to avoid duplicate rows.");
            });
        }
    }, 100)
});