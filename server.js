const server = require("http").createServer();
const io = require("socket.io")(server, {
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader);
  },
});
const cors = require("cors");
const PORT = process.env.PORT || 3000;
server.listen(PORT);

console.log(`listening on port ${PORT}`);
let readyPlayedrCount = 0;
io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("ready", () => {
    console.log("Player Ready", socket.id);

    readyPlayedrCount++;

    if (readyPlayedrCount % 2 == 0) {
      io.emit("startGame", socket.id);
    }
  });

  socket.on("paddleMove", (paddleData) => {
    socket.broadcast.emit("paddleMove", paddleData);
  });

  socket.on("ballMove", (ballData) => {
    socket.broadcast.emit("ballMove", ballData);
  });
  socket.on("disconnect", (reason) => {
    console.log(`Client ${socket.id} disconnected. Reason: ${reason}.`);
  });
});
