const express = require("express");
const machineRoutes = require("./routes/machineRoutes.js");

// Create an Application
const app = express();
const port = process.env.PORT || 3000;

// Express Middleware
// Make sure request body is parsed to JSON
app.use(express.json());

// Let the app listen to PORT 3000
app.listen(port, (err) => {
  if (!err) {
    console.log(`🚀 Server is listening on port ${port}...`);
  } else {
    console.log("Error occured, server can't start", err);
  }
});

// Machine Routes
app.use("/api/machines", machineRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to my custom API!");
});
