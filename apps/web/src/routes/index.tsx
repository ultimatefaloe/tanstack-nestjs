import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "../logo.svg";
import { useState } from "react";
import type { Task } from "@/types/type";
import { TaskCard } from "@/components/TaskCard";
import { useTasksQuery } from "@/lib/queries";
import { TasksLoading } from "@/components/ui/TaskLoading";
import { TasksError } from "@/components/ui/TaskError";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [filter, setFilter] = useState<Task["status"] | "all">("all");
  let tasks: Task[];

  const { data, isLoading, error } = useTasksQuery();

  if (!data?.data) return error;
  tasks = data.data;

  // Filter tasks based on selected filter
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  // Task statistics
  const taskStats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };

  if (isLoading) {
    return <TasksLoading />;
  }

  if (error) {
    return <TasksError error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                TanStack Task Manager
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Manage your tasks efficiently with React & TanStack
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  href="https://tanstack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn TanStack
                </a>
                <Link
                  className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  to="/tasks"
                >
                  View Tasks
                </Link>
              </div>
            </div>
            <div className="w-48 h-48">
              <img
                src={logo}
                className="w-full h-full animate-[spin_20s_linear_infinite]"
                alt="TanStack Logo"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">
                {taskStats.total}
              </div>
              <div className="text-gray-600 mt-2">Total Tasks</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">
                {taskStats.done}
              </div>
              <div className="text-gray-600 mt-2">Done</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">
                {taskStats.inProgress}
              </div>
              <div className="text-gray-600 mt-2">In Progress</div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {taskStats.pending}
              </div>
              <div className="text-gray-600 mt-2">Pending</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tasks Section */}
      <section id="tasks" className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your Tasks
            </h2>
            <p className="text-gray-600 mb-6">
              Manage and track all your tasks in one place
            </p>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("in-progress")}
                className={`px-4 py-2 rounded-lg ${filter === "in-progress" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilter("done")}
                className={`px-4 py-2 rounded-lg ${filter === "done" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Done
              </button>
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500">
                Try changing your filter or add new tasks.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">Built with React & TanStack</p>
          <div className="flex justify-center gap-6">
            <a
              className="text-blue-300 hover:text-white hover:underline"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              React Docs
            </a>
            <a
              className="text-blue-300 hover:text-white hover:underline"
              href="https://tanstack.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              TanStack Docs
            </a>
            <a
              className="text-blue-300 hover:text-white hover:underline"
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tailwind CSS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
