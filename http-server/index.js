const http = require("http");
const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

const args = minimist(process.argv.slice(2));
const port = args.port || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const homePath = path.join(__dirname, "home.html");
    return fs.createReadStream(homePath).pipe(res);
  }

  if (req.url === "/projects") {
    const projectPath = path.join(__dirname, "project.html");
    return fs.createReadStream(projectPath).pipe(res);
  }

  if (req.url === "/registration") {
    const registrationPath = path.join(__dirname, "registration.html");
    return fs.createReadStream(registrationPath).pipe(res);
  }

  res.statusCode = 404;
  res.end("404 Not Found");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

