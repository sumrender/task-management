import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStates = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  private isStatusValue(status): boolean {
    const idx = this.allowedStates.indexOf(status);

    return idx !== -1;
  }

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValue(value))
      throw new BadRequestException(`${value} is an invalid status`);

    return value;
  }
}
