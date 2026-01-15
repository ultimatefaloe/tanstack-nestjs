import { TaskCard } from "@/components/TaskCard";
import { TasksError } from "@/components/ui/TaskError";
import { TasksLoading } from "@/components/ui/TaskLoading";
import { useCreateTaskMutation, useTasksQuery } from "@/lib/queries";
import type { Task, TaskStatusFilter } from "@/types/type";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type TasksSearch = {
  search?: string;
  status?: TaskStatusFilter;
};

export const Route = createFileRoute("/tasks/")({
  validateSearch: (search: Record<string, unknown>): TasksSearch => ({
    search: (search.search as string) || "",
    status: (search.status as TaskStatusFilter) || "all",
  }),
  component: TaskPage,
});

function TaskPage() {
  const [filter, setFilter] = useState<Task["status"] | "all">("all");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate({ from: Route.fullPath });

  const { status, search } = Route.useSearch();
  let tasks: Task[];

  const { data, isLoading, error } = useTasksQuery({ search, status });
  if (!data?.data) return error;
  tasks = data?.data;

  const handleTaskStatusFilter = (newStatus: TaskStatusFilter) => {
    setFilter(newStatus);
    navigate({
      search: (prev) => ({ ...prev, status: newStatus }),
    });
  };
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
    <div>
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
        <div className="flex justify-end items-center container mx-auto px-4 my-2">
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New Task
          </button>
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
                onClick={() => handleTaskStatusFilter("all")}
                className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => handleTaskStatusFilter("pending")}
                className={`px-4 py-2 rounded-lg ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Pending
              </button>
              <button
                onClick={() => handleTaskStatusFilter("in-progress")}
                className={`px-4 py-2 rounded-lg ${filter === "in-progress" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleTaskStatusFilter("done")}
                className={`px-4 py-2 rounded-lg ${filter === "done" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Done
              </button>
            </div>
          </div>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {tasks.length === 0 && (
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

      {/* Create Task Modal */}
      {isCreating && <CreateTaskModal onClose={() => setIsCreating(false)} />}
    </div>
  );
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatusFilter>('pending');
  const [description, setDescription] = useState("");

  const createMutation = useCreateTaskMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createMutation.mutate({ title, status, description }, { onSuccess: () => onclose});
  };

  const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-800' },
];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatusFilter)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400"
            >
              <option value="" disabled className="text-gray-500">
                Select a status...
              </option>
              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="py-2"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
