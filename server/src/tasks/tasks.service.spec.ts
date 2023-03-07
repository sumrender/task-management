import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({});

describe('TaskService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: Repository<Task>, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<Repository<Task>>(Repository<Task>);
  });
});
