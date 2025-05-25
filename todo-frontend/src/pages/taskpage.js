import React, { useEffect, useState, useContext } from "react";
import axios from "axios";

import CurrentTasks from "./currenttasks";
import CompletedTasks from "./completedtasks";
import DeletedTasks from "./deletedtasks";
import { AuthContext } from "../context/AuthContext";

const TaskPage = () => {
  const [activeTab, setActiveTab] = useState("currentTasks");
  const [todos, setTodos] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.post("http://https://todo-app-backend-jig8.onrender.com//gettodos/", {
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="task-page">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "currentTasks" ? "active" : ""}`}
          onClick={() => handleTabChange("currentTasks")}
        >
          Current Tasks
        </button>
        <button
          className={`tab ${activeTab === "completedTasks" ? "active" : ""}`}
          onClick={() => handleTabChange("completedTasks")}
        >
          Completed Tasks
        </button>
        <button
          className={`tab ${activeTab === "deletedTasks" ? "active" : ""}`}
          onClick={() => handleTabChange("deletedTasks")}
        >
          Deleted Tasks
        </button>
      </div>
      {activeTab === "currentTasks" && (
        <CurrentTasks alltodos={todos} setTodos={setTodos} />
      )}
      {activeTab === "completedTasks" && (
        <CompletedTasks alltodos={todos} setTodos={setTodos} />
      )}
      {activeTab === "deletedTasks" && (
        <DeletedTasks alltodos={todos} setTodos={setTodos} />
      )}
    </div>
  );
};

export default TaskPage;
