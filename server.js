const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 In-memory storage (temporary)
let tasks = [
  { id: 1, task: "Learn Node.js" },
  { id: 2, task: "Build Task Manager" }
];

// ✅ Home route
app.get("/", (req, res) => {
  res.send("Task Manager API is running 🚀");
});

// ✅ GET all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// ✅ POST new task
app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    task: req.body.task
  };

  tasks.push(newTask);

  res.json({
    message: "Task added successfully",
    task: newTask
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});