const cartCount = document.querySelector("#cartCount");
const categoryFilter = document.querySelector("#categoryFilter");
const bookGrid = document.querySelector("#bookGrid");
const contactForm = document.querySelector(".contact-form");

let cartItems = 0;

function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function createBookCard(book) {
  return `
    <article class="book-card" data-category="${book.category}">
      <img src="${book.image}" alt="${book.alt}">
      <div class="book-info">
        <p class="book-category">${formatCategory(book.category)}</p>
        <h3>${book.title}</h3>
        <p>${book.description}</p>
        <div class="book-footer">
          <span>INR ${book.price.toFixed(2)}</span>
          <button class="add-cart" type="button">Add</button>
        </div>
      </div>
    </article>
  `;
}

function setupCartButtons() {
  const addButtons = document.querySelectorAll(".add-cart");

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cartItems += 1;
      cartCount.textContent = cartItems;
      button.textContent = "Added";

      setTimeout(() => {
        button.textContent = "Add";
      }, 900);
    });
  });
}

function filterBooks() {
  const selectedCategory = categoryFilter.value;
  const bookCards = document.querySelectorAll(".book-card");

  bookCards.forEach((card) => {
    const matchesCategory =
      selectedCategory === "all" || card.dataset.category === selectedCategory;

    card.hidden = !matchesCategory;
  });
}

async function loadBooksFromBackend() {
  try {
    const response = await fetch("/api/books");

    if (!response.ok) {
      throw new Error("Books could not be loaded.");
    }

    const books = await response.json();
    bookGrid.innerHTML = books.map(createBookCard).join("");
  } catch {
    console.log("Using books already written in the HTML.");
  } finally {
    setupCartButtons();
    filterBooks();
  }
}

categoryFilter.addEventListener("change", filterBooks);

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const messageData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  };

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    alert(result.message);
    contactForm.reset();
  } catch {
    alert("Thank you! The book shop will reply soon.");
    contactForm.reset();
  }
});

loadBooksFromBackend();
