import express from "express";
import log from "./log";
import expressWs from "express-ws";

const app = express();
expressWs(app);

app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.ws("/client/ws", function (ws, req) {
  ws.on("message", function (msg) {
    console.log(msg);
  });
  console.log("socket", req.testing);
});

app.listen(3000, () => {
  log({ msg: "listening", port: 3000 });
});
