import { Injectable } from "@nestjs/common";
import { TaskEntity } from "./task.entity";
import { CreateTaskDto, UpdateTaskDto } from "./dto";

@Injectable()
export class TasksService {
  private tasks: TaskEntity[] = [
    {
      id: "1",
      title: "Design homepage",
      description: "Create the initial wireframe and UI design for the homepage",
      status: "pending",
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    },
    {
      id: "2",
      title: "Set up backend",
      description: "Initialize the server and configure the database",
      status: "in-progress",
      createdAt: new Date("2025-01-02"),
      updatedAt: new Date("2025-01-03"),
    },
    {
      id: "3",
      title: "Implement authentication",
      description: "Add login and registration functionality",
      status: "pending",
      createdAt: new Date("2025-01-03"),
      updatedAt: new Date("2025-01-03"),
    },
    {
      id: "4",
      title: "Write unit tests",
      description: "Create unit tests for core services",
      status: "completed",
      createdAt: new Date("2024-12-28"),
      updatedAt: new Date("2025-01-01"),
    },
    {
      id: "5",
      title: "Deploy application",
      description: "Deploy the app to the production environment",
      status: "pending",
      createdAt: new Date("2025-01-04"),
      updatedAt: new Date("2025-01-04"),
    }
  ]

  getAll(status: string, search: string) {
    const normalizeStatus = status?.toLowerCase()
    const normalizeSearch = search?.toLowerCase()
    let tasks: TaskEntity[] = this.tasks.filter((task) => {
      if (normalizeStatus && task.status.toLowerCase() !== normalizeStatus) return false
      if (normalizeSearch && !task.description.toLowerCase().includes(normalizeSearch)) return false
      return true
    })

    return { success: true, message: tasks.length > 0 ? 'Tasks found' : 'No task found', data: tasks }
  }

  getOne(id: string) {
    if (!id) return { success: false, message: 'Id is required' }
    const task = this.tasks.find(t => t.id === id)
    return { success: !!task, message: task ? 'Task found' : 'No task', data: task ?? null }
  }

  create(dto: CreateTaskDto) {
    if (!dto?.title || !dto?.description || !dto.status) return { success: false, message: 'Invalid task data' };
    const id = crypto.randomUUID();
    const task = { id, ...dto, createdAt: new Date(), updatedAt: new Date() };
    this.tasks.push(task);
    return { success: !!task, message: "Task Created", data: task ?? null }
  }

  update(id: string, dto: UpdateTaskDto) {
    console.log(dto)
    if (!id) return { success: false, message: 'Id is required' }
    if (!dto) return { success: false, message: 'DTO data is missing' }
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) return { success: false, message: "Task not found" }
    const updatedTask = {
      ...this.tasks[index],
      ...dto,
      updatedAt: new Date()
    }
    this.tasks[index] = updatedTask
    return { success: !!updatedTask, message: "Task Updated", data: updatedTask ?? null }
  }

  delete(id: string) {
    if (!id) return { success: false, message: 'Id is required' }
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    if (this.tasks.length === initialLength) return { success: false, message: 'Task not found' };
    return { success: true, message: "Task deleted", data: this.tasks }
  }

}