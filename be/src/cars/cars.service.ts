import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const create: Car = this.carRepository.create(createCarDto);
    await this.carRepository.save(create);
    try {
      return await this.carRepository.save(create);
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: string): Promise<Car> {
    if (id === '') {
      return null;
    }
    const car: Car = await this.carRepository.findOneBy({ id });
    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    let car: Car = await this.carRepository.findOneBy({ id });
    if (updateCarDto.brand !== '') {
      car.brand = updateCarDto.brand;
    }

    if (updateCarDto.color !== '') {
      car.color = updateCarDto.color;
    }

    if (updateCarDto.licensePlate !== '') {
      car.licensePlate = updateCarDto.licensePlate;
    }

    if (updateCarDto.model !== '') {
      car.model = updateCarDto.model;
    }

    if (updateCarDto.province !== '') {
      car.province = updateCarDto.province;
    }

    if (updateCarDto.remark !== '') {
      car.remark = updateCarDto.remark;
    }

    if (updateCarDto.year !== car.year) {
      car.year = updateCarDto.year;
    }

    car.updatedAt = new Date();
    const updated: Car = await this.entityManager.save(car);
    car = updated;
    return car;
  }

  async deleteById(id: string): Promise<Car> {
    let car: Car = await this.carRepository.findOneBy({ id });

    car.deletedAt = new Date();
    const updated: Car = await this.entityManager.save(car);
    car = updated;

    return car;
  }
}
