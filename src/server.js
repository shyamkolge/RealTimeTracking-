import app from "./app.js";
import { Server } from "socket.io";
import { createServer } from "http";

const server = createServer(app);
const io = new Server(server);

io.on("connection", function (socket) {
  socket.on("send-location", function (data) {
    io.emit("live-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    io.emit("user-disconnect", { id: socket.id });
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server is listing at 3000");
});
