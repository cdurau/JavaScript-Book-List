const addForm = document.querySelector('#add-book-form')
const inTitle = document.querySelector('#title')
const inAuthor = document.querySelector('#author')
const inISBN = document.querySelector('#isbn')
const bookList = document.querySelector('#book-list')

class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }

  addBook() {
    const ui = new UI()

    ui.addBook(this)
    Store.addBook(this)

    ui.showAlert('success', 'Book Added')
  }

  static removeBook(target) {
    const ui = new UI()
    const isbn = target.querySelector('.book-isbn').textContent

    ui.removeBook(target)
    Store.removeBook(isbn)

    ui.showAlert('danger', 'Book Removed')
  }
}

class UI {
  clearInputFields() {
    inTitle.value = inAuthor.value = inISBN.value = ''
  }

  showAlert(className, message) {
    if (!document.querySelector('.alert')) {
      const cardBody = document.querySelector('.card-body')

      const alertBox = document.createElement('div')

      alertBox.className = `alert alert-${className}`
      alertBox.appendChild(document.createTextNode(message))

      cardBody.insertBefore(alertBox, addForm)
      setTimeout(function () {
        alertBox.remove()
      }, 3000)
    }
  }

  displayBooks() {
    const books = Store.getBooks()
    const ui = new UI()

    books.forEach(function (book) {
      ui.addBook(book)
    })
  }

  addBook(book) {
    // Create Elements
    const tr = document.createElement('tr')
    const tdTitle = document.createElement('td')
    const tdAuthor = document.createElement('td')
    const tdISBN = document.createElement('td')
    const tdRemove = document.createElement('td')

    tr.className = 'text-center'

    tdTitle.textContent = book.title
    tdTitle.className = 'book-title'

    tdAuthor.textContent = book.author
    tdAuthor.className = 'book-author'

    tdISBN.textContent = book.isbn
    tdISBN.className = 'book-isbn'

    tdRemove.innerHTML = '<a href="#" class="oi oi-x text-danger small remove-item"></a>'

    // Add Cells to Table Row
    tr.appendChild(tdTitle)
    tr.appendChild(tdAuthor)
    tr.appendChild(tdISBN)
    tr.appendChild(tdRemove)

    // Append Book to List
    bookList.appendChild(tr)
  }

  removeBook(target) {
    target.remove()
  }
}

class Store {
  static getBooks() {
    return localStorage.getItem('books') !== null ? JSON.parse(localStorage.getItem('books')) : []
  }

  static saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books))
  }

  static addBook(book) {
    const books = Store.getBooks()

    books.push(book)
    Store.saveBooks(books)
  }

  static removeBook(isbn) {
    const books = Store.getBooks()

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1)
      }
    })

    Store.saveBooks(books)
  }
}

// Event Listeners
// Show Books on Start
document.addEventListener('DOMContentLoaded', function () {
  const ui = new UI()

  ui.displayBooks()
})

// Add Book
addForm.addEventListener('submit', function (e) {
  e.preventDefault()

  const ui = new UI()
  const title = inTitle.value
  const author = inAuthor.value
  const isbn = inISBN.value

  if (title !== '' && author !== '' && isbn !== '') {
    const book = new Book(title, author, isbn)

    book.addBook()
    ui.clearInputFields()
  } else {
    ui.showAlert('danger', 'No Empty Input Fields Allowed')
  }
})

// Remove Book
bookList.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove-item')) {
    e.preventDefault()

    Book.removeBook(e.target.parentElement.parentElement)
  }
})
