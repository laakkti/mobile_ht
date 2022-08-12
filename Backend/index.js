const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 8080;

const cors = require("cors");

//----------------------------------------------------------------

app.use(cors());

app.use(express.json());

app.use(express.static("build"));

//---------------------

app.get("/", (req, res) => {
  res.send("Backendin juuressa");
});

const WebSocket = require("ws");

const serverWs = new WebSocket.Server({ server });

let sockets = [];

const generateId = () => {
  const maxId = Math.max(...sockets.map((item) => item.id), 0);

  return maxId + 1;
};

const getSocketById = (id) => {
  return sockets.find((item) => item.id === id);
};

/*for(item in serverWs){

  console.log("serverWs= "+item);
}*/

serverWs.on("connection", function (socket) {
  socket.id = generateId();
  console.log("sockets ID= " + socket.id);
  sockets.push(socket);

  for (let ind = 0; ind < sockets.length; ind++) {
    console.log("sockets item id= " + sockets[ind].id);
  }

  //************ kutsuvalle reactille (joka lähettää emailia) lähetetään generoitu ID,
  // josta se tunnistetaan

  const message = JSON.stringify({ sender: "server", id: socket.id, time: Date.now() });
  console.log(message);
  socket.send(
    message
  );

  console.log(`connected client`);


  // tässä demossa vain mobiledevice lähettää dataa
  socket.on("message", function (msg) {
    console.log("msg=" + msg);

    try {
      let msgObj = JSON.parse(msg);
      console.log("msg.id= " + msgObj.id);
  
      if (msgObj.id > 0) {
        let socketById = getSocketById(msgObj.id);
        //socketById.send("##  ==> " + msgObj.time.toString());
        console.log("msg to send= " + msg);
        socketById.send(msg.toString());
      }
    } catch (err) {
      console.log("err= " + err);
    }
  });
  
  socket.on("close", function () {
    sockets = sockets.filter((s) => s.id !== socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const ip = require("ip");
console.log("ip.address= " + ip.address());
console.log("Listening on port ", serverWs.address().port);
