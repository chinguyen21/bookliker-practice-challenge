document.addEventListener("DOMContentLoaded", function() {
  getBookTitle();
});

listBooks = []
const getBookTitle = () => {
  fetch("http://localhost:3000/books")
  .then(res => res.json())
  .then(books => books.forEach(book => {
    listBooks.push(book)
    renderBook(book)
  }))
}


const renderBook = (book) => {
  let ul = document.querySelector('#list');

  let li = document.createElement('li');
  li.innerText = book.title;
  li.addEventListener('click', () => showBook(book))

  ul.appendChild(li);

}

const showBook = (book) => {
  let div = document.querySelector('#show-panel')
  div.innerHTML = ""

  let img = document.createElement('img')
  img.src = book.img_url

  let h4 = document.createElement('h4')
  h4.innerText = book.title
  
  let h4_1 = document.createElement('h4')
  h4_1.innerText = book.subtitle
  
  let h4_2 = document.createElement('h4')
  h4_2.innerText = book.author

  let p = document.createElement('p')
  p.innerText = book.description

  let ul = document.createElement('ul')

  book.users.forEach(user => {
    let li = document.createElement('li')
    li.innerText = user.username
    ul.appendChild(li)
  })

  button = document.createElement('button')
  button.innerText = book.users.some(user=>user.id === 1) ? "Unlike" : "Like"
  button.addEventListener('click', () => updateLikes(book, button))

  button1 = document.createElement('button')
  button1.innerText = "Delete"
  button1.addEventListener('click', () => delete_book(book))

  div.append(img, h4, h4_1, h4_2, p, ul,button, button1)

}


const updateLikes = (book, button) => {
  if (button.innerText === "Like") {
    button.innerText = "Unlike"
    const a = book.users.push({id: 1, username: "pouros"})
    reqPackage = {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      users: book.users
      })
    }

  fetch(`http://localhost:3000/books/${book.id}`, reqPackage)
  .then(res => res.json())
  .then(showBook)
  
  } else {
    button.innerText = "Unlike"
    
    reqPackage = {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      users: book.users.filter(user => user.id != 1)
      })
    }

    fetch(`http://localhost:3000/books/${book.id}`, reqPackage)
    .then(res => res.json())
    .then(showBook)
  }
  
}


const delete_book = (book) => {
    
  fetch(`http://localhost:3000/books/${book.id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
      document.querySelector('#list').innerHTML = "";
      document.querySelector('#show-panel').innerHTML = "";
      listBooks = listBooks.filter(b => b.id != book.id)
      listBooks.forEach(renderBook)
    })
    
}