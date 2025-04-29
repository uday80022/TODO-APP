import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "../styles/taskpage.css";

const TaskPage = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  const fetchTodos = async () => {
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

  const startEditing = (id, task) => {
    setEditingId(id);
    setEditedTask(task);
  };

  const saveEditedTask = async (id) => {
    try {
      const response = await axios.post("http://localhost:5000/edittask", {
        id,
        task: editedTask,
      });
      if (response.data.success) {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, task: editedTask } : todo
          )
        );
        setEditingId(null);
        setEditedTask("");
      }
    } catch (error) {
      console.error("Error saving edited task:", error);
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
    <div className="todo-container">
      <h1 className="todo-title">To-Do List</h1>
      <div className="add-task">
        <button className="add-task-button" onClick={addTodo}>
          <FaPlus /> Add Task
        </button>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Type a new task..."
          className="task-input"
        />
      </div>
      <ul className="task-list">
        {todos.map((todo) => (
          <li key={todo.id} className="task-item">
            <input
              type="checkbox"
              checked={todo.iscompleted}
              onChange={() => toggleTodo(todo.id, todo.iscompleted)}
              className="task-checkbox"
            />
            {editingId === todo.id ? (
              <input
                className="task-input"
                value={editedTask}
                autoFocus
                onChange={(e) => setEditedTask(e.target.value)}
                onBlur={() => saveEditedTask(todo.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEditedTask(todo.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
            ) : (
              <span
                className={`task-text ${todo.iscompleted ? "completed" : ""}`}
              >
                {todo.task}
              </span>
            )}
            <div className="task-actions">
              <FaPencilAlt
                className="task-icon edit-icon"
                onClick={() => startEditing(todo.id, todo.task)}
              />
              <FaTrashAlt
                className="task-icon delete-icon"
                onClick={() => deleteTodo(todo.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPage;
