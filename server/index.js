const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "database.json");

// Helper: Read DB
function readDB() {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
}

// Helper: Write DB
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// GET all projects
app.get("/projects", (req, res) => {
  const db = readDB();
  res.json(db.projects);
});

// ADD new project
app.post("/projects", (req, res) => {
  const { title, description } = req.body;
  const db = readDB();

  const newProject = {
    id: db.projects.length + 1,
    title,
    description,
    status: "Pending"
  };

  db.projects.push(newProject);
  writeDB(db);

  res.json({ message: "Project added", project: newProject });
});

// UPDATE project status
app.put("/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();

  const project = db.projects.find((p) => p.id === id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const statusFlow = ["Pending", "In Progress", "Completed"];
  const currentIndex = statusFlow.indexOf(project.status);
  project.status = statusFlow[(currentIndex + 1) % statusFlow.length];

  writeDB(db);
  res.json({ message: "Status updated", project });
});

// Serve React build
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Server start
app.listen(4000, () => console.log("Server running on port 4000"));