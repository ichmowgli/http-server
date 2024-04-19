const net = require("net");
const nodePath = require("node:path");
const fs = require("node:fs");

const { argv } = require("node:process");
const HTTPVersion = "HTTP/1.1";
const CRLF = "\r\n";
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString().split(CRLF);
    const [, path] = request[0].split(" ");
    if (path === "/") {
      socket.write(`${HTTPVersion} 200 OK${CRLF + CRLF}`);
    } else if (path.startsWith("/echo/")) {
      const string = path.split("/echo/")[1];
      socket.write(
        `${HTTPVersion} 200 OK${CRLF}Content-Type: text/plain${CRLF}Content-Length: ${Buffer.byteLength(
          string,
          "utf-8"
        )}${CRLF + CRLF}${string}`
      );
    } else if (path === "/user-agent") {
      const [, userAgent] = request[2].split(" ");
      socket.write(
        `${HTTPVersion} 200 OK${CRLF}Content-Type: text/plain${CRLF}Content-Length: ${Buffer.byteLength(
          userAgent,
          "utf-8"
        )}${CRLF + CRLF}${userAgent}`
      );
    } else if (path.startsWith("/files/")) {
      const fileName = path.split("/files/")[1];
      const directoryIndex = argv.findIndex((value) => value === "--directory");
      const directory = argv[directoryIndex + 1];
      const filePath = nodePath.join(directory, fileName);
      const fileExists = fs.existsSync(filePath);
      if (fileExists) {
        const body = fs.readFileSync(filePath, { encoding: "utf-8" });
        socket.write(
          `${HTTPVersion} 200 OK${CRLF}Content-Type: application/octet-stream${CRLF}Content-Length: ${Buffer.byteLength(
            body,
            "utf-8"
          )}${CRLF + CRLF}${body}`
        );
      } else {
        socket.write(`${HTTPVersion} 404 Not Found${CRLF + CRLF}`);
      }
    } else {
      socket.write(`${HTTPVersion} 404 Not Found${CRLF + CRLF}`);
    }
    socket.end();
  });
  socket.on("close", () => {
    socket.end();
  });
});
server.listen(4221, "localhost");
