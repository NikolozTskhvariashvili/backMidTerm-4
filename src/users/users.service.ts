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

  async create({ age, email, fullName, gender }: CreateUserDto) {
    const existedUser = await this.userModel.findOne({ email });
    if (existedUser) throw new BadRequestException('user already exist');

    const newUser = await this.userModel.create({
      fullName,
      age,
      email,
      gender,
    });
    return { message: 'user created succ', data: newUser };
  }

  async findAll(
    page: number,
    take: number,
    { age, ageFrom, ageTo, gender, nickName }: QueryParamDro,
  ) {
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

    console.log(page, take);

    const users = await this.userModel
      .find(filter)
      .skip((page - 1) * take)
      .limit(take);
    return users;
  }

  async findOne(id) {
    if (!isValidObjectId(id)) throw new BadRequestException('invalid id');
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('usr not found');
    return user;
  }

  async update(id: number, { age, email, fullName, gender }: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('invalid id');

    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('user not found');

    const updateReq: any = {};

    if (age) updateReq.age = age;
    if (email) updateReq.email = email;
    if (fullName) updateReq.fullName = fullName;
    if (gender) updateReq.gender = gender;

    await this.userModel.findByIdAndUpdate(id, updateReq, { new: true });
    return 'updated succses';
  }

  async remove(id: number) {
    if (!isValidObjectId(id)) throw new BadRequestException('invalid id');

    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('user not found');

    await this.userModel.findByIdAndDelete(id);
    return 'user delte suucsc';
  }
}
