let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch all toys and render them
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        console.log("Fetched Toys:", toys); // Debugging
        toyCollection.innerHTML = ""; // Clear previous entries
        toys.forEach(renderToy);
      })
      .catch((error) => console.error("Error fetching toys:", error));
  }

  // Create a toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;

    // Like button event
    card.querySelector(".like-btn").addEventListener("click", () => {
      likeToy(toy, card);
    });

    toyCollection.appendChild(card);
  }

  // Add new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        console.log("New toy added:", toy); // Debugging
        renderToy(toy);
        toyForm.reset();
      })
      .catch((error) => console.error("Error adding toy:", error));
  });

  // Update likes
  function likeToy(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        toy.likes = updatedToy.likes; // Update local object
      })
      .catch((error) => console.error("Error updating likes:", error));
  }

  // Initial Fetch
  fetchToys();
});
