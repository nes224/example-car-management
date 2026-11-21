import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Repository, EntityManager, Brackets } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { SearchCarDto } from './dto/search-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly entityManager: EntityManager,
  ) {}

  async search(dto: SearchCarDto): Promise<any> {
    const {
      where = {},
      order_by = 'desc',
      limit = 20,
      offset = 0,
      keyword,
    } = dto;
    const qb = this.carRepository.createQueryBuilder('car');

    if (where.province)
      qb.andWhere('car.province = :province', { province: where.province });
    if (where.brand) qb.andWhere('car.brand = :brand', { brand: where.brand });
    if (where.model) qb.andWhere('car.model = :model', { model: where.model });
    if (where.color) qb.andWhere('car.color = :color', { color: where.color });
    if (where.year) qb.andWhere('car.year = :year', { year: where.year });

    if (keyword?.trim()) {
      const kw = `%${keyword.trim().replace(/[%_\\]/g, '\\$&')}%`;
      qb.andWhere(
        new Brackets((b) => {
          b.where('car.licensePlate ILIKE :kw', { kw })
            .orWhere('car.brand ILIKE :kw', { kw })
            .orWhere('car.model ILIKE :kw', { kw })
            .orWhere('car.province ILIKE :kw', { kw })
            .orWhere('car.color ILIKE :kw', { kw })
            .orWhere('CAST(car.year AS TEXT) ILIKE :kw', { kw });
        }),
      );
    }

    qb.orderBy('car.createdAt', order_by === 'asc' ? 'ASC' : 'DESC')
      .skip(offset)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, limit, offset };
  }

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
