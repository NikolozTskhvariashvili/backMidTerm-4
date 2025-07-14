import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schemas/user.entity';

@Module({
  imports:[
    MongooseModule.forFeature([{
      schema:userSchema, name:'user'
    }])
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
