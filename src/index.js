import express from "express";
import log from "./log";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  log({ msg: "listening", port: 3000 });
});
