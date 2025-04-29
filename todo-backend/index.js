import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const port = 5000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "todo_app",
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todo", (err, results) => {
    if (err) {
      console.error("Error fetching todos:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post("/todos", (req, res) => {
  const { task } = req.body;
  db.query("INSERT INTO todo (task) VALUES (?)", [task], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ id: results.insertId, task, iscompleted: false });
  });
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { iscompleted } = req.body;
  db.query(
    "UPDATE todo SET iscompleted = ? WHERE id = ?",
    [iscompleted, id],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ id, iscompleted });
    }
  );
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM todo WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(204).send();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
