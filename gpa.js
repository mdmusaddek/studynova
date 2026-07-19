"use strict";

/* ==========================================
   NovaOS Lite
   SSC GPA Calculator
========================================== */

const subjectsContainer =
document.getElementById("subjectsContainer");

const addSubjectButton =
document.getElementById("addSubject");

const calculateButton =
document.getElementById("calculateGPA");

const gpaResult =
document.getElementById("gpaResult");

const optionalGrade =
document.getElementById("optionalGrade");

/* ==========================================
   Grade Table
========================================== */

const gradePoints = {

    "A+":5.00,
    "A":4.00,
    "A-":3.50,
    "B":3.00,
    "C":2.00,
    "D":1.00,
    "F":0.00

};

/* ==========================================
   State
========================================== */

let subjects = [];

/* ==========================================
   Local Storage
========================================== */

function loadSubjects(){

    const saved =
    localStorage.getItem("nova-ssc-subjects");

    if(saved){

        subjects = JSON.parse(saved);

    }else{

        subjects = [];

    }

}

function saveSubjects(){

    localStorage.setItem(

        "nova-ssc-subjects",

        JSON.stringify(subjects)

    );

}

/* ==========================================
   Add Subject
========================================== */

function addSubject(){

    subjects.push({

        name:"",
        grade:"A+"

    });

    saveSubjects();

    renderSubjects();

}

/* ==========================================
   Delete Subject
========================================== */

function deleteSubject(index){

    subjects.splice(index,1);

    saveSubjects();

    renderSubjects();

}

/* ==========================================
   Update Subject
========================================== */

function updateSubject(index,field,value){

    if(!subjects[index]) return;

    subjects[index][field]=value;

    saveSubjects();

}

/* ==========================================
   Render
========================================== */

function renderSubjects(){

    subjectsContainer.innerHTML="";

    if(subjects.length===0){

        subjectsContainer.innerHTML=`

        <div class="empty-state">

            <i class="fa-solid fa-book-open"></i>

            <h3>No Subjects Added</h3>

            <p>Click "Add Subject"</p>

        </div>

        `;

        return;

    }

    subjects.forEach((subject,index)=>{

        const row=document.createElement("div");

        row.className="subject-row";

        row.innerHTML=`

<input
type="text"
class="subject-name"
data-index="${index}"
placeholder="Subject Name"
value="${subject.name}">

<select
class="subject-grade"
data-index="${index}">

${Object.keys(gradePoints).map(g=>`

<option
value="${g}"
${g===subject.grade?"selected":""}>

${g}

</option>

`).join("")}

</select>

<button
class="delete-row"
data-index="${index}">

<i class="fa-solid fa-trash"></i>

</button>

`;

        subjectsContainer.appendChild(row);

    });

}
/* ==========================================
   NovaOS Lite
   SSC GPA Calculator
   Part 2
   Events + LocalStorage
========================================== */

/* ---------- Subject Input ---------- */

subjectsContainer.addEventListener("input", function(event){

    const index = Number(event.target.dataset.index);

    if(event.target.classList.contains("subject-name")){

        updateSubject(

            index,

            "name",

            event.target.value

        );

    }

});

/* ---------- Grade Change ---------- */

subjectsContainer.addEventListener("change", function(event){

    const index = Number(event.target.dataset.index);

    if(event.target.classList.contains("subject-grade")){

        updateSubject(

            index,

            "grade",

            event.target.value

        );

        calculateGPA();

    }

});

/* ---------- Delete Subject ---------- */

subjectsContainer.addEventListener("click", function(event){

    const button = event.target.closest(".delete-row");

    if(!button) return;

    const index = Number(button.dataset.index);

    deleteSubject(index);

    calculateGPA();

});

/* ---------- Add Subject ---------- */

if(addSubjectButton){

    addSubjectButton.addEventListener(

        "click",

        addSubject

    );

}

/* ---------- Optional Subject ---------- */

if(optionalGrade){

    const savedOptional =

    localStorage.getItem("nova-optional-grade");

    if(savedOptional){

        optionalGrade.value = savedOptional;

    }

    optionalGrade.addEventListener(

        "change",

        function(){

            localStorage.setItem(

                "nova-optional-grade",

                optionalGrade.value

            );

            calculateGPA();

        }

    );

}

/* ---------- Restore GPA ---------- */

function loadSavedGPA(){

    const saved =

    localStorage.getItem(

        "nova-ssc-gpa"

    );

    if(saved){

        gpaResult.textContent = saved;

    }else{

        gpaResult.textContent = "0.00";

    }

}


/* ==========================================
   NovaOS Lite
   SSC GPA Calculator
   Part 3
   GPA Calculation + Init
========================================== */

/* ---------- Calculate GPA ---------- */

function calculateGPA(){

    if(subjects.length===0){

        gpaResult.textContent="0.00";
        return;

    }

    let total=0;
    let count=0;
    let hasFail=false;

    for(const subject of subjects){

        if(!subject.name.trim()){

            gpaResult.textContent="0.00";
            return;

        }

        const point=gradePoints[subject.grade];

        if(point===0){

            hasFail=true;

        }

        total+=point;
        count++;

    }

    if(hasFail){

        gpaResult.textContent="0.00";

        localStorage.setItem(
            "nova-ssc-gpa",
            "0.00"
        );

        return;

    }

    let gpa=total/count;

    /* Optional Subject */

    if(optionalGrade){

        const optionalPoint=

        parseFloat(optionalGrade.value);

        if(!isNaN(optionalPoint)){

            if(optionalPoint>2){

                gpa+=(optionalPoint-2)/count;

            }

        }

    }

    if(gpa>5){

        gpa=5;

    }

    gpaResult.textContent=gpa.toFixed(2);

    localStorage.setItem(

        "nova-ssc-gpa",

        gpa.toFixed(2)

    );

}

/* ---------- Auto Calculate ---------- */

subjectsContainer.addEventListener(

    "input",

    calculateGPA

);

/* ---------- Calculate Button ---------- */

if(calculateButton){

    calculateButton.addEventListener(

        "click",

        calculateGPA

    );

}

/* ---------- Initialize ---------- */

loadSubjects();

renderSubjects();

loadSavedGPA();

calculateGPA();