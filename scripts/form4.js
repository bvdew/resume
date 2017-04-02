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
var currentYear = (new Date).getFullYear() + 4,
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
    //$(newGroup).find(".mce-tinymce").remove();
    $(newGroup).find("textarea.description").remove();
    $(newGroup).find(".editorPlacholder").append('<textarea class="description" rows="5" cols="80"></textarea>')
    //initialize the html editor
    /*tinymce.init({
        selector: ".experience-group textarea.description",
        height: 200,
        menubar: false,
        plugins: [
            'lists paste preview wordcount fullscreen paste '
        ],
        toolbar: 'undo redo | bold italic | bullist numlist'
    });*/
});
/*tinymce.init({
    selector: '.experience-group textarea.description',
    height: 200,
    menubar: false,
    plugins: [
        'lists paste preview wordcount fullscreen paste '
    ],
    toolbar: 'undo redo | bold italic | bullist numlist'
});*/
//present job doesn't need year
$("select.endMonth").on("change", function () {
    if ($(this).val() == "present") {
        $(this).closest(".experience-group").find("select.endYear").val("0").prop("disabled", true);
    } else {
        $(this).closest(".experience-group").find("select.endYear").prop("disabled", false);
    }
})
//new training group//new education group
$(document).on("click", "button.add-training", function () {
    var trainingGroup = $(".training-group")[0];
    var newGroup = $(trainingGroup).clone().appendTo(".training-placeholder");
    //clear out the previous values
    $(newGroup).find("input").val("");
    $(newGroup).find("select").val("0");
});
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
    $(".tab-container").slideUp();
    $("#loadingPage").show();
    formToObject(saveDocx);
});

var saveDocx = function (data) {
    console.log("%cSAVE DOCX", "color:green");
    console.log(data);

    //make sure the key max hasn't been reached and it was found
    console.log(keyMatch);
    if (!keyMatch.maxReached && keyMatch.found) {
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
                exportDocx(data, "templates/" + filename);
            } else {
                alert("No filename available");
            }
        })
        .fail(function (result) {
            console.log(result);
        });
    } else {
        //export the demo template
        exportDocx(data, "templates/demo.docx");
        // Stop loading
        $("#loadingPage .done").show();
        setTimeout(function(){
            $(".tab-container").slideDown();
            $("#loadingPage").hide();
            $("#loadingPage .done").hide();
        }, 3000);
    }
}

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
        } else if (key.indexOf("education_") > -1) {
            switch(key){
                case "education_course":
                    if( value == 0 ){
                        $("#education .education-group .row.course").remove();
                    }
                    break;
                case "education_institute":
                    if( value == 0 ){
                        $("#education .education-group .row.institute").remove();
                    }
                    break;
                case "education_city":
                    if( value == 0 ){
                        $("#education .education-group .row.city").remove();
                    }
                    break;
                case "education_state":
                    if( value == 0 ){
                        $("#education .education-group .row.state").remove();
                    }
                    break;
                case "education_startMonth":
                    if( value == 0 ){
                        $("#education .education-group .startMonth").remove();
                    }
                    break;
                case "education_startYear":
                    if( value == 0 ){
                        $("#education .education-group .startYear").remove();
                    }
                    break;
                case "education_endMonth":
                    if( value == 0 ){
                        $("#education .education-group .endMonth").remove();
                    }
                    break;
                case "education_endYear":
                    if( value == 0 ){
                        $("#education .education-group .endYear").remove();
                    }
                    break; 
            }
        }

        //experience
        if (key == "experience_group" && value == 0) {
            $("#experience .experience-group").remove();
            $("#experience .add-experience").remove();
            $("#experience p").html("The experience group is not part of this template.");
        } else if (key.indexOf("experience_") > -1) {
            switch(key){
                case "experience_company":
                    if( value == 0 ){
                        $("#experience .experience-group .row.company").remove();
                    }
                    break;
                case "experience_city":
                    if( value == 0 ){
                        $("#experience .experience-group .row.city").remove();
                    }
                    break;
                case "experience_state":
                    if( value == 0 ){
                        $("#experience .experience-group .row.state").remove();
                    }
                    break;
                case "experience_position":
                    if( value == 0 ){
                        $("#experience .experience-group .row.position").remove();
                    }
                    break;
                case "experience_startMonth":
                    if( value == 0 ){
                        $("#experience .experience-group .startMonth").remove();
                    }
                    break;
                case "experience_startYear":
                    if( value == 0 ){
                        $("#experience .experience-group .startYear").remove();
                    }
                    break;
                case "experience_endMonth":
                    if( value == 0 ){
                        $("#experience .experience-group .endMonth").remove();
                    }
                    break;
                case "experience_endYear":
                    if( value == 0 ){
                        $("#experience .experience-group .endYear").remove();
                    }
                    break; 
                case "experience_description":
                    if( value == 0 ){
                        $("#experience .experience-group .row.description").remove();
                    }
                    break; 
            }
        }

        //skills
        if (key == "skills" && value == 0) {
            $("textarea#skills").prop("disabled", true).val("The skills section is not part of this template.");
            $("#skills p").html("The skills section is not part of this template.");
        }

        //certifications
        if (key == "certifications" && value == 0) {
            $("textarea#certification").prop("disabled", true).val("The certifications section is not part of this template.");
            $("#certifications p").html("The certifications section is not part of this template.");
        }

        //trainings
        if (key == "training_group" && value == 0) {
            $("#training .training-group").remove();
            $("#training .add-training").remove();
            $("#training p").html("The training group is not part of this template.");
        } else if (key.indexOf("training_") > -1) {
            switch(key){
                case "training_institute":
                    if( value == 0 ){
                        $("#training .training-group .row.institute").remove();
                    }
                    break;
                case "training_city":
                    if( value == 0 ){
                        $("#training .training-group .row.city").remove();
                    }
                    break;
                case "training_state":
                    if( value == 0 ){
                        $("#training .training-group .row.state").remove();
                    }
                    break;
                case "training_course":
                    if( value == 0 ){
                        $("#training .training-group .row.course").remove();
                    }
                    break;
                case "training_startMonth":
                    if( value == 0 ){
                        $("#training .training-group .startMonth").remove();
                    }
                    break;
                case "training_startYear":
                    if( value == 0 ){
                        $("#training .training-group .startYear").remove();
                    }
                    break;
                case "training_endMonth":
                    if( value == 0 ){
                        $("#experience .training-group .endMonth").remove();
                    }
                    break;
                case "training_endYear":
                    if( value == 0 ){
                        $("#experience .training-group .endYear").remove();
                    }
                    break; 
            }
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
                    keyMatch.found = true;
                    keyMatch.key = "demo";
                } else if (result == "") {
                    alert("This key could not be found. You may continue to fill out the form and download the sample template.");
                    keyMatch.found = false;
                    keyMatch.maxReached = false;
                    keyMatch.key = "demo";
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
        keyMatch.key = "demo";
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