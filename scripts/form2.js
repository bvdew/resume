$(function () {

    $("div.tab-menu>div.list-group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.tab>div.tab-content").removeClass("active");
        $("div.tab>div.tab-content").eq(index).addClass("active");
    });

    $(".btn-next").click(function (e) {
        $("div.tab-menu>div.list-group>a").eq($(this).attr("data-target")).trigger("click");
    });

    //get education years
    var currentYear = (new Date).getFullYear() + 2,
        row = [];
    for (var y = currentYear; y >= currentYear - 100; y--) {
        row.push('<option value="' + y + '">' + y + '</option>');
    }
    $("select.years").append(row.join(''));
    //new education group
    $(document).on("click", "button.add-education", function () {
        var educationGroup = $(".education-group")[0];
        var newGroup = $(educationGroup).clone().appendTo(".education-placeholder");
        //clear out the previous values
        $(newGroup).find("input").val("");
        $(newGroup).find("select").val("0");
    });
    //new experience group
    $(document).on("click", "button.add-experience", function () {
        var experienceGroup = $(".experience-group")[0];
        var newGroup = $(experienceGroup).clone().appendTo(".experience-placeholder");
        //clear out the previous values
        $(newGroup).find("input").val("");
        $(newGroup).find("textarea").val("");
        $(newGroup).find("select").val("0");
        //initialize the html editor
        tinymce.init({
            selector: '.experience-group textarea',
            height: 200,
            menubar: false,
            plugins: [
                'lists paste'
            ],
            toolbar: 'undo redo | bold italic underline | bullist numlist outdent indent'
        });
    });
    tinymce.init({
        selector: '.experience-group textarea',
        height: 200,
        menubar: false,
        plugins: [
            'lists paste'
        ],
        toolbar: 'undo redo | bold italic underline | bullist numlist outdent indent'
    });
    //present job doesn't need year
    $("select.endMonth").on("change", function () {
        if ($(this).val() == "present") {
            $(this).closest(".experience-group").find("select.endYear").val("0").prop("disabled", true);
        } else {
            $(this).closest(".experience-group").find("select.endYear").prop("disabled", false);
        }
    })
    //new reference group
    $(document).on("click", "button.add-reference", function () {
        var experienceGroup = $(".reference-group")[0];
        var newGroup = $(experienceGroup).clone().appendTo(".reference-placeholder");
        //clear out the previous values
        $(newGroup).find("input").val("");
        $(newGroup).find("textarea").val("");
        $(newGroup).find("select").val("0");
    });

    //export resume to .docx
    $(document).on("click", "#exportDocx", function () {
        console.log("click")
        var data = {};

        //get contact info
        $("#contact input").each(function () {
            var key = $(this).attr("id"),
                value = $(this).val();
            data[key] = value;
        });
        //get personal info
        data["personalStatement"] = $("#personal textarea").val();
        //get education
        var eds = [];
        $("#education .education-group").each(function () {
            eds.push({
                "institute": $(this).find("input.institute").val(),
                "city": $(this).find("input.city").val(),
                "state": $(this).find("input.state").val(),
                "startMonth": $(this).find("select.startMonth").val(),
                "startYear": $(this).find("select.startYear").val(),
                "endMonth": $(this).find("select.endMonth").val(),
                "endYear": $(this).find("select.endYear").val(),
                "course": $(this).find("input.course").val()
            });
        });
        data["education"] = eds;
        //get experience
        var exp = [];
        $("#experience .experience-group").each(function () {
            tinyMCE.triggerSave();
            var description = $(this).find('textarea.description').val(),
                endYear = "";
            if ($(this).find("select.endMonth").val() != "Present") {
                endYear = $(this).find("select.endYear").val();
            }
            exp.push({
                "company": $(this).find("input.company").val(),
                "city": $(this).find("input.city").val(),
                "state": $(this).find("input.state").val(),
                "position": $(this).find("input.position").val(),
                "startMonth": $(this).find("select.startMonth").val(),
                "startYear": $(this).find("select.startYear").val(),
                "endMonth": $(this).find("select.endMonth").val(),
                "endYear": endYear,
                "description": description
            });
        });
        data["experience"] = exp;
        //get skills
        data["skills"] = $("#skills textarea").val();
        //get references
        var ref = [];
        $("#references .reference-group").each(function () {
            ref.push({
                "name": $(this).find("input.name").val(),
                "position": $(this).find("input.position").val(),
                "company": $(this).find("input.company").val(),
                "phone": $(this).find("input.phone").val(),
                "email": $(this).find("input.email").val()
            });
        });
        data["references"] = ref;

        console.log(data);

        //make sure the key max hasn't been reached and it was found
        if(!keyMatch.maxReached && keyMatch.found){
            //get the filename
            $.ajax({
                url: "getFile.php",
                method: "POST",
                data: { 'key': key},
            })
            .done(function(filename){
                filename = $.trim(filename);
                if(filename){
                    console.log(filename);
                    //send it to the exporter
                    exportDocx(data, "examples/" + filename);
                } else {
                    alert("No filename available");
                }
            })
            .fail(function(result){
                console.log(result);
            });
        } else {
            exportDocx(data, "examples/basic-example.docx");
        }

    });

    var keyMatch = {
            "maxReached": false,
            "found": true
        };
    var checkDownloads = function(){
        //get the filename
        $.ajax({
            url: "getKey.php",
            method: "POST",
            data: { 'key': key},
        })
        .done(function(result){
            console.log(result);
            if(result > 100){
                alert("This key has expired (max download limit reached). You may continue to fill out the form and download the sample template.");
                keyMatch.maxReached = true;
            } else if( result == "" ) {
                alert("This key could not be found. You may continue to fill out the form and download the sample template.");
                keyMatch.found = false;
            }
        })
        .fail(function(result){
            console.log(result);
        });
    }

    var key = getUrlVars()["key"];
    checkDownloads();

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1].replace(/#/g, '');
        }
        return vars;
    }
})