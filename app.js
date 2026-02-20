const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from DevOps CI/CD pipeline",
    environment: "UAT",
    status: "success"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
