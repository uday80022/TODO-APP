import React, { useState } from "react";
import axios from "axios";
import { FaFilter } from "react-icons/fa";

const CompletedTasks = ({ alltodos, setTodos }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("");
  const todos = alltodos.filter(
    (todo) =>
      !todo.is_deleted &&
      todo.iscompleted &&
      todo.task.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priorityFilter === "" || todo.priority === priorityFilter)
  );

  const updateStatus = async (id, iscompleted) => {
    try {
      await axios.put(`https://todo-app-backend-jig8.onrender.com/updatetask/${id}`, {
        iscompleted: !iscompleted,
      });
      setTodos(
        alltodos.map((todo) =>
          todo.id === id ? { ...todo, iscompleted: !iscompleted } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">Completed Tasks</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          className="task-input"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaFilter
          className="filter-icon"
          onClick={() => setIsFilterVisible(!isFilterVisible)}
        />
        {isFilterVisible && (
          <div className="filter-popup">
            <div className="filter-popup-content">
              <h3 className="filter-popup-title">Filter Options</h3>
              <label className="filter-label">Filter by Priority:</label>
              <select
                className="filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                className="filter-close-button"
                onClick={() => setIsFilterVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {todos.length === 0 ? (
        <p className="todo-empty-tasks">No completed tasks yet</p>
      ) : (
        <ul className="task-list">
          {todos.map((todo) => (
            <li key={todo.id} className="task-item">
              <input
                type="checkbox"
                checked={todo.iscompleted}
                onChange={() => updateStatus(todo.id, todo.iscompleted)}
                className="task-checkbox"
              />
              <span
                className={`task-text ${todo.iscompleted ? "completed" : ""}`}
              >
                {todo.task}
              </span>
              <span className="task-priority">
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTasks;
