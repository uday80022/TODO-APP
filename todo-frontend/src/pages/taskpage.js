import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import "../styles/taskpage.css";
import { AuthContext } from "../context/AuthContext";

const TaskPage = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("low");
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.post("http://localhost:5000/gettodos", {
          id: user.id,
        });
        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    if (user?.id) {
      fetchTodos();
    }
  }, [user]);

  const addTodo = async () => {
    if (!task) return;
    try {
      const response = await axios.post("http://localhost:5000/addtodo", {
        user_id: user.id,
        task,
        priority,
      });
      if (response.data.error) {
        console.error("Error adding todo:", response.data.error);
      } else {
        setTodos([...todos, response.data]);
        setTask("");
        setPriority("low");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const updateStatus = async (id, iscompleted) => {
    try {
      await axios.put(`http://localhost:5000/updatetask/${id}`, {
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

  const changePriority = async (id, priority) => {
    try {
      await axios.put(`http://localhost:5000/updatetask/${id}`, { priority });
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
      );
    } catch (error) {
      console.error("Error changing priority:", error);
    }
  };

  const editTask = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/updatetask/${id}`,
        {
          editedTask,
        }
      );
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
      console.error("Error editing task:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.put(`http://localhost:5000/delete/${id}`);
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
        <div className="task-input-wrapper">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Type a new task..."
            className="task-input"
          />
          <select
            className="priority-dropdown"
            onChange={(e) => setPriority(e.target.value)}
            value={priority}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <ul className="task-list">
        {todos.map((todo) => (
          <li key={todo.id} className="task-item">
            <input
              type="checkbox"
              checked={todo.iscompleted}
              onChange={() => updateStatus(todo.id, todo.iscompleted)}
              className="task-checkbox"
            />
            {editingId === todo.id ? (
              <div className="task-input-wrapper">
                <input
                  className="task-input"
                  value={editedTask}
                  // autoFocus
                  onChange={(e) => setEditedTask(e.target.value)}
                  onBlur={() => editTask(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") editTask(todo.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
                <select
                  className="priority-dropdown"
                  onChange={(e) => changePriority(todo.id, e.target.value)}
                  value={todo.priority || "low"}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setEditingId(null);
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            ) : (
              <>
                <span
                  className={`task-text ${todo.iscompleted ? "completed" : ""}`}
                >
                  {todo.task}
                </span>
                <span>{todo.priority}</span>
              </>
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
