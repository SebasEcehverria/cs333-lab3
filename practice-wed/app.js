// Week 3 Wednesday practice. Monday's addItem is here already; paste each step from the slides below it.
const list = document.querySelector("#list");
const message = document.querySelector("#message");

function addItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  list.append(li);
}

const form = document.querySelector("#search-form");
const input = document.querySelector("#query");

async function getBooks(query) {
  const url = "https://openlibrary.org/search.json?limit=10&q=" + encodeURIComponent(query);
  console.log("fetching", url);

  const response = await fetch(url);
  const data = await response.json();

  list.textContent = "";
  data.docs.forEach(function (book) {
    addItem(book.title);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  getBooks(input.value);
});