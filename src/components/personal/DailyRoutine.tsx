"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { generateId } from "@/lib/utils";
import { dailyRoutineStorage } from "@/lib/db";
import { Trash2, Edit2 } from "lucide-react";
import type { RoutineTask } from "@/types/trading";

export default function DailyRoutine() {
  const [tasks, setTasks] = React.useState<RoutineTask[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    category: "work",
    time: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => t.date === today);
  const completedCount = todayTasks.filter((t) => t.completed).length;

  // Load from storage on mount
  React.useEffect(() => {
    const savedTasks = dailyRoutineStorage.get();
    setTasks(savedTasks);
    setIsLoaded(true);
  }, []);

  // Save to storage whenever tasks change
  React.useEffect(() => {
    if (isLoaded) {
      dailyRoutineStorage.save(tasks);
    }
  }, [tasks, isLoaded]);

  const handleAdd = () => {
    if (!formData.title) {
      alert("Please enter a task");
      return;
    }

    const task: RoutineTask = {
      id: generateId(),
      title: formData.title,
      completed: false,
      category: formData.category,
      time: formData.time,
      date: today,
    };

    setTasks([...tasks, task]);
    setFormData({ title: "", category: "work", time: "" });
    setShowForm(false);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-2">Today's Progress</p>
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {completedCount}/{todayTasks.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{
                  width:
                    todayTasks.length > 0
                      ? `${(completedCount / todayTasks.length) * 100}%`
                      : "0%",
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Task */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="primary">
          Add Task
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <h3>Add New Task</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
              </select>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                placeholder="Time (optional)"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleAdd}
                >
                  Add Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <h3>Today's Tasks</h3>
        </CardHeader>
        <CardContent>
          {todayTasks.length === 0 ? (
            <p className="text-gray-500">
              No tasks yet. Add one to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg ${
                    task.completed
                      ? "bg-green-50 border-green-200 dark:bg-navy-700 dark:border-green-900"
                      : "border-gray-200 dark:border-navy-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">{task.category}</p>
                  </div>
                  {task.time && (
                    <span className="text-sm font-medium">{task.time}</span>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
