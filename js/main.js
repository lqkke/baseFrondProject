const MOCK_NOTES = [
    {
    id: 1,
    title: 'Работа с формами',
    content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
    color: 'green',
    isFavorite: false,
},
  // ...
]

const model = {
  notes: [],
  addNotes(title,description, color) {
    const id = Math.random()
    const isFavorite = false
    const newNote = {id, title, description, color, isFavorite}
    this.notes.unshift(newNote)
    view.renderNotes(this.notes)
  },

  toggleFavorite(noteId) {
    const note = this.notes.find((note) => note.id === noteId)

    if(note) {
      note.isFavorite = !note.isFavorite
      view.renderNotes(this.notes)
    }

  },
  
  deleteNote(noteId) {
    this.notes = this.notes.filter((note) => note.id !== noteId)
    view.renderNotes(this.notes)
},

  showOnlyFavorite() {
    const favoriteNotes = this.notes.filter((note) => note.isFavorite === true)
    view.renderNotes(favoriteNotes)
  },

  showAllNotes() {
    view.renderNotes(this.notes)
  }

}

const view = {
  init() {
    this.renderNotes(model.notes)

    const form = document.querySelector('.note-form')
    const inputTitle = document.querySelector('.title')
    const inputDescription = document.querySelector('.description')
    const radioButtons = document.querySelectorAll('.radio')


    form.addEventListener('submit', function(event) {
      event.preventDefault()
      const title = inputTitle.value
      const description = inputDescription.value
      const selectedRadio = [...radioButtons].find(radio => radio.checked)
      const color = selectedRadio.value
      //controller.addNotes(title, description)
      if(title.trim() !== '' && description.trim() !== '') {
        controller.addNotes(title, description, color)
        inputTitle.value = ''
        inputDescription.value = ''
        view.displayMessage(`Заметка добавлена!`)
        } else if(title.length > 50) {
          view.displayMessage(`Максимальная длина заголовка - 50 символов`, true)
        } else {
          view.displayMessage(`Заполните все поля`, true)
        }
      
      //inputTitle.value = ''
      //inputDescription.value = ''
    })

    const list = document.querySelector('.notes-list')

    list.addEventListener('click', function(event) {
      const button = event.target.closest('button')
      if (button) {
        const noteElement = button.closest('.note')
        const noteId = +noteElement.id

        if (button.classList.contains('delete-button')) {
          controller.deleteNote(noteId)
        } else if (button.classList.contains('favorite-button')) {
          controller.toggleFavorite(noteId)
        }
      }
    })

    const filterBox = document.querySelector('.filter-box');

    filterBox.addEventListener('change', function(event) {
      const checkbox = event.target
      if (checkbox.checked) {
        controller.showOnlyFavorite()
      } else {
        controller.showAllNotes()
      }
    });
  },

  renderNotes(notes) {
    const list = document.querySelector('.notes-list')
    const counter = document.querySelector('.notes-count-span')

    let notesHTML = ''

    for (const note of notes) {
      const favoriteImg = note.isFavorite ? "images/icons/heart-active.png" : "images/icons/heart-inactive.png";
      notesHTML += `
      <li id="${note.id}" class="note">
          <div class="title-container ${note.color}">
            <b class="note-title">${note.title}</b>
            <div>
            <button class="favorite-button" type="button"><img src="${favoriteImg}" alt="Избранное"></button>
            <button class="delete-button" type="button"><img src="images/icons/trash.png" alt="Удалить"></button>
            </div>
          </div>
          <p class="note-description">${note.description}</p>
        </li>
      `
    }

    list.innerHTML = notesHTML

    const filterBox = document.querySelector('.filter-box')
    const checkbox = document.querySelector('#checkbox')

    const messagesBox = document.querySelector('.messages-box')

    if(notes.length !== 0) {
      filterBox.innerHTML = `<div class="checkbox-container">
                              <input type="checkbox" id="checkbox">
                              <label for="checkbox">Показать только избранные заметки</label>
                              </div>`
      messagesBox.innerHTML = ``
    } else {
      filterBox.innerHTML = ``
      messagesBox.innerHTML = `<span class="add-notes-span"><br>У вас ещё нет ни одной заметки.<br>Заполните поля выше и создайте свою первую заметку!</br></b></span>`
    }

    if(checkbox) {
      checkbox.checked = notes.length !== model.notes.length
    }

    const notesCounter = notes.length
    if (notesCounter === 0) {
      counter.textContent = `У вас ещё нет ни одной заметки.`;
    } else {
      counter.innerHTML = `Всего заметок: <b>${notesCounter}</b>`;
    }
  },

  displayMessage(message, isError = false) {
    const messagesBox = document.querySelector('.messages-box')
    messagesBox.innerHTML = ``
    
    const text = document.createElement('span')
    text.textContent = message
    img = document.createElement('img')

    if (isError) {
      img.src = 'images/icons/error.png'
      messagesBox.classList.remove('success')
      messagesBox.classList.add('error')
    } else {
      img.src = 'images/icons/done.png'
      messagesBox.classList.remove('error')
      messagesBox.classList.add('success')
      setTimeout(() => {
        messagesBox.classList.remove('success')
        messagesBox.innerHTML = ''
      }, 3000)
    }

    messagesBox.appendChild(img)
    messagesBox.appendChild(text)
  },

}

const controller = {
  addNotes(title, description, color) {
    model.addNotes(title, description, color)
  },

  toggleFavorite(noteId) {
    model.toggleFavorite(noteId)
  },

  deleteNote(noteId) {
    model.deleteNote(noteId)
  },

  showOnlyFavorite() {
    model.showOnlyFavorite()
  },

  showAllNotes() {
    model.showAllNotes()
  }
}



function init() {
  view.init()
}

document.addEventListener('DOMContentLoaded', init)