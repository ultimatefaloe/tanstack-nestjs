import { AlertCircle } from "lucide-react";

export function TasksError({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2 text-red-800">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Error loading tasks</span>
      </div>
      <p className="text-red-600 text-sm mt-1">{error.message}</p>
    </div>
  );
}