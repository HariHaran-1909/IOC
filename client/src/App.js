import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch all projects
  const loadProjects = async () => {
    const res = await fetch("http://localhost:4000/projects");
    const data = await res.json();
    setProjects(data);
  };

  // Add project
  const addProject = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:4000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    loadProjects();
  };

  // Update project status
  const updateStatus = async (id) => {
    await fetch(`http://localhost:4000/projects/${id}`, {
      method: "PUT",
    });
    loadProjects();
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="container">
      <h1>Project Management Dashboard</h1>

      <form className="form" onSubmit={addProject}>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Project Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit">Add Project</button>
      </form>

      <div className="list">
        {projects.map((p) => (
          <div key={p.id} className="card">
            <h3>{p.title}</h3>
            <p>{p.description}</p>

            <span className={`status ${p.status.replace(" ", "-")}`}>
              {p.status}
            </span>

            <button onClick={() => updateStatus(p.id)}>
              Update Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;