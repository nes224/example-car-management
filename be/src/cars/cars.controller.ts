import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
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
import { QueryFilter } from 'src/helpers/queryfilter/queryfilter.dto';
import { KeywordQueryFilter } from 'src/helpers/queryfilter/keywordqueryfilter.dto';
import { SearchCarDto } from './dto/search-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post('search')
  async search(
    @Body() dto: SearchCarDto,
    @Res() res: Response,
  ): Promise<Response> {
    let response: responseDto;
    const result = await this.carsService.search(dto);
    response = successRsp('Search car is success', result);
    return res.status(HttpStatus.OK).send(response);
  }

  @Post()
  async create(
    @Body() createCarDto: CreateCarDto,
    @Res() res: Response,
  ): Promise<Response> {
    let response: responseDto;
    const create: Car = await this.carsService.create(createCarDto);
    response = createRsp('Create car is success', create);
    return res.status(HttpStatus.CREATED).send(response);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    let response: responseDto;

    if (id === '') {
      response = badRequest('Id is empty', null);
      return res.status(HttpStatus.BAD_REQUEST).send(response);
    }

    const car: Car = await this.carsService.findOne(id);
    if (car === null) {
      response = notFound(`Not found car with this id:`, null);
      return res.status(HttpStatus.NOT_FOUND).send(response);
    }
    response = successRsp('Find car by id is success', car);
    return res.status(HttpStatus.OK).send(response);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
    @Res() res: Response,
  ): Promise<Response> {
    let response: responseDto;

    if (id === '') {
      response = badRequest('Id is empty', null);
      return res.status(HttpStatus.BAD_REQUEST).send(response);
    }

    try {
      const update: Car = await this.carsService.update(id, updateCarDto);
      response = successRsp('Update car is success', update);
      return res.status(HttpStatus.OK).send(response);
    } catch (error) {
      response = internalServerError(
        error instanceof Error ? error.message : 'Unknown error',
        null,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response);
    }
  }

  @Delete(':id')
  async deleteById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    let response: responseDto;
    if (id === '') {
      response = badRequest('Id is empty', null);
      return res.status(HttpStatus.BAD_REQUEST).send(response);
    }

    await this.carsService.deleteById(id);
    response = successRsp('Delete car is success', null);
    return res.status(HttpStatus.OK).send(response);
  }
}
