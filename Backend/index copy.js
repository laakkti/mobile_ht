//import { WebSocketServer } from "ws";

const ws = require("ws");

const socketServer = new ws.WebSocketServer({ port: 5000 });

socketServer.on("connection", (socket) => {
  // send a message to the client
  socket.send(JSON.stringify({
    type: "hello from server",
    content: [ 1, "2" ]
  }));

  // receive a message from the client
  socket.on("message", (data) => {
    const packet = JSON.parse(data);

    switch (packet.type) {
      case "hello from client":
        // ...
        break;
    }
  });
});

const express = require("express");
const app = express();
const server = require("http").createServer(app);;

const io = require("socket.io")(server);
const port=3000;


app.get("/", (req, res) => {
  console.log("<h1>Hello World!</h1>");  
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/heippa", (req, res) => {
  console.log("<h1>HEIPPA</h1>");
  res.send("<h1>HEIPPA</h1>");  
  //res.json(notes);
});


io.on("connection", (socket) => {
  console.log("Connection");  
  //app.socket = socket;
  // socket on clientin socket, johin vastataan emitillä
  //socket.emit("connected", socket.id);

  //socket.on("disconnect", () => console.log("Client disconnected"));

  socket.on("message", ({ message, sid, time, rid }) => {
    console.log(message, sid, time, rid);
    io.emit("message", { message, sid, time, rid });
  });

  
});

//----------------------------------------------------------------


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
