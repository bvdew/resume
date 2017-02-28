$(function() {
    $(document).on("change", "select#selectShop", function() {
        var storeId = $(this).find("option:selected").text();
        if (storeId != "") {
            getReport(storeId);
        }
    });

    var dailySales = {},
        soldItems = {},
        bestSellers = {},
        stores = {};

    $.ajax({
            url: "http://gsx2json.com/api?id=14A6a4qkvl3MfsBzevZ6MxZ9suLPPolI9FJ7TZBUjyEA&sheet=3",
            method: "GET"
        })
        .done(function(result) {
            soldItems = result.rows;
            console.log(soldItems);

            
        })
        .fail(function(result) {
            console.log(result);
        })
        .always(function() {});

    $.ajax({
            url: "http://gsx2json.com/api?id=14A6a4qkvl3MfsBzevZ6MxZ9suLPPolI9FJ7TZBUjyEA&sheet=2",
            method: "GET"
        })
        .done(function(result) {
            dailySales = result.rows;
            console.log(dailySales);

            $(dailySales).each(function() {
                if (stores[this.store] == undefined) {
                    stores[this.store] = true;
                }
            });
            var row = [];
            row.push("<option>Select a Store</option>");
            for (var key in stores) {
                if (stores.hasOwnProperty(key)) {
                    row.push("<option>" + key + "</option>");
                }
            }
            $("select#selectShop").empty().append(row.join(""));
        })
        .fail(function(result) {
            console.log(result);
        })
        .always(function() {});


    var getReport = function(storeId) {
        var reportData = [],
            ONE_HOUR = 60 * 60 * 1000;;

        $(dailySales).each(function() {
            if (this.store == storeId) {

                //look for all the sold items
                var itemsSold = [],
                    reportDate = new Date(this.date);
                $(soldItems).each(function() {
                    var soldDate = new Date(this.date);

                    if (this.storeid == storeId && (soldDate - reportDate) > 0 && (soldDate - reportDate) < ONE_HOUR) {
                        itemsSold.push({
                            "itemid": this.itemid,
                            "sold": this.sold
                        })

                        if (bestSellers[this.itemid] == undefined) {
                            bestSellers[this.itemid] = this.sold;
                        } else {
                            bestSellers[this.itemid] = bestSellers[this.itemid] + this.sold;
                        }
                    }
                });

                reportData.push({
                    "date": this.date,
                    "totalSales": this.totalsales,
                    "sold": this.sold,
                    "itemSold": itemsSold
                });
            }
        });
        printReport(reportData, bestSellers);
    }

    var printReport = function(data, bS) {
        var row = [],
            soldCount,
            rowId = 0;

        $(data).each(function() {
            row.push('<tr data-toggle="collapse" data-target="#accordion' + rowId + '" class="clickable"><td>' + this.date + "</td><td>" + this.totalSales + "</td><td>" + this.sold + "</td><td></tr>");
            row.push('<tr id="accordion' + rowId + '" class="collapse"><td colspan="3"><table class="table table-hover table-inverse"><thead><tr><th>Item</th><th>No. Sold</th><th>URL</th></tr></thead><tbody>');

            soldCount = 0;
            $(this.itemSold).each(function() {
                row.push('<tr><td>' + this.itemid + '</td><td>' + this.sold + '</td><td><a href="https://www.etsy.com/listing/' + this.itemid + '" target="_blank">Link</a></tr>');
                soldCount += this.sold;
            });
            row.push('<tr class="total"><td>Total Sold</td><td>' + soldCount + '</td><td></td></tr>');

            row.push('</tbody></table></td></tr>')

            rowId++;
        });
        $("tbody").empty().append(row.join(""));


        row = [];

        var arr = [];
        for (var key in bS) {
            if (bS.hasOwnProperty(key)) {
                arr.push({
                    "id": key,
                    "sold": bS[key]
                });
            }
        }

        arr.sort(SortBySold);
        arr.reverse();

        function SortBySold(a, b) {
            var aName = a.sold;
            var bName = b.sold;
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        }

        console.log(arr);

        $.each(arr, function() {
            row.push('<div class="row"><span class="col-xs-1">' + this.id + '</span><span class="col-xs-1">' + this.sold + '</span><span class="col-xs-1"><a href="https://www.etsy.com/listing/' + this.id + '" target="_blank">Link</a></span></div>');
        });

        $("#bestSellers").empty().append(row.join(""));
    };
});
