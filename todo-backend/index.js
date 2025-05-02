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

app.use(cors());
app.use(express.json());

app.post("/gettodos", (req, res) => {
  const { id } = req.body;
  db.query(
    "SELECT * FROM todo where is_deleted is false and user_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching todos:", err);
        return res.status(500).send(err);
      }
      res.json(results);
    }
  );
});

app.post("/edittask", (req, res) => {
  const { id, task } = req.body;
  db.query(
    "UPDATE todo SET task = ? WHERE id = ?",
    [task, id],
    (err, results) => {
      if (err) {
        console.error("Error updating task:", err);
        return res.status(500).send(err);
      }
      res.send({ id, task, success: true });
    }
  );
});

app.post("/addtodo", (req, res) => {
  const { user_id, task, priority } = req.body;
  db.query(
    "INSERT INTO todo (task,user_id,priority) VALUES (?,?,?)",
    [task, user_id, priority],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      const insertId = results.insertId;
      db.query(
        "SELECT * FROM todo WHERE id = ?",
        [insertId],
        (err, results) => {
          if (err) {
            return res.send(err);
          }
          res.send(results[0]);
        }
      );
    }
  );
});

app.put("/updatetask/:id", (req, res) => {
  const { id } = req.params;
  if (req.body.iscompleted == false || req.body.iscompleted == true) {
    db.query(
      "UPDATE todo SET iscompleted = ? WHERE id = ?",
      [req.body.iscompleted, id],
      (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send({ id, iscompleted: req.body.iscompleted });
      }
    );
  } else if (req.body.priority) {
    db.query(
      "UPDATE todo SET priority = ? WHERE id = ?",
      [req.body.priority, id],
      (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send({ id, priority: req.body.priority });
      }
    );
  } else if (req.body.editedTask) {
    db.query(
      "UPDATE todo SET task = ? WHERE id = ?",
      [req.body.editedTask, id],
      (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send({ id, task: req.body.editedTask, success: true });
      }
    );
  } else {
    return res.status(400).send("Invalid request body");
  }
});

app.put("/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "update todo set is_deleted = 1 WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(204).send();
    }
  );
});

app.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  db.query(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, password, role],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ status: true });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.send({ status: false });
      }
      if (results.length === 1) {
        return res.send({
          status: true,
          id: results[0].id,
          username: results[0].username,
        });
      }
    }
  );
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get("/user/:id", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.status(404).send("User not found");
      }
      res.json(results[0]);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
