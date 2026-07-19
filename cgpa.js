"use strict";
/* =====================================================
   NovaOS Lite
   cgpa.js
   Part 1
   State + LocalStorage + Render
===================================================== */

/* ==========================================
   Elements
========================================== */

const semestersContainer =
document.getElementById("semestersContainer");



const calculateCGPAButton =
document.getElementById("calculateCGPA");

const cgpaResult =
document.getElementById("cgpaResult");

/* ==========================================
   State
========================================== */

let semesters = [];

/* ==========================================
   LocalStorage
========================================== */

function loadSemesters(){

    const saved =
    localStorage.getItem("nova-cgpa");

    semesters = saved
        ? JSON.parse(saved)
        : [];

}

function saveSemesters(){

    localStorage.setItem(
        "nova-cgpa",
        JSON.stringify(semesters)
    );

}

/* ==========================================
   Render
========================================== */

function renderSemesters(){

    semestersContainer.innerHTML = "";

    if(semesters.length === 0){

        semestersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-graduation-cap"></i>
                <h3>No Semester Added</h3>
                <p>Click "Add Semester" to begin.</p>
            </div>
        `;

        return;

    }

    semesters.forEach((semester,index)=>{

        const row = document.createElement("div");

        row.className = "semester-row";

        row.innerHTML = `
            <input
                type="text"
                class="semester-name"
                data-index="${index}"
                placeholder="Semester Name"
                value="${semester.name}">

            <input
                type="number"
                class="semester-gpa"
                data-index="${index}"
                placeholder="GPA"
                min="0"
                max="4"
                step="0.01"
                value="${semester.gpa}">

            <button
                class="delete-semester"
                data-index="${index}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        semestersContainer.appendChild(row);

    });

}
/* =====================================================
   NovaOS Lite
   cgpa.js
   Part 2
   Add + Delete + Update
===================================================== */

/* ==========================================
   Add Semester
========================================== */
const addSemesterButton =
document.getElementById("addSemester");
function addSemester() {
alert("Button Clicked");
    semesters.push({

        name: "",

        gpa: ""

    });

    saveSemesters();

    renderSemesters();

}
/* ==========================================
   Delete Semester
========================================== */

function deleteSemester(index) {

    semesters.splice(index, 1);

    saveSemesters();

    renderSemesters();

}

/* ==========================================
   Update Semester
========================================== */

function updateSemester(index, field, value) {

    if (!semesters[index]) return;

    if (field === "gpa") {

        value = parseFloat(value);

        if (isNaN(value)) {

            value = "";

        }

    }

    semesters[index][field] = value;

    saveSemesters();

}

/* ==========================================
   Input Events
========================================== */

semestersContainer.addEventListener("input", function (event) {

    const index = Number(event.target.dataset.index);

    if (event.target.classList.contains("semester-name")) {

        updateSemester(index, "name", event.target.value);

    }

    if (event.target.classList.contains("semester-gpa")) {

        updateSemester(index, "gpa", event.target.value);

    }

});

/* ==========================================
   Delete Button
========================================== */

semestersContainer.addEventListener("click", function (event) {

    const button = event.target.closest(".delete-semester");

    if (!button) return;

    const index = Number(button.dataset.index);

    deleteSemester(index);

});

/* ==========================================
   Add Button
========================================== */

if (addSemesterButton) {

    addSemesterButton.addEventListener(

        "click",

        addSemester

    );

}
if (addSemesterButton) {
    addSemesterButton.addEventListener("click", addSemester);
}
loadSemesters();

renderSemesters();

/* ==========================================
   Calculate CGPA
========================================== */

function calculateCGPA() {

    if (semesters.length === 0) {

        alert("Please add at least one semester.");

        cgpaResult.textContent = "0.00";

        return;

    }

    let total = 0;
    let count = 0;

    for (const semester of semesters) {

        const gpa = Number(semester.gpa);

        if (
            semester.name.trim() === "" ||
            isNaN(gpa)
        ) {

            alert("Please complete all semester information.");

            return;

        }

        if (gpa < 0 || gpa > 4) {

            alert("GPA must be between 0.00 and 4.00");

            return;

        }

        total += gpa;
        count++;

    }

    const cgpa = total / count;

    cgpaResult.textContent = cgpa.toFixed(2);

    localStorage.setItem(
        "nova-cgpa-result",
        cgpa.toFixed(2)
    );

}
if (calculateCGPAButton) {

    calculateCGPAButton.addEventListener(

        "click",

        calculateCGPA

    );

}