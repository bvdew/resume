$(function () {

    var keyMatch = {
        "maxReached": false,
        "found": true,
        "key": ""
    };

    $("div.tab-menu>div.list-group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.tab>div.tab-content").removeClass("active");
        $("div.tab>div.tab-content").eq(index).addClass("active");
    });

    $(".btn-next").click(function (e) {
        //get active tab
        var tab = $("div.list-group a.active");
        $("div.list-group a").removeClass("active");
        $(tab).next().trigger("click");
    });

    $(".btn-prev").click(function (e) {
        //get active tab
        var tab = $("div.list-group a.active");
        $("div.list-group a").removeClass("active");
        $(tab).prev().trigger("click");
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
        $(newGroup).find("select").val("0");
        $(newGroup).find(".mce-tinymce").remove();
        $(newGroup).find("textarea.description").remove();
        $(newGroup).find(".editorPlacholder").append('<textarea class="description" rows="5" cols="80"></textarea>')
        //initialize the html editor
        tinymce.init({
            selector: ".experience-group textarea.description",
            height: 200,
            menubar: false,
            plugins: [
                'lists paste preview wordcount fullscreen paste '
            ],
            toolbar: 'undo redo | bold italic | bullist numlist'
        });
    });
    tinymce.init({
        selector: '.experience-group textarea.description',
        height: 200,
        menubar: false,
        plugins: [
                'lists paste preview wordcount fullscreen paste '
            ],
            toolbar: 'undo redo | bold italic | bullist numlist'
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


    /*****************************
     * EXPORT DATA TO RESUME
     *****************************/
    $(document).on("click", "#exportDocx", function () {
        var data = {};

        //get contact info
        $("#contact input").each(function () {
            var id = $(this).attr("id"),
                value = $(this).val();
            data[id] = value;
        });

        //get first initial
        if ($("input#firstName").val() != "") {
            data['fI'] = $("input#firstName").val().substring(1);
            data['hasfI'] = true;
        } else {
            data['hasfI'] = false;
        }

        //get personal info
        data["personalStatement"] = $("#personal textarea").val();
        //get education
        var eds = [];
        $("#education .education-group").each(function () {
            if ($(this).find("input.course").val() != "" ||
                $(this).find("input.institute").val() != "") {
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
            }
        });
        data["education"] = eds;
        //get experience
        var exp = [];
        tinyMCE.triggerSave();
        $("#experience .experience-group").each(function () {
            console.log("found experience")
            var description = $(this).find('textarea.description').val(),
                endYear = "";

            if ($(this).find("select.endMonth").val() != "present") {
                endYear = $(this).find("select.endYear").val();
            }
            if ($(this).find("input.company").val() != "" ||
                $(this).find("input.position").val() != "" ||
                description != "") {

                console.log(description);
                if(description != ""){
                    description = description.replace(/\r?\n|\r/g, '');
                    console.log(description);
                    console.log($(description).length)
                    var descriptionArray = [];
                    for (var i = 0; i < $(description).length; i++){
                        console.log($(description)[i])
                        var descriptionDocx = convertContent($(description)[i]);
                        console.log(descriptionDocx);
                        descriptionArray.push( descriptionDocx.string ); //.replace("<w:body>", "").replace("</w:body>", "").replace("<w:body/>", "") );
                    }

                    description = descriptionArray.join("");

                    console.log(description);

                    /*var converted = htmlDocx.asBlob(description);
                    console.log(converted);
                    saveAs(converted, 'test.docx');*/
                }

                exp.push({
                    "company": $(this).find("input.company").val(),
                    "city": $(this).find("input.city").val(),
                    "state": $(this).find("input.state").val(),
                    "position": $(this).find("input.position").val(),
                    "startMonth": $(this).find("select.startMonth").val() == 0 ? "" : $(this).find("select.startMonth").val(),
                    "startYear": $(this).find("select.startYear").val() == 0 ? "" : $(this).find("select.startYear").val(),
                    "endMonth": $(this).find("select.endMonth").val() == 0 ? "" : $(this).find("select.endMonth").val(),
                    "endYear": endYear == 0 ? "" : endYear,
                    "description": description
                });
            }
        });
        data["experience"] = exp;
        //get skills
        var skills = $("#skills textarea").val();
        skills = skills.split(/\n/);
        data["skills"] = [];
        $.each(skills, function (k, s) {
            if (s != "") {
                data["skills"].push({
                    "name": s
                })
            }
        });
        if (data["skills"].length) {
            data["hasskills"] = true;
        } else {
            data["hasskills"] = false;
        }

        //get certifications
        var certifications = $("#certifications textarea").val();
        certifications = certifications.split(/\n/);
        data["certifications"] = [];
        $.each(certifications, function (k, s) {
            if (s != "") {
                data["certifications"].push({
                    "name": s
                })
            }
        });
        if (data["certifications"].length) {
            data["hascertifications"] = true;
        } else {
            data["hascertifications"] = false;
        }

        //get trainings
        var trainings = [];
        $("#training .training-group").each(function () {
            if ($(this).find("input.course").val() != "" ||
                $(this).find("input.institute").val() != "") {
                trainings.push({
                    "institute": $(this).find("input.institute").val(),
                    "city": $(this).find("input.city").val(),
                    "state": $(this).find("input.state").val(),
                    "startMonth": $(this).find("select.startMonth").val(),
                    "startYear": $(this).find("select.startYear").val(),
                    "endMonth": $(this).find("select.endMonth").val(),
                    "endYear": $(this).find("select.endYear").val(),
                    "course": $(this).find("input.course").val()
                });
            }
        });
        data["training"] = trainings;
        if (data["training"].length) {
            data["hastraining"] = true;
        } else {
            data["hastraining"] = false;
        }

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

        $.each(data, function (id, value) {
            if (value != "" || value != 0) {
                data["has" + id] = true;
            } else {
                data["has" + id] = false;
            }
        });
        console.log(data);

        exportDocx(data, "examples/Travis%20Brown/travis_brown-template.docx");
        return true;

        //make sure the key max hasn't been reached and it was found
        //if(!keyMatch.maxReached && keyMatch.found){
        //get the filename
        $.ajax({
            url: "getFile.php",
            method: "POST",
            data: { 'key': keyMatch.key },
        })
            .done(function (filename) {
                filename = $.trim(filename);
                if (filename) {
                    console.log(filename);
                    //send it to the exporter
                    exportDocx(data, "examples/" + filename);
                } else {
                    alert("No filename available");
                }
            })
            .fail(function (result) {
                console.log(result);
            });
        /*} else {
            //export the demo template
            exportDocx(data, "examples/demo.docx");
        }*/

    });

    var showFields = function (f) {
        console.log("showFields");
        $.each(f, function (key, value) {
            console.log(key + ": " + value);
            if ($("#contact input#" + key).length > 0) {
                if (value == 0) {
                    $("#contact input#" + key).closest(".form-group").remove();
                }
            }
            //personal statement
            if (key == "personalStatement" && value == 0) {
                $("textarea#personalStatement").prop("disabled", true).val("The personal statement is not part of this template.");
                $("#personal p").html("The personal statement is not part of this template.");
            }

            //education
            if (key == "education_group" && value == 0) {
                $("#education .education-group").remove();
                $("#education .add-education").remove();
                $("#education p").html("The education group is not part of this template.");
            }

            //experience
            if (key == "experience_group" && value == 0) {
                $("#experience .experience-group").remove();
                $("#experience .add-experience").remove();
                $("#experience p").html("The experience group is not part of this template.");
            }

            //skills
            if (key == "skills" && value == 0) {
                $("textarea#skills").prop("disabled", true).val("The skills section is not part of this template.");
                $("#skills p").html("The skills section is not part of this template.");
            }

            //references
            if (key == "references_group" && value == 0) {
                $("#references .reference-group").remove();
                $("#references .add-reference").remove();
                $("#references p").html("The references group is not part of this template.");
            }
        })
    }

    var getFields = function () {
        console.log("getFields")
        //if( !keyMatch.maxReached && keyMatch.found ){
        //get the fields
        $.ajax({
            url: "getFields.php",
            method: "POST",
            data: { 'key': keyMatch.key },
        })
            .done(function (result) {
                var data = $.parseJSON(result);
                console.log(data);
                if (data.length > 0) {
                    showFields(data[0]);
                } else {
                    alert("Something went wrong. Please try again later.");
                }
            })
            .fail(function (result) {
                console.log(result);
            });
        /*} else {
            keyMatch.found = false;
        }*/
    }

    var checkDownloads = function () {
        console.log("Key: " + keyMatch.key);
        if (keyMatch.key != undefined) {
            //get the filename
            $.ajax({
                url: "getKey.php",
                method: "POST",
                data: { 'key': keyMatch.key },
            })
                .done(function (result) {
                    console.log(result);
                    if (result > 100) {
                        alert("This key has expired (max download limit reached). You may continue to fill out the form and download the sample template.");
                        keyMatch.maxReached = true;
                    } else if (result == "") {
                        alert("This key could not be found. You may continue to fill out the form and download the sample template.");
                        keyMatch.found = false;
                    }
                })
                .fail(function (result) {
                    console.log(result);
                })
                .always(function () {
                    getFields();
                });
        } else {
            keyMatch.found = false;
            keyMatch.key = "abc123";
            getFields();
        }
    }

    keyMatch.key = getUrlVars()["key"];
    checkDownloads();

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            var value = hash[1];
            if (value != undefined) {
                value.replace(/#/g, '');
            }
            vars[hash[0]] = value;
        }
        return vars;
    }

})