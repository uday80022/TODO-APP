import React from "react";
import axios from "axios";

const CompletedTasks = ({ alltodos, setTodos }) => {
  const todos = alltodos.filter((todo) => !todo.is_deleted && todo.iscompleted);

  const updateStatus = async (id, iscompleted) => {
    try {
      await axios.put(`http://localhost:5000/updatetask/${id}`, {
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
