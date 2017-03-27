$(function () {
    $(document).on("change", "select#selectShop", function () {
        var storeId = $(this).find("option:selected").text();
        if (storeId != "") {
            bestSellers = {};
            getReport(storeId);
        }
    });

    $(document).on("change", "select#selectDate", function () {
        var date = $(this).find("option:selected").text();
        if (date != "") {
            createComparisons(date);
        }
    });

    $(document).on("click", "span.storeResults", function(){
        var selectStore = $(this).text();
        console.log(selectStore);
        $("select#selectShop").val(selectStore).trigger("change");
        $('body').scrollTop(0);
    })

    var dailySales = {},
        soldItems = {},
        bestSellers = {},
        stores = {},
        topSellers = {};

    $.ajax({
        url: "http://gsx2json.com/api?id=14A6a4qkvl3MfsBzevZ6MxZ9suLPPolI9FJ7TZBUjyEA&sheet=3",
        method: "GET"
    })
        .done(function (result) {
            soldItems = result.rows;
            console.log(soldItems);

            $(soldItems).each(function () {
                //get top selling items of all stores
                if (topSellers[this.itemid] == undefined) {
                    topSellers[this.itemid] = {
                        "sold": this.sold,
                        "store": this.storeid
                    };
                } else {
                    topSellers[this.itemid].sold = topSellers[this.itemid].sold + this.sold;
                }
            });
            printTS(topSellers);
        })
        .fail(function (result) {
            console.log(result);
        })
        .always(function () { });

    $.ajax({
        url: "http://gsx2json.com/api?id=14A6a4qkvl3MfsBzevZ6MxZ9suLPPolI9FJ7TZBUjyEA&sheet=2",
        method: "GET"
    })
        .done(function (result) {
            dailySales = result.rows;
            console.log(dailySales);

            var dates = [];
            $(dailySales).each(function () {
                if (stores[this.store] == undefined) {
                    stores[this.store] = [];
                }
                stores[this.store].push({
                    "date": this.date,
                    "store": this.store,
                    "totalSales": this.totalsales
                });
                if ($.inArray(moment(this.date).format("MMMM DD, YYYY"), dates) < 0) {
                    dates.push(moment(this.date).format("MMMM DD, YYYY"));
                }
            });
            var row = [];

            for (var key in stores) {
                if (stores.hasOwnProperty(key)) {
                    row.push("<option>" + key + "</option>");
                }
            }
            $("select#selectShop").empty().append(row.join("")).val(0);

            var my_options = $("select#selectShop option");

            my_options.sort(function (a, b) {
                if (a.text > b.text) return 1;
                if (a.text < b.text) return -1;
                return 0
            })

            $("select#selectShop").empty().append("<option value='0'>Select a Store</option>").append(my_options).val("0");

            row = [];
            $.each(dates, function () {
                row.push("<option>" + this + "</option>");
            })
            $("select#selectDate").empty().append(row.join(""));
        })
        .fail(function (result) {
            console.log(result);
        })
        .always(function () { });


    var getReport = function (storeId) {
        var reportData = [],
            ONE_HOUR = 60 * 60 * 1000;

        $(dailySales).each(function () {
            if (this.store == storeId) {

                //look for all the sold items
                var itemsSold = [],
                    reportDate = new Date(this.date),
                    sinceYear;

                if (this.year != null) {
                    sinceYear = this.year;
                }
                $(soldItems).each(function () {
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
                    "totalSales": parseInt(this.totalsales.toString().replace(',', '')),
                    "sold": parseInt(this.sold),
                    "itemSold": itemsSold,
                    "sinceYear": sinceYear
                });
            }
        });
        console.log(stores);
        printReport(reportData, bestSellers);
        //createChart(stores);
        //createComparisons(stores);
    }

    var printReport = function (data, bS) {
        var row = [],
            soldCount,
            rowId = 0,
            previousSold = data[0].totalSales;

            console.log(data);

        $(data).each(function () {
            var dailySold = this.totalSales - previousSold;
            this.sold = dailySold;
            row.push('<tr data-toggle="collapse" data-target="#accordion' + rowId + '" class="clickable"><td>' + this.date + "</td><td>" + this.totalSales.toString().replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + "</td><td>" + dailySold + "</td><td>$" + (dailySold * 13.5) + "</td></tr>");
            row.push('<tr id="accordion' + rowId + '" class="collapse"><td colspan="3"><table class="table table-hover table-inverse"><thead><tr><th>Item</th><th>No. Sold</th><th>URL</th></tr></thead><tbody>');

            soldCount = 0;
            $(this.itemSold).each(function () {
                row.push('<tr><td>' + this.itemid + '</td><td>' + this.sold + '</td><td><a href="https://www.etsy.com/listing/' + this.itemid + '" target="_blank">Link</a></tr>');
                soldCount += this.sold;
            });
            row.push('<tr class="total"><td>Total Sold</td><td>' + soldCount + '</td><td></td></tr>');

            row.push('</tbody></table></td></tr>')

            previousSold = this.totalSales;
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

        $.each(arr, function () {
            row.push('<div class="row"><span class="col-xs-3">' + this.id + '</span><span class="col-xs-1">' + this.sold + '</span><span class="col-xs-3"><a href="https://www.etsy.com/listing/' + this.id + '" target="_blank">Link</a></span></div>');
        });

        $("#bestSellers").empty().append(row.join(""));

        var f = data[0],
            e = data[data.length - 1];

        var salesDiff = e.totalSales - f.totalSales,
            profit = 13.5 * salesDiff,
            now = moment(e.date),
            end = moment(f.date),
            duration = moment.duration(now.diff(end)),
            days = duration.asDays();

        $("p.sinceYear").text("Online Since: " + e.sinceYear);
        $("p.soldDaily").text("Sold Daily: " + Math.floor((salesDiff / days)));
        $("p.dailySales").text("Daily Sales: $" + parseFloat((profit / days), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        $("p.weeklySales").text("Weekly Sales: $" + parseFloat(((profit / days) * 7), 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        var mo = ((profit / days) * 365) / 12;
        $("p.monthlySales").text("Monthly Sales: $" + parseFloat(mo, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        var yr = (profit / days) * 365;
        $("p.yearlySales").text("Yearly Sales: $" + parseFloat(yr, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        var all = e.totalSales * 13.5;
        $("p.allTimeSales").text("All Time Sales: $" + parseFloat(all, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    };

    var printTS = function (data) {
        var row = [],
            arr = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                arr.push({
                    "id": key,
                    "sold": data[key].sold,
                    "store": data[key].store
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

        $.each(arr, function () {
            row.push('<div class="row"><span class="col-xs-3">' + this.id + '</span><span class="col-xs-1">' + this.sold + '</span><span class="col-xs-3">' + this.store + '</span><span class="col-xs-1"><a href="https://www.etsy.com/listing/' + this.id + '" target="_blank">Link</a></span></div>');
        });

        $("#topSellers").empty().append(row.join(""));
    };

    var createChart = function (stores) {
        /*
        var data = [],
            labels = [];
            console.log(stores);
        $.each(stores, function (id, value) {
            console.log(this.data, this.sold);
            labels.push(moment(this.date, "MM DD"));
            data.push(parseInt(this.sold));
        });

        var tempData = {
            labels: labels,
            datasets: [{
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: data
            }]
        };
        console.log(tempData);
        */
        console.log(stores);

        var data = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{
                label: 'apples',
                data: [12, 19, 3, 17, 6, 3, 7],
                backgroundColor: "rgba(153,255,51,0.4)"
            }, {
                label: 'oranges',
                data: [2, 29, 5, 5, 2, 3, 10],
                backgroundColor: "rgba(255,153,0,0.4)"
            }]
        }

        console.log(data);

        var labels = [],
            datasets = [];
        $.each(stores, function () {
            $.each(this, function () {
                console.log(moment(this.date).format("MMM DD"), labels, $.inArray(moment(this.date).format("MMM DD"), labels))
                if ($.inArray(moment(this.date).format("MMM DD"), labels) < 0) {
                    labels.push(moment(this.date).format("MMM DD"));
                }

                console.log(this.store, this.sold);
                if (datasets[this.store] == undefined) {
                    datasets[this.store] = {
                        label: this.store,
                        data: []
                    };
                }
                datasets[this.store].data.push(this.sold);
            });
        });

        var data = {
            labels: labels,
            datasets: datasets
        };

        console.log(data);

        var ctx = $("#myChart");
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    };

    var createComparisons = function (date) {
        console.log(stores);
        var d = [];
        $.each(stores, function () {
            $.each(this, function () {
                if (moment(this.date).format("MM DD YYYY") == moment(date).format("MM DD YYYY")) {
                    d.push({
                        "store": this.store,
                        "sold": this.sold
                    })
                }
            });
        });

        d.sort(SortBySold);
        d.reverse();

        function SortBySold(a, b) {
            var aName = a.sold;
            var bName = b.sold;
            return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
        }

        var row = [];
        $.each(d, function () {
            row.push('<div class="row"><span class="col-xs-3 storeResults">' + this.store + '</span><span class="col-xs-1">' + this.sold + '</span></div>');
        });

        $("#compare").empty().append(row.join(""));
    };
});
