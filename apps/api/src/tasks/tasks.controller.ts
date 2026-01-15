import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateTaskDto, UpdateTaskDto } from "./dto";
import { TasksService } from "./tasks.service";

@Controller('tasks')
export class TaskController {

  constructor(
    private readonly taskService: TasksService
  ) { }

  @Post()
  createTask(@Body() dto: CreateTaskDto) {
    return this.taskService.create(dto)
  }

  @Get()
  getAll(@Query('search') search: string, @Query('status') status: string) {
    return this.taskService.getAll(status, search)
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.taskService.getOne(id)
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto)
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.delete(id)
  }
}