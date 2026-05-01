require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

/* ================== DATABASE ================== */
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* ================== TASK SCHEMA ================== */
const TaskSchema = new mongoose.Schema({
  title: String,
  status: String
});

const Task = mongoose.model("Task", TaskSchema);

/* ================== USER SCHEMA ================== */
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String // admin or member
});

const User = mongoose.model("User", UserSchema);

/* ================== AUTH MIDDLEWARE ================== */
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch {
    res.json({ message: "Invalid token" });
  }
};

/* ================== TASK APIs ================== */

// create task (ONLY ADMIN)
app.post("/task", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.json({ message: "Only admin allowed" });
  }

  const newTask = new Task(req.body);
  await newTask.save();

  res.json(newTask);
});

// get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

/* ================== AUTH APIs ================== */

// signup
app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    role
  });

  await user.save();

  res.json({ message: "User created" });
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "secret"
  );

  res.json({
    message: "Login successful",
    token
  });
});

/* ================== SERVER ================== */
app.listen(3000, () => {
  console.log("Server started on port 3000");
});