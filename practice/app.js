// Week 3 Monday practice: paste each step from the slides below this line.
const helloButton = document.querySelector("#hello");
const message = document.querySelector("#message");

let count = 0;

helloButton.addEventListener("click", function () {
  count = count + 1;
  message.textContent = "You clicked " + count + " times!";
});

const list = document.querySelector("#list");

function addItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  list.append(li);
}

addItem("first item");
addItem("second item");
addItem("Crab Cakes");

const form = document.querySelector("#add-form");
const input = document.querySelector("#item");

function saveItem(text, whenSaved) {
    setTimeout(function () {
      whenSaved(text);
    }, 1500);
  }

form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (input.value === "") return;
  
    message.textContent = "Saving...";
    saveItem(input.value, function (savedText) {
      addItem(savedText);
      message.textContent = "Saved!";
    });
    input.value = "";
  });

// console.log("A");

// setTimeout(function () {
//   console.log("B");
// }, 2000);

// console.log("C");