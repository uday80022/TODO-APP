import React, { useState, useContext } from "react";
import axios from "axios";
import { FaFilter } from "react-icons/fa";

import {
  FaPlus,
  FaPencilAlt,
  FaTrashAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import "../styles/taskpage.css";
import { AuthContext } from "../context/AuthContext";
import { usePopup } from "../context/PopupContext";

const CurrentTasks = ({ alltodos, setTodos }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("");
  let todos = (alltodos || []).filter(
    (todo) =>
      !todo.is_deleted &&
      !todo.iscompleted &&
      todo.task.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (priorityFilter === "" || todo.priority === priorityFilter)
  );
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("low");
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  const { user } = useContext(AuthContext);
  const { showPopup } = usePopup();

  const addTodo = async () => {
    if (!task) return;
    try {
      const response = await axios.post("http://https://todo-app-backend-jig8.onrender.com//addtodo", {
        user_id: user.id,
        task,
        priority,
        sort_order: todos.length + 1,
      });
      if (response.data.error) {
        console.error("Error adding todo:", response.data.error);
      } else {
        setTodos([...response.data]);
        setTask("");
        setPriority("low");
        showPopup({
          message: task + " added successfully!",
          duration: 3000,
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const updateStatus = async (id, iscompleted) => {
    try {
      await axios.put(`http://https://todo-app-backend-jig8.onrender.com//updatetask/${id}`, {
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

  const startEditing = (id, task) => {
    setEditingId(id);
    setEditedTask(task);
  };

  const changePriority = async (id, priority) => {
    try {
      await axios.put(`http://https://todo-app-backend-jig8.onrender.com//updatetask/${id}`, { priority });
      setTodos(
        alltodos.map((todo) => (todo.id === id ? { ...todo, priority } : todo))
      );
    } catch (error) {
      console.error("Error changing priority:", error);
    }
  };

  const editTask = async (id) => {
    try {
      const response = await axios.put(
        `http://https://todo-app-backend-jig8.onrender.com//updatetask/${id}`,
        {
          editedTask,
        }
      );
      if (response.data.success) {
        setTodos(
          alltodos.map((todo) =>
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

  const updateOrder = async (id, direction) => {
    try {
      const filteredTodos = todos.filter((todo) => !todo.is_deleted);
      const currentIndex = filteredTodos.findIndex((todo) => todo.id === id);

      let swap_index;
      if (direction === "up" && currentIndex > 0) {
        swap_index = currentIndex - 1;
      } else if (
        direction === "down" &&
        currentIndex < filteredTodos.length - 1
      ) {
        swap_index = currentIndex + 1;
      } else {
        alert("Move not possible :already at the edge ");
        return;
      }
      const swap_sort_id = filteredTodos[swap_index].sort_order;
      const current_sort_id = filteredTodos[currentIndex].sort_order;

      const response = await axios.put(`http://https://todo-app-backend-jig8.onrender.com//updateorder`, {
        id,
        user_id: user.id,
        swap_sort_id,
        current_sort_id,
      });
      if (response.data.error) {
        console.error("Error updating order:", response.data.error);
      } else {
        setTodos([...response.data]);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.put(`http://https://todo-app-backend-jig8.onrender.com//delete/${id}`);
      setTodos(
        alltodos.map((todo) => {
          return todo.id === id ? { ...todo, is_deleted: true } : todo;
        })
      );
      showPopup({
        message: "Task deleted successfully!",
        duration: 3000,
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">My Tasks</h1>
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
            placeholder="New task..."
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
          <button
            className="ordering-button"
            onClick={() => {
              setIsOrdering(!isOrdering);
              showPopup({
                message: isOrdering
                  ? "Task ordering mode exited. Changes saved."
                  : "Task ordering mode activated. Move tasks to reorder.",
                duration: 3000,
                type: "info",
              });
            }}
          >
            {isOrdering ? "Stop" : "Order"}
          </button>
        </div>
      </div>
      <>
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
          <p className="todo-empty-tasks">No active tasks yet</p>
        ) : (
          <>
            <ul className="task-list adjust-list">
              {todos
                .filter((todo) => !todo.is_deleted)
                .map((todo) => (
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
                          onChange={(e) =>
                            changePriority(todo.id, e.target.value)
                          }
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
                          className={`task-text ${
                            todo.iscompleted ? "completed" : ""
                          }`}
                        >
                          {todo.task}
                        </span>
                        <span className="task-priority">
                          {todo.priority.charAt(0).toUpperCase() +
                            todo.priority.slice(1)}
                        </span>
                      </>
                    )}
                    {isOrdering ? (
                      <div className="task-actions">
                        <FaArrowUp
                          className="task-icon edit-icon"
                          onClick={() => updateOrder(todo.id, "up")}
                        />
                        <FaArrowDown
                          className="task-icon delete-icon"
                          onClick={() => updateOrder(todo.id, "down")}
                        />
                      </div>
                    ) : (
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
                    )}
                  </li>
                ))}
            </ul>
          </>
        )}
      </>
    </div>
  );
};

export default CurrentTasks;
