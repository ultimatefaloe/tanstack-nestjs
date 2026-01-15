import type { Task } from '../types/type';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "./api"

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: { search?: string, status?: string }) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'details' as const],
  detail: (id: string) => [...taskKeys.details(), id] as const
}

export const useTasksQuery = (filters?: { search?: string, status?: string }) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => api.list(filters)
  })
}

export const useTaskQuery = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => api.get(id)
  })
}

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string, status: string, description: string }) => api.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
  })
}

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      api.update(id, data),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
};


export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    }
  })
}