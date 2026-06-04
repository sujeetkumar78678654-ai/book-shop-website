const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = 3000;
const publicDir = __dirname;
const dataDir = path.join(__dirname, "data");
const booksFile = path.join(dataDir, "books.json");
const messagesFile = path.join(dataDir, "messages.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

async function readJson(filePath, fallback) {
  try {
    const file = await fs.readFile(filePath, "utf8");
    return JSON.parse(file);
  } catch {
    return fallback;
  }
}

async function getRequestBody(request) {
  let body = "";

  for await (const chunk of request) {
    body += chunk;
  }

  return body ? JSON.parse(body) : {};
}

async function handleApi(request, response) {
  if (request.method === "GET" && request.url === "/api/books") {
    const books = await readJson(booksFile, []);
    sendJson(response, 200, books);
    return true;
  }

  if (request.method === "POST" && request.url === "/api/contact") {
    try {
      const body = await getRequestBody(request);
      const name = String(body.name || "").trim();
      const phone = String(body.phone || "").trim();
      const message = String(body.message || "").trim();

      if (!name || !phone || !message) {
        sendJson(response, 400, { error: "Name, contact number, and message are required." });
        return true;
      }

      const messages = await readJson(messagesFile, []);
      messages.push({
        id: Date.now(),
        name,
        phone,
        message,
        createdAt: new Date().toISOString(),
      });

      await fs.writeFile(messagesFile, JSON.stringify(messages, null, 2));
      sendJson(response, 201, { message: "Thank you! Your message was saved." });
    } catch {
      sendJson(response, 400, { error: "Invalid message data." });
    }

    return true;
  }

  if (request.url.startsWith("/api/")) {
    sendJson(response, 404, { error: "API route not found." });
    return true;
  }

  return false;
}

async function serveStaticFile(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.resolve(publicDir, `.${decodeURIComponent(requestedPath)}`);
  const safePublicDir = publicDir.endsWith(path.sep) ? publicDir : `${publicDir}${path.sep}`;

  if (filePath !== publicDir && !filePath.startsWith(safePublicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Page not found");
  }
}

const server = http.createServer(async (request, response) => {
  const apiHandled = await handleApi(request, response);

  if (!apiHandled) {
    await serveStaticFile(request, response);
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Book shop backend running at http://localhost:${PORT}`);
  });
}

module.exports = server;
