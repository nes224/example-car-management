import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Response } from 'express';
import { Car } from './entities/car.entity';
import { responseDto } from '../helpers/response/response.dto';
import {
  createRsp,
  successRsp,
  notFound,
  badRequest,
  internalServerError,
} from '../helpers/response/response.util';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  async create(
    @Body() createCarDto: CreateCarDto,
    @Res() res: Response,
  ): Promise<responseDto> {
    const create: Car = await this.carsService.create(createCarDto);
    return createRsp('Create car is successfully', create);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<responseDto> {
    if (id === '') {
      return badRequest('id is empty', null);
    }

    const car: Car = await this.carsService.findOne(id);
    if (car !== null) {
      return notFound('Not found car with this id', null);
    }
    return successRsp('Find car by id is success', car);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<responseDto> {
    if (id === '') {
      return badRequest('id is empty', null);
    }

    try {
      const update: Car = await this.carsService.update(id, updateCarDto);
      return successRsp('Update car is success', update);
    } catch (error) {
      return internalServerError(
        error instanceof Error ? error.message : 'Unknown error',
        null,
      );
    }
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<any> {
    if (id === '') {
      return badRequest('id is empty', null);
    }

    await this.carsService.deleteById(id);

    return successRsp('Delete car is success', null);
  }
}
