$(function () {

    $("div.tab-menu>div.list-group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.tab>div.tab-content").removeClass("active");
        $("div.tab>div.tab-content").eq(index).addClass("active");
    });

    $(".btn-next").click(function(e){
        $("div.tab-menu>div.list-group>a").eq($(this).attr("data-target")).trigger("click");
    });

    //get education years
    var currentYear = (new Date).getFullYear() + 2,
        row = [];
    for( var y = currentYear; y >= currentYear - 100; y--){
        row.push('<option value="' + y + '">' + y + '</option>');
    }
    $("select.years").append(row.join(''));

    //new education group
    $(document).on("click", "button.add-education", function(){
        var educationGroup = $(".education-group")[0];
        var newGroup = $(educationGroup).clone().appendTo(".education-placeholder");
        //clear out the previous values
        $(newGroup).find("input").val("");
        $(newGroup).find("select").val("0");
    });
    //new experience group
    $(document).on("click", "button.add-experience", function(){
        var experienceGroup = $(".experience-group")[0];
        var newGroup = $(experienceGroup).clone().appendTo(".experience-placeholder");
        //clear out the previous values
        $(newGroup).find("input").val("");
        $(newGroup).find("textarea").val("");
        $(newGroup).find("select").val("0");
    });
    //present job doesn't need year
    $("select.endMonth").on("change", function(){
        if($(this).val() == "present"){
            $(this).closest(".experience-group").find("select.endYear").val("0").prop("disabled", true);
        } else {
            $(this).closest(".experience-group").find("select.endYear").prop("disabled", false);
        }
    })
    //new reference group
    $(document).on("click", "button.add-reference", function(){
        var experienceGroup = $(".reference-group")[0];
        var newGroup = $(experienceGroup).clone().appendTo(".reference-placeholder");
        //clear out the previous values
        $(newGroup).find("input").val("");
        $(newGroup).find("textarea").val("");
        $(newGroup).find("select").val("0");
    });

    //export resume to .docx
    $(document).on("click", "#exportDocx", function(){
        console.log("click")
        var data = {};

        //get contact info
        $("#contact input").each(function(){
            var key = $(this).attr("id"),
                value = $(this).val();
            data[key] = value;
        });
        //get personal info
        data["personalStatement"] = $("#personal textarea").val();
        //get education
        var eds = [];
        $("#education .education-group").each(function(){
            eds.push({
                "institute": $(this).find("input.institute").val(),
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
        $("#experience .experience-group").each(function(){
            exp.push({
                "company": $(this).find("input.company").val(),
                "position": $(this).find("input.position").val(),
                "startMonth": $(this).find("select.startMonth").val(),
                "startYear": $(this).find("select.startYear").val(),
                "endMonth": $(this).find("select.endMonth").val(),
                "endYear": $(this).find("select.endYear").val(),
                "description": $(this).find("textarea.course").val()
            });
        });
        data["experience"] = exp;
        //get skills
        data["skills"] = $("#skills textarea").val();
        //get references
        var ref = [];
        $("#references .reference-group").each(function(){
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

        //send it to the exporter
        exportDocx(data, "examples/tag-example-3.docx");
    });
})