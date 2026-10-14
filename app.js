// Part 1: a pretend library. In Part 2 you replace fakeSearch with a real search using fetch.
const FAKE_BOOKS = [
  { key: "/works/OL893414W", title: "Dune", author_name: ["Frank Herbert"], first_publish_year: 1965 },
  { key: "/works/OL35623W", title: "Parable of the Sower", author_name: ["Octavia E. Butler"], first_publish_year: 1993 },
  { key: "/works/OL35616W", title: "Kindred", author_name: ["Octavia E. Butler"], first_publish_year: 1979 },
  { key: "/works/OL66554W", title: "Pride and Prejudice", author_name: ["Jane Austen"], first_publish_year: 1813 },
  { key: "/works/OL27513W", title: "The Fellowship of the Ring", author_name: ["J.R.R. Tolkien"], first_publish_year: 1954 },
  { key: "/works/OL1168083W", title: "Nineteen Eighty-Four", author_name: ["George Orwell"], first_publish_year: 1949 },
];

// Pretends to be a slow website: after one second it calls whenDone with the books that match.
function fakeSearch(query, whenDone) {
  setTimeout(() => {
    const q = query.toLowerCase();
    const matches = FAKE_BOOKS.filter(
      (book) =>
        book.title.toLowerCase().includes(q) ||
        book.author_name.some((name) => name.toLowerCase().includes(q))
    );
    whenDone(matches);
  }, 1000);
}

// Your code starts here.
// Find the form, input, status message, and list on the page.
const form = document.querySelector("#search-form");
const input = document.querySelector("#query");
const statusMessage = document.querySelector("#status");
const results = document.querySelector("#results");
console.log(form, input, statusMessage, results);

const readingListElement = document.querySelector("#reading-list");
// Restore the saved JSON as an array, or start empty if nothing has been saved.
const readingList = JSON.parse(localStorage.getItem("readingList")) || [];

function renderReadingList() {
  readingListElement.textContent = "";
  readingList.forEach(function (book, index) {
    const li = document.createElement("li");
    li.textContent = book.title + " ";
    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.addEventListener("click", function () {
      console.log("remove", book.title);
      // Remove one book at this position, then redraw to update the indexes.
      readingList.splice(index, 1);
      renderReadingList();
    });
    li.append(remove);
    readingListElement.append(li);
  });
  // Save after every redraw so both Save and Remove update browser storage.
  localStorage.setItem("readingList", JSON.stringify(readingList));
}

function renderResults(books) {
  // Clear the previous results before drawing the new books.
  results.textContent = "";
  books.forEach(function (book) {
    const li = document.createElement("li");
    // Real catalogue entries may have no author or publication year.
    let author = "Unknown author";
    if (book.author_name && book.author_name.length > 0) {
      author = book.author_name[0];
    }
    let year = "";
    if (book.first_publish_year) {
      year = " (" + book.first_publish_year + ")";
    }
    li.textContent = book.title + " — " + author + year;

    // Only add a cover when the catalogue provides its image ID.
    if (book.cover_i) {
      const img = document.createElement("img");
      img.src = "https://covers.openlibrary.org/b/id/" + book.cover_i + "-S.jpg";
      img.alt = "Cover of " + book.title;
      li.append(img);
    }

    const save = document.createElement("button");
    save.textContent = "Save";
    // This callback remembers the book from this loop iteration.
    save.addEventListener("click", function () {
      console.log("save", book.title);
      // includes checks the same object, so this prevents repeated saves from this result.
      if (readingList.includes(book)) return;
      readingList.push(book);
      renderReadingList();
    });
    li.append(save);
    results.append(li);
  });
}

// Return the books so the submit listener can decide how to display them.
async function searchBooks(query) {
  const params = new URLSearchParams({
    q: query.trim(),
    limit: "10",
    fields: "key,title,author_name,first_publish_year,cover_i"
  });

  const url = "https://openlibrary.org/search.json?" + params;

  console.log("fetching", url);

  const response = await fetch(url);

  if (!response.ok) {
    const details = await response.text();
    console.error("Open Library response:", response.status, details);
    throw new Error("Library request failed: " + response.status);
  }

  const data = await response.json();
  return data.docs || [];
}

form.addEventListener("submit", async function (event) {
  // Keep the page from reloading when the form is submitted.
  event.preventDefault();
  const query = input.value.trim();

  if (query.length < 3) {
    statusMessage.textContent = "Please enter at least 3 characters to search.";
    results.textContent = "";
    return;
  }

  console.log("searching for", query);
  statusMessage.textContent = "Searching...";

  // await pauses this listener until the books arrive; catch handles a failed request.
  try {
    const books = await searchBooks(query);
    console.log("got", books);
    statusMessage.textContent = "";
    renderResults(books);
    if (books.length === 0) {
      statusMessage.textContent = "No books found";
    }
  } catch (error) {
    console.log("something went wrong:", error);
    statusMessage.textContent = "Couldn't reach the library. Check your connection.";
  }
});

// Display the saved books as soon as the page loads.
renderReadingList();
