import React from "react";
import { FaTrashRestore } from "react-icons/fa";
import axios from "axios";

const DeletedTasks = ({ alltodos, setTodos }) => {
  const todos = alltodos.filter((todo) => todo.is_deleted);

  const restoreTodo = async (id) => {
    try {
      await axios.put(`http://localhost:5000/restore/${id}`);
      setTodos(
        alltodos.map((todo) =>
          todo.id === id ? { ...todo, is_deleted: 0 } : todo
        )
      );
    } catch (error) {
      console.error("Error restoring todo:", error);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">Deleted Tasks</h1>
      {todos.length === 0 ? (
        <p className="todo-empty-tasks">No deleted tasks yet</p>
      ) : (
        <ul className="task-list">
          {todos.map((todo) => (
            <li key={todo.id} className="task-item">
              <span
                className={`task-text ${todo.iscompleted ? "completed" : ""}`}
              >
                {todo.task}
              </span>
              <span className="task-priority">
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
              <FaTrashRestore
                className="task-icon restore-icon"
                onClick={() => restoreTodo(todo.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeletedTasks;
