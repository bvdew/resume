function exportDocx(data, filePath) {
    function loadFile(url, callback) {
        JSZipUtils.getBinaryContent(url, callback);
    }
    loadFile(filePath, function (error, content) {
        if (error) {
            throw error
        };
        var zip = new JSZip(content);
        var doc = new Docxtemplater().loadZip(zip);
        doc.setData(data);

        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
        } catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({
                error: e
            }));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw error;
        }

        var out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }) //Output the document using Data-URI
        saveAs(out, "resume.docx")
    })
}