import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useState } from "react";
import {
  Edit2,
  Trash2,
  ArrowLeft,
  Calendar,
  User,
  Clock,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  MoreVertical,
  Copy,
  Share2,
} from "lucide-react";
import type { Task } from "@/types/type";
import {
  useDeleteTaskMutation,
  useTaskQuery,
  useUpdateTaskMutation,
} from "@/lib/queries";
import { TasksLoading } from "@/components/ui/TaskLoading";
import { TasksError } from "@/components/ui/TaskError";
import { toast } from "react-toastify";

export const Route = createFileRoute("/tasks/$taskId")({
  component: TaskDetail,
});

function TaskDetail() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  let task: Task;

  const createUpdateMutation = useUpdateTaskMutation();
  const createDeleteMutation = useDeleteTaskMutation();

  const { data, isLoading, error } = useTaskQuery(taskId);
  if (!data || !data.data) return error;
  task = data.data;

  // Handle status update
  const handleStatusUpdate = async (newStatus: Task["status"]) => {
    createUpdateMutation.mutate(
      { id: taskId, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success("Task Updated");
        },
      }
    );
  };

  // Handle task edit
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle task deletion
  const handleDelete = async () => {
    createDeleteMutation.mutate(taskId, {
      onSuccess: () => {
        toast.error("Task deleted");
        navigate({ to: "/tasks" });
      },
    });
  };

  // Format date

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color and icon
  const getStatusConfig = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: AlertCircle,
          label: "Pending",
        };
      case "in-progress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: PlayCircle,
          label: "In Progress",
        };
      case "done":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          label: "Done",
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);

  if (isLoading) {
    return <TasksLoading />;
  }

  if (error) {
    return <TasksError error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Description & Status Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-3">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Tittle</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {task.title}
                  </p>
                </div>
              </div>
              {/* Description Card */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Update Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Update Status
              </h2>
              <p className="text-gray-600 mb-6">
                Change the current status of this task:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pending Button */}
                <button
                  onClick={() => handleStatusUpdate("pending")}
                  disabled={task.status === "pending"}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    task.status === "pending"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-400 hover:bg-yellow-50"
                  }`}
                >
                  <AlertCircle
                    className={`w-8 h-8 mb-3 ${
                      task.status === "pending"
                        ? "text-yellow-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="font-semibold text-gray-900">Pending</span>
                  <span className="text-sm text-gray-600 mt-1">
                    Task needs attention
                  </span>
                  {task.status === "pending" && (
                    <span className="mt-3 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Current Status
                    </span>
                  )}
                </button>

                {/* In Progress Button */}
                <button
                  onClick={() => handleStatusUpdate("in-progress")}
                  disabled={task.status === "in-progress"}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    task.status === "in-progress"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  <PlayCircle
                    className={`w-8 h-8 mb-3 ${
                      task.status === "in-progress"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="font-semibold text-gray-900">
                    In Progress
                  </span>
                  <span className="text-sm text-gray-600 mt-1">
                    Currently working on
                  </span>
                  {task.status === "in-progress" && (
                    <span className="mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Current Status
                    </span>
                  )}
                </button>

                {/* Done Button */}
                <button
                  onClick={() => handleStatusUpdate("done")}
                  disabled={task.status === "done"}
                  className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    task.status === "done"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-400 hover:bg-green-50"
                  }`}
                >
                  <CheckCircle
                    className={`w-8 h-8 mb-3 ${
                      task.status === "done"
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="font-semibold text-gray-900">Done</span>
                  <span className="text-sm text-gray-600 mt-1">
                    Task completed
                  </span>
                  {task.status === "done" && (
                    <span className="mt-3 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Current Status
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Task Details */}
          <div className="space-y-6">
            {/* Task Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Task Details
              </h2>

              <div className="space-y-4">
                {/* Created At */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(task?.createdAt ?? "")}
                    </p>
                  </div>
                </div>

                {/* Updated At */}
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(task?.createdAt ?? "")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Activity Log (Placeholder) */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">You</span> updated status to{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                    <p className="text-gray-500 text-xs mt-1">Just now</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Sarah</span> commented on this
                    task
                    <p className="text-gray-500 text-xs mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => navigate({ to: "/tasks" })}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  View All Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Task
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "
                <span className="font-semibold">{task.title}</span>"? All task
                data will be permanently removed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
