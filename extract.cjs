const fs = require('fs');
const PDFParser = require("pdf2json");

let pdfParser = new PDFParser(this, 1);
pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync("./content.txt", pdfParser.getRawTextContent());
    console.log("Extracted successfully!");
});
pdfParser.loadPDF("public/Pranav_V_Resume.pdf");
