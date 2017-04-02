function formToObject(callback) {
    var data = {},
        toCall = 0,
        doneCall = 0;

    //get contact info
    $("#contact input").each(function () {
        var id = $(this).attr("id"),
            value = $(this).val();
        data[id] = value;
    });

    //get first initial
    if ($("input#firstName").val() != "") {
        data['fI'] = $("input#firstName").val().substring(0, 1);
        data['hasfI'] = true;
    } else {
        data['hasfI'] = false;
    }

    //get last initial
    if ($("input#lastName").val() != "") {
        data['lI'] = $("input#lastName").val().substring(0, 1);
        data['haslI'] = true;
    } else {
        data['haslI'] = false;
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
    //tinyMCE.triggerSave();
    $("#experience .experience-group").each(function () {
        var grp = this;
        //console.log("found experience")
        var description = $(grp).find('textarea.description').val(),
            endYear = "";

        if ($(this).find("select.endMonth").val() != "present") {
            endYear = $(grp).find("select.endYear").val();
        }
        if ($(grp).find("input.company").val() != "" ||
            $(grp).find("input.position").val() != "" ||
            description != "") {

            //console.log(description);

            if (description != "") {
                pre = '<w:p><w:pPr><w:pStyle w:val="Paragraph"/></w:pPr><w:r><w:t>';
                post = '</w:t></w:r></w:p>';
                lineBreak = '<w:br/>';
                tempDescription = pre;

                //console.log(description);
                description = description.split(/\n/);
                $.each(description, function (k, l) {
                    if (l != "") {
                        tempDescription += l + lineBreak;
                    }
                });
                
                tempDescription += post;

                description = tempDescription;
            } else {
                description = "";
            }

            exp.push({
                "company": $(grp).find("input.company").val() == undefined ? "" : $(grp).find("input.company").val(),
                "city": $(grp).find("input.city").val() == undefined ? "" : $(grp).find("input.city").val(),
                "state": $(grp).find("input.state").val() == undefined ? "" : $(grp).find("input.state").val(),
                "position": $(grp).find("input.position").val() == undefined ? "" : $(grp).find("input.position").val(),
                "startMonth": $(grp).find("select.startMonth").val() == 0 ? "" : $(grp).find("select.startMonth").val(),
                "startYear": $(grp).find("select.startYear").val() == 0 ? "" : $(grp).find("select.startYear").val(),
                "endMonth": $(grp).find("select.endMonth").val() == 0 ? "" : $(grp).find("select.endMonth").val(),
                "endYear": endYear == 0 ? "" : endYear,
                "description": tempDescription
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

    var convertInterval = setInterval(function () {
        //console.log(toCall, doneCall);
        if (toCall == doneCall) {
            clearInterval(convertInterval);
            //console.log(data);
            //console.log(data["experience"][0])
            callback(data);
        }
    }, 2000);

}