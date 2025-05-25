import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();
const port = 5000;

const db = new pg.Pool({
  host: "dpg-d0pfv5uuk2gs739jkdfg-a.oregon-postgres.render.com",
  port: 5432,
  user: "todo_postgres_server_user",
  password: "CDFlEgf8Isr8vb23ql8lg4SvvZLmfkVc",
  database: "todo_postgres_server",
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());
// Assuming you have initialized pg client or pool as 'db'
// e.g. const { Pool } = require('pg');
// const db = new Pool({...});

app.get("/createtables", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS todo (
        id SERIAL PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        iscompleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT false,
        user_id INTEGER NOT NULL REFERENCES users(id),
        priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'low',
        sort_order INTEGER DEFAULT 0
      );
    `);

    res.send({ success: true, message: "Tables created successfully" });
  } catch (err) {
    console.error("Error creating tables:", err);
    res
      .status(500)
      .send({ error: "Failed to create tables", detail: err.message });
  }
});

app.post("/edittask", async (req, res) => {
  const { id, task } = req.body;
  try {
    await db.query("UPDATE todo SET task = $1 WHERE id = $2", [task, id]);
    res.send({ id, task, success: true });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).send(err.message);
  }
});

app.post("/gettodos/", async (req, res) => {
  const { id } = req.body;

  try {
    const queryText = `
      SELECT * FROM todo
      WHERE user_id = $1 AND is_deleted = false
      ORDER BY sort_order
    `;
    const { rows } = await db.query(queryText, [id]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).send(err.message);
  }
});

app.post("/addtodo", async (req, res) => {
  const { user_id, task, priority, sort_order } = req.body;
  try {
    await db.query(
      "INSERT INTO todo (task, user_id, priority, sort_order) VALUES ($1, $2, $3, $4)",
      [task, user_id, priority, sort_order]
    );

    const result = await db.query(
      "SELECT * FROM todo WHERE user_id = $1 ORDER BY sort_order",
      [user_id]
    );

    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/updatetask/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (typeof req.body.iscompleted === "boolean") {
      await db.query("UPDATE todo SET iscompleted = $1 WHERE id = $2", [
        req.body.iscompleted,
        id,
      ]);
      res.send({ id, iscompleted: req.body.iscompleted });
    } else if (req.body.priority) {
      await db.query("UPDATE todo SET priority = $1 WHERE id = $2", [
        req.body.priority,
        id,
      ]);
      res.send({ id, priority: req.body.priority });
    } else if (req.body.editedTask) {
      await db.query("UPDATE todo SET task = $1 WHERE id = $2", [
        req.body.editedTask,
        id,
      ]);
      res.send({ id, task: req.body.editedTask, success: true });
    } else {
      res.status(400).send("Invalid request body");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/updateorder", async (req, res) => {
  const { id, user_id, swap_sort_id, current_sort_id } = req.body;
  try {
    await db.query(
      "UPDATE todo SET sort_order = $1 WHERE sort_order = $2 AND user_id = $3",
      [current_sort_id, swap_sort_id, user_id]
    );

    await db.query(
      "UPDATE todo SET sort_order = $1 WHERE id = $2 AND user_id = $3",
      [swap_sort_id, id, user_id]
    );

    const result = await db.query(
      "SELECT * FROM todo WHERE user_id = $1 ORDER BY sort_order",
      [user_id]
    );

    res.send(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE todo SET is_deleted = TRUE WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/restore/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE todo SET is_deleted = FALSE WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    await db.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
      [username, password, role]
    );
    res.send({ status: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.send({ status: false });
    }

    if (result.rows.length === 1) {
      const user = result.rows[0];
      return res.send({
        status: true,
        id: user.id,
        username: user.username,
      });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).send("User not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
