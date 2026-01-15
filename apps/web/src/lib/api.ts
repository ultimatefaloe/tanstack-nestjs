import type { Task, ApiResponse } from "@/types/type";

const API_URL = import.meta.env.VITE_API_URL;


export const api = {
  list: async (params?: {
    status?: string,
    search?: string
  }): Promise<ApiResponse<Task[]>> => {
    const searchParams = new URLSearchParams()

    if (params?.status && params.status !== 'all') searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const res = await fetch(`${API_URL}/tasks?${query ? query : ''}`);
    if (!res.ok) throw new Error("Failed to fetch tasks")
    return res.json()
  },
  get: async (id: string): Promise<ApiResponse<Task>> => {
    if (!id) throw new Error("Task Id is required")
    const res = await fetch(`${API_URL}/tasks/${id}`)
    if (!res.ok) throw new Error("Task not fpund")
    return res.json()
  },
  create: async (data: {
    title: string,
    status: string,
    description: string;
  }): Promise<ApiResponse<Task>> => {
    if (!data.title && !data.description) throw new Error('Provide a valid data')
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error("Failed to create task")
    return res.json()
  },
  update: async (id: string, data: {
    title?: string,
    status?: string,
    description?: string;
  }): Promise<ApiResponse<Task>> => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error("Failed to update task")
    return res.json()
  },
  delete: async (id: string): Promise<ApiResponse<Task>> => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error("Failed to delete task")
    return res.json()
  }
}