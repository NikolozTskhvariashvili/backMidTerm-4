import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schemas/user.entity';
import { faker } from '@faker-js/faker';
import { QueryParamDro } from './dto/query-param.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel('user') private userModel: Model<User>) {}

  async onModuleInit() {
    const count = await this.userModel.countDocuments();
    // await this.userModel.deleteMany();

    if (count === 0) {
      const dataToUsers: any[] = [];
      for (let i = 0; i <= 30000; i++) {
        const fullName =
          faker.person.firstName() + ' ' + faker.person.lastName();
        const gender = faker.person.sex();
        const age = faker.number.int({ min: 0, max: 100 });
        const email = faker.internet.email();

        dataToUsers.push({
          fullName,
          gender,
          age,
          email,
        });
      }
      await this.userModel.insertMany(dataToUsers);
      console.log('inserted successfully');
    }
  }

  async getAllUsersLength() {
    const userLength = await this.userModel.countDocuments();

    console.log(`lenght of all users is ${userLength}`);
    return userLength;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(page : number , take : number , {
    age,
    ageFrom,
    ageTo,
    gender,
    nickName,
  }: QueryParamDro) {
    const filter: any = {};
    if (nickName) {
      filter.fullName = { $regex: nickName, $options: 'i' };
    }
    if (age) {
      filter.age = Number(age);
    }
    if (ageFrom) {
      filter.age = { ...filter.age, $gte: ageFrom };
    }
    if (ageTo) {
      filter.age = { ...filter.age, $lte: ageTo };
    }
    if (gender) {
      filter.gender = gender;
    }

    console.log(page,take)

    const users = await this.userModel
      .find(filter)
      .skip((page - 1) * take)
      .limit(take);
    return users;
  }

  async findOne(id) {
    if(!isValidObjectId(id)) throw new BadRequestException('invalid id')
    const user = await this.userModel.findById(id)
  return user
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
