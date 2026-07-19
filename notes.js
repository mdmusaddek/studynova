/* =====================================================
   NovaOS Lite
   notes.js
   Part 1
   State + LocalStorage + Render
===================================================== */

"use strict";

/* ==========================================
   Elements
========================================== */

const notesList = document.getElementById("notesList");

const noteTitle = document.getElementById("noteTitle");

const noteContent = document.getElementById("noteContent");

const searchInput = document.getElementById("searchNotes");

const newNoteButton = document.getElementById("newNoteBtn");
const saveButton = document.getElementById("saveNoteBtn");

const deleteButton = document.getElementById("deleteNoteBtn");

const pinButton = document.getElementById("pinNoteBtn");

const lastEdited = document.getElementById("lastEdited");

/* ==========================================
   State
========================================== */

let notes = [];

let activeNoteId = null;

/* ==========================================
   Load
========================================== */

function loadNotes(){

    const saved = localStorage.getItem("nova-notes");

    if(saved){

        notes = JSON.parse(saved);

    }else{

        notes = [];

    }

}

/* ==========================================
   Save
========================================== */

function saveNotes(){

    localStorage.setItem(

        "nova-notes",

        JSON.stringify(notes)

    );

}

/* ==========================================
   Dashboard
========================================== */

function updateDashboardCount(){

    const total = document.getElementById("totalNotes");

    if(total){

        total.textContent = notes.length;

    }

}

/* ==========================================
   Render Notes
========================================== */

function renderNotes(keyword=""){

    notesList.innerHTML = "";

    let filtered = notes.filter(note=>{

        return (

            note.title

            .toLowerCase()

            .includes(keyword.toLowerCase())

            ||

            note.content

            .toLowerCase()

            .includes(keyword.toLowerCase())

        );

    });

    filtered.sort((a,b)=>{

        return Number(b.pinned)-Number(a.pinned);

    });

    if(filtered.length===0){

        notesList.innerHTML = `

        <div class="empty-state">

            <i class="fa-solid fa-note-sticky"></i>

            <h3>No Notes</h3>

            <p>Create your first note.</p>

        </div>

        `;

        return;

    }

    filtered.forEach(note=>{

        const card=document.createElement("article");

        card.className="note-item";

        if(note.id===activeNoteId){

            card.classList.add("active");

        }

        card.innerHTML=`

        <div class="note-title">

            ${note.pinned ? "📌 " : ""}${note.title}

        </div>

        <div class="note-preview">

            ${note.content.substring(0,70)}

        </div>

        `;

        card.addEventListener(

            "click",

            ()=>openNote(note.id)

        );

        notesList.appendChild(card);

    });

    updateDashboardCount();

}
/* =====================================================
   NovaOS Lite
   notes.js
   Part 2
   Create + Open + Save + Delete
===================================================== */

/* ==========================================
   Helpers
========================================== */

function getCurrentDate(){

    return new Date().toLocaleString();

}

/* ==========================================
   Create Note
========================================== */

function createNote(){

    const note={

        id:Date.now(),

        title:"Untitled Note",

        content:"",

        pinned:false,

        createdAt:getCurrentDate(),

        updatedAt:getCurrentDate()

    };

    notes.unshift(note);

    activeNoteId=note.id;

    saveNotes();

    renderNotes();

    openNote(note.id);

}

/* ==========================================
   Open Note
========================================== */

function openNote(id){

    const note=

    notes.find(n=>n.id===id);

    if(!note) return;

    activeNoteId=id;

    noteTitle.value=note.title;

    noteContent.innerHTML=note.content;

    if(lastEdited){

        lastEdited.textContent=

        note.updatedAt;

    }

    renderNotes(

        searchInput.value

    );

}

/* ==========================================
   Save Current Note
========================================== */

function saveCurrentNote(){

    if(activeNoteId===null) return;

    const note=

    notes.find(

    n=>n.id===activeNoteId

    );

    if(!note) return;

    note.title=

    noteTitle.value.trim()

    || "Untitled Note";

    note.content=

    noteContent.innerHTML;

    note.updatedAt=

    getCurrentDate();

    saveNotes();

    renderNotes(

        searchInput.value

    );

    if(lastEdited){

        lastEdited.textContent=

        note.updatedAt;

    }

}

/* ==========================================
   Delete Note
========================================== */

function deleteCurrentNote(){

    if(activeNoteId===null){

        return;

    }

    const ok=

    confirm(

    "Delete this note?"

    );

    if(!ok) return;

    notes=

    notes.filter(

    note=>note.id!==activeNoteId

    );

    activeNoteId=null;

    noteTitle.value="";

    noteContent.innerHTML="";

    if(lastEdited){

        lastEdited.textContent="-";

    }

    saveNotes();

    renderNotes();

    if(notes.length){

        openNote(notes[0].id);

    }

}
/* =====================================================
   NovaOS Lite
   notes.js
   Part 3
   Pin + Search + Auto Save
===================================================== */

/* ==========================================
   Pin / Unpin
========================================== */

function togglePinNote() {

    if (activeNoteId === null) return;

    const note = notes.find(n => n.id === activeNoteId);

    if (!note) return;

    note.pinned = !note.pinned;

    note.updatedAt = getCurrentDate();

    saveNotes();

    renderNotes(searchInput.value);

}

/* ==========================================
   Search
========================================== */

function searchNotes() {

    const keyword = searchInput.value.trim();

    renderNotes(keyword);

}

/* ==========================================
   Auto Save
========================================== */

let autoSaveTimer = null;

function autoSave() {

    clearTimeout(autoSaveTimer);

    autoSaveTimer = setTimeout(() => {

        saveCurrentNote();

    }, 600);

}

/* ==========================================
   Update Last Edited
========================================== */

function refreshLastEdited() {

    if (activeNoteId === null) return;

    const note = notes.find(n => n.id === activeNoteId);

    if (!note) return;

    if (lastEdited) {

        lastEdited.textContent = note.updatedAt;

    }

}

/* ==========================================
   Sort Notes
========================================== */

function sortNotes() {

    notes.sort((a, b) => {

        if (a.pinned !== b.pinned) {

            return Number(b.pinned) - Number(a.pinned);

        }

        return new Date(b.updatedAt) - new Date(a.updatedAt);

    });

}

/* ==========================================
   Refresh UI
========================================== */

function refreshNotesUI() {

    sortNotes();

    saveNotes();

    renderNotes(searchInput.value);

    updateDashboardCount();

}
/* =====================================================
   NovaOS Lite
   notes.js
   Part 4
   Events + Initialization
===================================================== */

/* ==========================================
   Event Listeners
========================================== */

if (newNoteButton) {

    newNoteButton.addEventListener("click", createNote);

}

if (saveButton) {

    saveButton.addEventListener("click", saveCurrentNote);

}

if (deleteButton) {

    deleteButton.addEventListener("click", deleteCurrentNote);

}

if (pinButton) {

    pinButton.addEventListener("click", () => {

        togglePinNote();

        refreshNotesUI();

    });

}

if (searchInput) {

    searchInput.addEventListener("input", searchNotes);

}

/* Auto Save */

if (noteTitle) {

    noteTitle.addEventListener("input", autoSave);

}

if (noteContent) {

    noteContent.addEventListener("input", autoSave);

}

/* Ctrl + S */

document.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key.toLowerCase() === "s") {

        event.preventDefault();

        saveCurrentNote();

    }

});

/* ==========================================
   Initialization
========================================== */

loadNotes();

if (notes.length > 0) {

    sortNotes();

    renderNotes();

    openNote(notes[0].id);

} else {

    renderNotes();

}

updateDashboardCount();

console.log("✅ NovaOS Lite Notes Module Loaded");
document.querySelectorAll("[data-command]").forEach(button => {

    button.addEventListener("click", () => {

        document.getElementById("noteContent").focus();

        const command = button.dataset.command;
        const value = button.dataset.value || null;

        document.execCommand(command, false, value);

    });

});