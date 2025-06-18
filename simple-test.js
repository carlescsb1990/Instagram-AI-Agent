const express = require("express");
const app = express();

console.log("Starting simple test...");

app.get("/", (req, res) => {
  res.json({ message: "Test is working!" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
