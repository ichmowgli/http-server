const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("data", () => {
    const response = "HTTP/1.1 200 OK\r\n\r\n";

    socket.write(response);
  });
});

server.listen(4221, "localhost");
