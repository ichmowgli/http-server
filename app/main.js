const net = require("net");
// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const startLine = data.toString().split("\r\n")[0];
    const [, path] = startLine.split(" ");
    if (path === "/") {
      socket.end("HTTP/1.1 200 OK\r\n\r\n");
      return;
    }
    if (path.startsWith("/echo/")) {
      const string = path.split("/echo/")[1];
      socket.end(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${Buffer.byteLength(
          string,
          ["utf-8"]
        )}\r\n\r\n${string}\r\n\r\n`
      );
      return;
    }
    if (path.startsWith("/user-agent")) {
      const lines = data.toString().split("\r\n");
      const userAgentIndex = lines.findIndex((line) =>
        line.startsWith("User-Agent:")
      );
      const userAgent = lines[userAgentIndex].split(": ")[1];
      socket.end(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${Buffer.byteLength(
          userAgent,
          ["utf-8"]
        )}\r\n\r\n${userAgent}\r\n\r\n`
      );
      return;
    }

    socket.end("HTTP/1.1 404 Not Found\r\n\r\n");
  });
});
server.listen(4221, "localhost");
