import type { Task } from "@/types/type";
import { Link } from "@tanstack/react-router";

export function TaskCard({ task }: { task: Task }) {
  // Function to get status color
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
          >
            {task.status.replace("-", " ").toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{task.description}</p>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {task.createdAt && (
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Create At: {new Date(task.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <Link
          to="/tasks/$taskId"
          params={{ taskId: task.id }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
