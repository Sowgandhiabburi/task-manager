const express = require("express");
const cors = require("cors");   

const app = express();

app.use(cors());                
app.use(express.json());

// ✅ Test route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("Task Manager API is running 🚀");
});

// Example API route
app.get("/api/tasks", (req, res) => {
  res.json([
    { id: 1, task: "Learn Node.js" },
    { id: 2, task: "Build Task Manager" }
  ]);
});

// ✅ PORT (VERY IMPORTANT for Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});