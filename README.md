# Book Shop Website with Backend

This project is a simple HTML, CSS, JavaScript, and Node.js website for a book shop.

## Step 1: Open the Folder in VS Code

Open this folder in VS Code:

```text
C:\Users\user\Documents\Codex\2026-05-30\my-topic-is-book-shop-write\outputs
```

## Step 2: Check the Files

The website uses these main files:

- `index.html` creates the page structure.
- `styles.css` adds colors, layout, and responsive design.
- `script.js` connects the page to the backend.
- `server.js` runs the backend server.
- `data/books.json` stores the book list.
- `data/messages.json` stores contact form messages.
- `package.json` adds the `npm start` command.

## Step 3: Run the Backend

Open the VS Code terminal and run:

```bash
npm start
```

Then open this address in your browser:

```text
http://localhost:3000
```

## Step 4: Test the Backend

Try these links after the server is running:

```text
http://localhost:3000/api/books
```

The contact form saves messages into:

```text
data/messages.json
```

Each saved message includes the customer's name, contact number, message, and date.

## Step 5: Edit the Website

Try changing:

- The book names and prices in `data/books.json`.
- Prices use Indian currency, shown as `INR`.
- The colors in `styles.css`.
- The cart message in `script.js`.
