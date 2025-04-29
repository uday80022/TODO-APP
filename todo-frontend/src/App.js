import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const fetchTodos = async () => {
    console.log("Fetching todos...");
    try {
      const response = await axios.get("http://localhost:5000/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    console.log("Adding todo:", task);
    if (!task) return;
    try {
      const response = await axios.post("http://localhost:5000/todos", {
        task,
      });
      setTodos([...todos, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id, iscompleted) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, {
        iscompleted: !iscompleted,
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, iscompleted: !iscompleted } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  return (
    <div className="App">
      <h1>Todo App</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTodo();
          }
        }}
        placeholder="Add a new task"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.iscompleted}
              onChange={() => toggleTodo(todo.id, todo.iscompleted)}
            />
            {todo.task}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
