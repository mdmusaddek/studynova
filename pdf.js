"use strict";

/* ==========================================
   NovaOS Lite
   PDF Summary Module
========================================== */

const pdfFile = document.getElementById("pdfFile");
const pdfFileName = document.getElementById("pdfFileName");
const fileSize = document.getElementById("fileSize");
const summaryOutput = document.getElementById("summaryOutput");
const generateSummary = document.getElementById("generateSummary");
const keyPoints = document.getElementById("keyPoints");

/* ==========================================
   Select PDF
========================================== */

pdfFile.addEventListener("change", () => {

    const file = pdfFile.files[0];

    if (!file) return;

    pdfFileName.textContent = file.name;

    fileSize.textContent =
        (file.size / 1024 / 1024).toFixed(2) + " MB";

    summaryOutput.innerHTML = `
        <p>📄 <strong>${file.name}</strong></p>
        <br>
        <p>✅ PDF selected successfully.</p>
        <p>Click <strong>Generate Summary</strong>.</p>
    `;

    keyPoints.innerHTML = "";

});


/* ==========================================
   Generate AI Summary
========================================== */

generateSummary.addEventListener("click", async () => {
console.log("PDF count:", pdfFile.files.length);
console.log("PDF file:", pdfFile.files[0]);
    if (!pdfFile.files.length) {

        alert("Please choose a PDF first.");

        return;

    }

    const formData = new FormData();

    formData.append("pdf", pdfFile.files[0]);

    summaryOutput.innerHTML = `
        <p>⏳ Uploading PDF...</p>
    `;

    keyPoints.innerHTML = "";

    try {

        const response = await fetch(
            "http://127.0.0.1:3000/api/pdf-summary",
            {
                method: "POST",
                body: formData
            }
        );



const raw = await response.text();

console.log("PDF API Response:", raw);

const data = JSON.parse(raw);



        

        if (!response.ok) {

            throw new Error(
                data.summary || "Server Error"
            );

        }

        summaryOutput.innerHTML = `
            <h3>📄 AI Summary</h3>
            <p>${data.summary}</p>
        `;

        keyPoints.innerHTML = `
            <li>✅ PDF Uploaded</li>
            <li>✅ Text Extracted</li>
            <li>✅ AI Summary Generated</li>
        `;

    }

    catch (err) {

        console.error(err);

        summaryOutput.innerHTML = `
            <p style="color:red;">
                ❌ ${err.message}
            </p>
        `;

    }

});