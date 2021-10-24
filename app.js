let saveBtn
let properties = ["text", "date", "time"]
let boxContainer
let noteCounter = 1
let errorMsg
let textInput

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        onInit()
    }
}

function onInit() {
    saveBtn = document.querySelector('#addNote')
    saveBtn.addEventListener('click', saveNote)
    textInput = document.querySelector('#text')
    textInput.addEventListener('keydown', prevDefForEnterOnInput)
    boxContainer = document.querySelector('.box-container')
    errorMsg = document.querySelector('#error-msg')

    startUpPageWithAllNotes()
}

function startUpPageWithAllNotes() {
    let notes = getNotesFromLocalStorage()
    for (let note of notes) {
        addNoteToBox(note)
    }
}


function prevDefForEnterOnInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
    }
}

function saveNote() {
    if (!isValidated()) return
    let note = createNote()
        //add notes to note array
    addNotesToListInLocalStorage(note)
        //add note to box
    addNoteToBox(note)
    form.reset()
}

function createNote() {
    let note = {}
    let countId = noteCounter++
        note.id = countId.toString()
    for (let prop of properties) {
        note[prop] = form[prop].value
    }
    return note
}

function addNotesToListInLocalStorage(note) {
    let noteList = getNotesFromLocalStorage()
    noteList.push(note)
    setNotesToLocalStorage('notes', noteList)
}

function addNoteToBox(note) {
    let noteBox = createBox(note)
    boxContainer.append(noteBox)
}

function createBox(note) {
    //create the noteBox
    let noteBox = document.createElement('div')
    noteBox.classList.add('note-box')
    noteBox.addEventListener('mouseenter', showDeleteBtn)
    noteBox.addEventListener('mouseleave', hideDeleteBtn)
    noteBox.id = note.id

    // first item in note: 
    let noteDeleteItem = document.createElement('div')
    noteDeleteItem.classList.add('note-item')

    //create button child of noteItem
    let deleteBtn = document.createElement('button')
    deleteBtn.type = 'button'
    deleteBtn.classList.add('change-btn-style')

    //add bootstrap - trash glyphicon
    let spanBootstrap = document.createElement('span')
    spanBootstrap.classList.add('glyphicon', 'glyphicon-trash', 'hide')
    spanBootstrap.addEventListener('click', eraseNote.bind(noteBox, noteBox.id))
    deleteBtn.append(spanBootstrap)
        //append the delete btn to noteDeleteItem
    noteDeleteItem.append(deleteBtn)

    // second item in note: 
    let noteTextItem = document.createElement('div')
    noteTextItem.classList.add('note-item', 'note-content')
    noteTextItem.innerHTML = note.text

    // third item in note: 
    let noteDateItem = document.createElement('div')
    noteDateItem.classList.add('note-item')
    noteDateItem.innerHTML = note.date

    // fourth item in note: 
    let noteTimeItem = document.createElement('div')
    noteTimeItem.classList.add('note-item')
    noteTimeItem.innerHTML = note.time

    //Append all to noteBox
    noteBox.append(noteDeleteItem, noteTextItem, noteDateItem, noteTimeItem)
    return noteBox
}

function eraseNote(id) {
    this.remove()
    let noteList = getNotesFromLocalStorage()
    noteList = noteList.filter(note => note.id !== id)
    setNotesToLocalStorage('notes', noteList)
}

function showDeleteBtn() {
    this.firstElementChild.firstElementChild.firstElementChild.classList.remove('hide')
    this.firstElementChild.firstElementChild.firstElementChild.classList.add('show')
}

function hideDeleteBtn() {
    this.firstElementChild.firstElementChild.firstElementChild.classList.remove('show')
    this.firstElementChild.firstElementChild.firstElementChild.classList.add('hide')
}

// utliity functions: 
function setNotesToLocalStorage(notes, val) {
    localStorage.setItem(notes, JSON.stringify(val))
}

function getNotesFromLocalStorage() {
    let notes
    let notesStringifeid = localStorage.getItem('notes')
    if (notesStringifeid) {
        notes = JSON.parse(notesStringifeid)
    } else {
        notes = []
    }
    return notes
}

//Validation
function isValidated() {
    areNotEmpty = areAllFieldsFilled()
    return areNotEmpty
}

function areAllFieldsFilled() {
    errorMsg.innerHTML = ''
    for (let prop of properties) {
        if (form[prop].value === '') {
            errorMsg.innerHTML += '*Please fill out all fields in the form <br>'
            return false
        }
    }
    return true
}