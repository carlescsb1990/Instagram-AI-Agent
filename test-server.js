const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Test server is working!" });
});

const server = app.listen(3000, () => {
  console.log("Test server is running on port 3000");
});
