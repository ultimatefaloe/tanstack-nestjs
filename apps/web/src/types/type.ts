export type Task = {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'done'
  createdAt?: string
  updatedAt?: string
}

export type TaskStatusFilter = Task["status"] | 'all';

export type ApiResponse<T> = {
  success: string,
  message: string,
  data: T
}