let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let activeNoteId = null;

const notesList = document.getElementById("notes-list");
const addNoteBtn = document.getElementById("add-note");
const noteEditor = document.getElementById("note-editor");
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotesList() {
  notesList.innerHTML = "";
  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "note-item" + (note.id === activeNoteId ? " active" : "");
    div.textContent = note.title || "(No title)";
    
    // Adăugăm butonul de ștergere cu iconița de coș de gunoi
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "notes__delete-btn";
    deleteBtn.innerHTML = '<i class="bx bx-trash"></i>'; // Iconița de coș de gunoi Boxicons
    
    // Eveniment de click pentru a șterge notița
    deleteBtn.onclick = (event) => {
      event.stopPropagation(); // Previne selectarea notiței când dai click pe iconița de ștergere
      if (confirm("Are you sure you want to delete this note?")) {
        deleteNote(note.id);
      }
    };

    // Adăugăm butonul de ștergere în div-ul note-item
    div.appendChild(deleteBtn);
    
    // Eveniment pentru a selecta notița
    div.onclick = () => {
      setActiveNote(note.id);
    };

    notesList.appendChild(div);
  });
}

function setActiveNote(id) {
  activeNoteId = id;
  const note = notes.find(n => n.id === id);
  if (note) {
    noteTitle.value = note.title;
    noteBody.value = note.body;
    noteEditor.style.display = "flex";
    renderNotesList();
  }
}

function addNote() {
  const newNote = {
    id: Date.now(),
    title: "New Note",
    body: ""
  };
  notes.unshift(newNote);
  saveNotes();
  setActiveNote(newNote.id);
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  if (activeNoteId === id) {
    noteEditor.style.display = "none";
    activeNoteId = null;
  }
  saveNotes();
  renderNotesList();
}

noteTitle.addEventListener("input", () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.title = noteTitle.value;
    saveNotes();
    renderNotesList();
  }
});

noteBody.addEventListener("input", () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.body = noteBody.value;
    saveNotes();
  }
});

addNoteBtn.addEventListener("click", addNote);

// Inițializăm aplicația
renderNotesList();